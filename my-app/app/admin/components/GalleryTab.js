
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GalleryTab = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [domain, setDomain] = useState('Agriculture');
    const router = useRouter();

    const DOMAINS = [
        'Agriculture',
        'Energy Availability & Efficiency',
        'Health & Hygiene',
        'Livelihood Enhancement',
        'Water Conservation',
        'Women Empowerment',
        'Social Community Actions',
        'Digital Literacy',
        'Green Innovation',
        'Quality Education',
        'Village Infrastructure'
    ];

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/dashboard/gallery');
            if (response.status === 401) {
                router.push('/GOP/Login');
                return;
            }
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch images');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Check file type - only images allowed
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed. Please select an image file.');
                e.target.value = ''; // Reset input
                setSelectedFile(null);
                return;
            }
            
            // Check file size - max 4MB
            if (file.size > 4 * 1024 * 1024) {
                alert('File size exceeds 4MB. Please choose a smaller file.');
                e.target.value = ''; // Reset input
                setSelectedFile(null);
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setError(null);

        try {
            // 1. Upload via Server API (Bypasses CORS)
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folder', 'gallery');

            const uploadRes = await fetch('/api/dashboard/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();
            
            if (!uploadRes.ok) {
                throw new Error(uploadData.error || 'Upload failed');
            }

            const { fileUrl } = uploadData;

            // 2. Save metadata to MongoDB
            const saveRes = await fetch('/api/dashboard/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageLink: fileUrl,
                    domain: domain
                }),
            });

            const saveData = await saveRes.json();
            if (saveData.success) {
                setImages([saveData.data, ...images]);
                setSelectedFile(null);
                // Reset file input
                document.getElementById('gallery-upload').value = '';
                alert('Image uploaded successfully!');
            } else {
                 throw new Error(saveData.error || 'Failed to save image data');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to upload image. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            const res = await fetch('/api/dashboard/gallery', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setImages(images.filter(img => img._id !== id));
            } else {
                alert(data.error || 'Failed to delete image');
            }
        } catch (err) {
            alert('Error deleting image');
        }
    };

    const handleOrderChange = async (id, newOrder) => {
        // Optimistic update
        const updatedImages = images.map(img => 
            img._id === id ? { ...img, order: parseInt(newOrder) || 0 } : img
        ).sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort immediately
        
        setImages(updatedImages);

        try {
            await fetch('/api/dashboard/gallery', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, order: parseInt(newOrder) || 0 })
            });
        } catch (err) {
            console.error('Failed to update order', err);
            fetchImages(); // Revert on failure
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Upload to Gallery</h3>
                        <p className="text-sm text-gray-500">Share new images with your audience</p>
                    </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Image File (Max 4MB)</label>
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {selectedFile ? (
                                       <div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-400">Click to change</p>
                                       </div>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-green-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className="text-sm text-gray-500"><span className="font-semibold text-green-600">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (Max 4MB)</p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    id="gallery-upload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    required
                                />
                            </label>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Domain</label>
                                <div className="relative">
                                    <select
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-green-500 focus:ring-green-500 border appearance-none"
                                    >
                                        {DOMAINS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Classify this image to help categorize the gallery.</p>
                            </div>
                            
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                                        uploading 
                                        ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:shadow-green-200'
                                    }`}
                                >
                                    {uploading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Upload Image
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Gallery Images</h3>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Total: {images.length}
                    </span>
                </div>
                
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                ) : images.length === 0 ? (
                     <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No images uploaded yet.</p>
                     </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img._id} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 transform">
                                <img
                                    src={img.imageLink}
                                    alt={img.domain}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {e.target.src = 'https://placehold.co/400?text=Image+Error'}}
                                />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleDelete(img._id)}
                                        className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                        title="Delete Image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-100">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold px-1 block mb-0.5">Order</span>
                                        <input 
                                            type="number" 
                                            defaultValue={img.order || 0}
                                            onBlur={(e) => handleOrderChange(img._id, e.target.value)}
                                            className="w-12 text-center text-sm font-bold border rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider mb-1 block">
                                        {img.domain}
                                    </span>
                                    <p className="text-gray-300 text-[10px]">
                                        Added {new Date(img.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}
        </div>
    );
};

export default GalleryTab;
