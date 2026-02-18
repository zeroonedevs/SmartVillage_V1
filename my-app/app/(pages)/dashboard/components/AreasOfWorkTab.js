"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AreasOfWorkTab = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',

        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            const response = await fetch('/api/areas-of-work');
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch areas of work');
            const data = await response.json();
            if (data.success) {
                setAreas(data.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ... (Use similar handlers for files, submitting, deleting as HeroTab but point to correct API)
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed.');
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
            if (selectedFile || editingArea) {
                if (selectedFile) {
                    const formDataUpload = new FormData();
                    formDataUpload.append('file', selectedFile);
                    formDataUpload.append('folder', 'areas_of_work');

                    const uploadRes = await fetch('/api/dashboard/upload', {
                        method: 'POST',
                        body: formDataUpload,
                    });

                    const uploadData = await uploadRes.json();
                    if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
                    imageUrl = uploadData.fileUrl;
                } else {
                    imageUrl = editingArea.image;
                }
            } else {
                throw new Error("Image is required");
            }

            const url = editingArea ? `/api/areas-of-work/${editingArea._id}` : '/api/areas-of-work';
            const method = editingArea ? 'PUT' : 'POST';

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
                if (editingArea) {
                    setAreas(areas.map(a => a._id === editingArea._id ? saveData.data : a));
                } else {
                    setAreas([...areas, saveData.data].sort((a, b) => a.order - b.order));
                }
                cancelForm();
                alert(editingArea ? 'Area updated successfully!' : 'Area added successfully!');
            } else {
                throw new Error(saveData.error || 'Failed to save area');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save area. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/areas-of-work/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setAreas(areas.filter(a => a._id !== id));
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Error deleting area');
        } finally {
            setDeletingId(null);
        }
    };

    const startEdit = (area) => {
        setEditingArea(area);
        setFormData({
            title: area.title,

            order: area.order || 0,
            isActive: area.isActive
        });
        setSelectedFile(null);
        setShowCreateForm(true);
    };

    const cancelForm = () => {
        setShowCreateForm(false);
        setEditingArea(null);
        setFormData({ title: '', order: 0, isActive: true });
        setSelectedFile(null);
        setError(null);
        const fileInput = document.getElementById('area-image-upload');
        if (fileInput) fileInput.value = '';
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div></div>;

    return (
        <div className="space-y-8">
            {showCreateForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">{editingArea ? 'Edit Area of Work' : 'Add Area of Work'}</h3>
                        <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Order</label>
                                <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-green-500" />
                            </div>
                            <div className="md:col-span-2">
                                {/* Description removed as requested */}
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="form-checkbox text-green-600 rounded" />
                                    <span className="text-sm font-semibold text-gray-700">Active</span>
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                                <input id="area-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                                {editingArea && !selectedFile && <div className="mt-2"><p className="text-xs text-gray-500">Current:</p><img src={editingArea.image} alt="Current" className="h-16 rounded mt-1" /></div>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">{uploading ? 'Saving...' : 'Save'}</button>
                            <button type="button" onClick={cancelForm} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div><h3 className="text-lg font-bold text-gray-800">Areas of Work</h3><p className="text-sm text-gray-500">Manage areas of work section</p></div>
                    {!showCreateForm && <button onClick={() => setShowCreateForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex gap-2">Add New</button>}
                </div>
                {areas.length === 0 ? <div className="p-12 text-center text-gray-500">No areas found.</div> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {areas.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.order}</td>
                                        <td className="px-6 py-4"><img src={item.image} alt={item.title} className="h-12 w-12 object-cover rounded-full" /></td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.title}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.isActive ? 'Active' : 'Hidden'}</span></td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default AreasOfWorkTab;
