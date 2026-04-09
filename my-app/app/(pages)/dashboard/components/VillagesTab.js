"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

const VillagesTab = () => {
    const [villageList, setVillageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        mandal: '',
        district: ''
    });

    useEffect(() => {
        fetchVillages();
    }, []);

    const fetchVillages = async () => {
        try {
            const response = await fetch('/api/villages');
            const data = await response.json();
            if (data.success) {
                setVillageList(data.data);
            } else {
                setError('Failed to fetch villages');
            }
        } catch (err) {
            setError('Error fetching villages');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/villages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setFormData({ name: '', mandal: '', district: '' });
                fetchVillages();
                toast.success('Village added successfully!');
            } else {
                setError(data.error || 'Failed to add village');
            }
        } catch (err) {
            setError('Error adding village');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this village?')) return;
        setDeletingId(id);
        try {
            const response = await fetch('/api/villages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            if (data.success) {
                fetchVillages();
                toast.success('Village deleted');
            } else {
                toast.error(data.error || 'Failed to delete village');
            }
        } catch (err) {
            toast.error('Error deleting village');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Village</h3>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Village Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Village name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mandal</label>
                            <input
                                type="text"
                                name="mandal"
                                placeholder="Mandal"
                                value={formData.mandal}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
                            <input
                                type="text"
                                name="district"
                                placeholder="District"
                                value={formData.district}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                            Add Village
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Village Records</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {villageList.length} total
                    </span>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {villageList.length > 0 ? (
                                    villageList.map((village) => (
                                        <tr key={village._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{village.name}</td>
                                            <td className="px-6 py-3.5 text-sm text-gray-600">{village.mandal}</td>
                                            <td className="px-6 py-3.5 text-sm text-gray-600">{village.district}</td>
                                            <td className="px-6 py-3.5 text-right">
                                                <button
                                                    onClick={() => handleDelete(village._id)}
                                                    disabled={deletingId === village._id}
                                                    className={`p-1.5 rounded-md transition-colors ${
                                                        deletingId === village._id
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                    }`}
                                                    title="Delete"
                                                >
                                                    {deletingId === village._id ? (
                                                        <span className="text-xs">...</span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-400">
                                            No villages added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VillagesTab;
