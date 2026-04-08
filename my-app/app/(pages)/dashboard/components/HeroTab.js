"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroTab = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',

        link: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch('/api/hero');
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch hero slides');
            const data = await response.json();
            if (data.success) {
                setSlides(data.data);
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
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB. Please choose a smaller file.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        try {
            let imageUrl = '';

            // Upload image if selected
            if (selectedFile || editingSlide) {
                if (selectedFile) {
                    const formDataUpload = new FormData();
                    formDataUpload.append('file', selectedFile);
                    formDataUpload.append('folder', 'hero');

                    const uploadRes = await fetch('/api/dashboard/upload', {
                        method: 'POST',
                        body: formDataUpload,
                    });

                    const uploadData = await uploadRes.json();
                    if (!uploadRes.ok) {
                        throw new Error(uploadData.error || 'Image upload failed');
                    }
                    imageUrl = uploadData.fileUrl;
                } else {
                    imageUrl = editingSlide.image;
                }
            } else {
                throw new Error("Image is required");
            }

            const url = editingSlide ? `/api/hero/${editingSlide._id}` : '/api/hero';
            const method = editingSlide ? 'PUT' : 'POST';

            const saveRes = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    image: imageUrl
                }),
            });

            const saveData = await saveRes.json();
            if (saveData.success) {
                if (editingSlide) {
                    setSlides(slides.map(s => s._id === editingSlide._id ? saveData.data : s));
                } else {
                    setSlides([...slides, saveData.data].sort((a, b) => a.order - b.order));
                }
                cancelForm();
                alert(editingSlide ? 'Hero slide updated successfully!' : 'Hero slide added successfully!');
            } else {
                throw new Error(saveData.error || 'Failed to save hero slide');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save hero slide. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/hero/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setSlides(slides.filter(s => s._id !== id));
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch (err) {
            alert('Error deleting slide');
        } finally {
            setDeletingId(null);
        }
    };

    const startEdit = (slide) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title,

            link: slide.link || '',
            order: slide.order || 0,
            isActive: slide.isActive
        });
        setSelectedFile(null);
        setShowCreateForm(true);
    };

    const cancelForm = () => {
        setShowCreateForm(false);
        setEditingSlide(null);
        setFormData({ title: '', link: '', order: 0, isActive: true });
        setSelectedFile(null);
        setError(null);
        const fileInput = document.getElementById('hero-image-upload');
        if (fileInput) fileInput.value = '';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                        </h3>
                        <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="Enter title"
                                    required
                                />
                            </div>
                            <div>
                                {/* Subtitle removed as requested */}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL (Optional)</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="e.g., /about"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="0"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">Active</span>
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image (Max 5MB)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="hero-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {selectedFile ? (
                                                <p className="mb-2 text-sm text-gray-700 font-semibold">{selectedFile.name}</p>
                                            ) : editingSlide ? (
                                                <>
                                                    <img src={editingSlide.image} alt="Current" className="h-20 w-auto mb-2 rounded" />
                                                    <p className="text-xs text-gray-400">Click to change image</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-green-600">Click to upload</span></p>
                                                </>
                                            )}
                                        </div>
                                        <input id="hero-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} required={!editingSlide} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-colors ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {uploading ? 'Saving...' : (editingSlide ? 'Update Slide' : 'Add Slide')}
                            </button>
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Hero Slides</h3>
                        <p className="text-sm text-gray-500">Manage home page banner slides</p>
                    </div>
                    {!showCreateForm && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Add New Slide
                        </button>
                    )}
                </div>

                {slides.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No slides found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {slides.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.order}</td>
                                        <td className="px-6 py-4">
                                            <img src={item.image} alt={item.title} className="h-16 w-32 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg mr-2">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg">
                                                {deletingId === item._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroTab;
