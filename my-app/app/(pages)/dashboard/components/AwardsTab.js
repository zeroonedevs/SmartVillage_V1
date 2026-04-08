"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AwardsTab = () => {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingAward, setEditingAward] = useState(null);
    const [migrating, setMigrating] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        year: '',
        description: ''
    });

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const response = await fetch('/api/awards');
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch awards');
            const data = await response.json();
            if (data.success) {
                setAwards(data.data);
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
            if (file.size > 4 * 1024 * 1024) {
                alert('File size exceeds 4MB. Please choose a smaller file.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        try {
            let imageUrl = '';

            // Upload image if selected
            if (selectedFile || editingAward) {
                if (selectedFile) {
                    const formDataUpload = new FormData();
                    formDataUpload.append('file', selectedFile);
                    formDataUpload.append('folder', 'awards');

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
                    // Use existing image URL when editing
                    imageUrl = editingAward.image;
                }
            } else {
                throw new Error("Image is required");
            }

            // Save award
            const url = editingAward ? `/api/awards/${editingAward._id}` : '/api/awards';
            const method = editingAward ? 'PUT' : 'POST';

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
                if (editingAward) {
                    setAwards(awards.map(a => a._id === editingAward._id ? saveData.data : a));
                } else {
                    setAwards([saveData.data, ...awards]);
                }
                setFormData({ title: '', year: '', description: '' });
                setSelectedFile(null);
                setEditingAward(null);
                setShowCreateForm(false);
                document.getElementById('award-image-upload').value = '';
                alert(editingAward ? 'Award updated successfully!' : 'Award added successfully!');
            } else {
                throw new Error(saveData.error || 'Failed to save award');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save award. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this award?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/awards/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setAwards(awards.filter(a => a._id !== id));
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch (err) {
            alert('Error deleting award');
        } finally {
            setDeletingId(null);
        }
    };

    const startEdit = (award) => {
        setEditingAward(award);
        setFormData({
            title: award.title,
            year: award.year,
            description: award.description
        });
        setSelectedFile(null);
        setShowCreateForm(true);
    };

    const cancelForm = () => {
        setShowCreateForm(false);
        setEditingAward(null);
        setFormData({ title: '', year: '', description: '' });
        setSelectedFile(null);
        setError(null);
        document.getElementById('award-image-upload').value = '';
    };

    const handleImportExisting = async () => {
        if (!confirm('This will import all existing awards from the static files. Continue?')) {
            return;
        }

        setMigrating(true);
        setError(null);

        try {
            const response = await fetch('/api/migrate/import-awards', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`Migration completed!\nImported: ${data.imported}\nSkipped (already exists): ${data.skipped}\nTotal: ${data.total}`);
                // Refresh the awards list
                fetchAwards();
            } else {
                setError(data.error || 'Failed to import existing awards');
            }
        } catch (err) {
            setError('Failed to import existing awards. ' + err.message);
        } finally {
            setMigrating(false);
        }
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
            {/* Create/Edit Award Form */}
            {showCreateForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingAward ? 'Edit Award' : 'Add New Award'}
                        </h3>
                        <button
                            onClick={cancelForm}
                            className="text-gray-500 hover:text-gray-700"
                        >
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
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="Enter award title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="e.g., 2024"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="Enter award description"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image (Max 4MB)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="award-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {selectedFile ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-700 font-semibold">{selectedFile.name}</p>
                                                </>
                                            ) : editingAward ? (
                                                <>
                                                    <img src={editingAward.image} alt="Current" className="h-20 w-auto mb-2 rounded" />
                                                    <p className="text-xs text-gray-400">Click to change image</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-green-600">Click to upload image</span></p>
                                                </>
                                            )}
                                        </div>
                                        <input id="award-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} required={!editingAward} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-colors ${
                                    uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {uploading ? 'Saving...' : (editingAward ? 'Update Award' : 'Add Award')}
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

            {/* Awards List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Awards</h3>
                        <p className="text-sm text-gray-500">Manage awards and achievements</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                            Total: {awards.length}
                        </span>
                        {!showCreateForm && (
                            <>
                                <button
                                    onClick={handleImportExisting}
                                    disabled={migrating}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                                        migrating 
                                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    {migrating ? 'Importing...' : 'Import Existing Awards'}
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    Add Award
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {awards.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No awards found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {awards.map((award) => (
                                    <tr key={award._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <img src={award.image} alt={award.title} className="h-16 w-24 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{award.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{award.year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{award.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => startEdit(award)}
                                                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(award._id)}
                                                    disabled={deletingId === award._id}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        deletingId === award._id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                                    }`}
                                                    title="Delete"
                                                >
                                                    {deletingId === award._id ? (
                                                        <span className="text-xs">Processing...</span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
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

export default AwardsTab;
