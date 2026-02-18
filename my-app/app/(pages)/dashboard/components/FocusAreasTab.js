"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FocusAreasTab = () => {
    const [focusAreas, setFocusAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 1,
        isActive: true
    });

    useEffect(() => {
        fetchFocusAreas();
    }, []);

    const fetchFocusAreas = async () => {
        try {
            const response = await fetch('/api/focus-areas');
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch focus areas');
            const data = await response.json();
            if (data.success) {
                setFocusAreas(data.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
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
                    formDataUpload.append('folder', 'focus_areas');

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

            const url = editingArea ? `/api/focus-areas/${editingArea._id}` : '/api/focus-areas';
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
                    setFocusAreas(focusAreas.map(a => a._id === editingArea._id ? saveData.data : a));
                } else {
                    setFocusAreas([...focusAreas, saveData.data].sort((a, b) => a.order - b.order));
                }
                cancelForm();
                alert(editingArea ? 'Focus area updated!' : 'Focus area added!');
            } else {
                throw new Error(saveData.error || 'Failed to save focus area');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/focus-areas/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setFocusAreas(focusAreas.filter(a => a._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Error deleting');
        }
    };

    const startEdit = (area) => {
        setEditingArea(area);
        setFormData({
            title: area.title,
            description: area.description,
            order: area.order,
            isActive: area.isActive
        });
        setSelectedFile(null);
        setShowCreateForm(true);
    };

    const cancelForm = () => {
        setShowCreateForm(false);
        setEditingArea(null);
        setFormData({ title: '', description: '', order: focusAreas.length + 1, isActive: true });
        setSelectedFile(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            {showCreateForm && (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">{editingArea ? 'Edit Focus Area' : 'Add Focus Area'}</h3>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="border p-2 rounded w-full" required />
                            <input name="order" type="number" value={formData.order} onChange={handleInputChange} placeholder="Order (1-9)" className="border p-2 rounded w-full" required />
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border p-2 rounded w-full col-span-2" rows="3" required />
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-semibold">Image</label>
                                <input type="file" onChange={handleFileChange} className="w-full" />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" disabled={uploading}>
                                {uploading ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={cancelForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold">Focus Areas (9-Way Principle)</h3>
                    {!showCreateForm && <button onClick={() => setShowCreateForm(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add New</button>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-4 font-semibold text-gray-600">Order</th>
                                <th className="p-4 font-semibold text-gray-600">Image</th>
                                <th className="p-4 font-semibold text-gray-600">Title</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {focusAreas.map(item => (
                                <tr key={item._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{item.order}</td>
                                    <td className="p-4"><img src={item.image} className="h-10 w-10 rounded object-cover" alt="" /></td>
                                    <td className="p-4 font-medium">{item.title}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => startEdit(item)} className="text-blue-600 mr-3 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FocusAreasTab;
