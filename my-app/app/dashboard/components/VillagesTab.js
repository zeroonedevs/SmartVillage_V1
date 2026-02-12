import React, { useState, useEffect } from 'react';

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
            } else {
                setError(data.error || 'Failed to delete village');
            }
        } catch (err) {
            setError('Error deleting village');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Adapted Villages</h2>

            {/* Add Village Form */}
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Village</h3>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Village Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="text"
                        name="mandal"
                        placeholder="Mandal"
                        value={formData.mandal}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="text"
                        name="district"
                        placeholder="District"
                        value={formData.district}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#008000] text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        Add Village
                    </button>
                </div>
            </form>

            {/* Village List Table */}
            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Mandal</th>
                                <th className="p-4 font-semibold">District</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {villageList.length > 0 ? (
                                villageList.map((village) => (
                                    <tr key={village._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{village.name}</td>
                                        <td className="p-4">{village.mandal}</td>
                                        <td className="p-4">{village.district}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(village._id)}
                                                disabled={deletingId === village._id}
                                                className={`p-2 rounded-lg transition-colors ${deletingId === village._id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                                    }`}
                                                title="Delete Village"
                                            >
                                                {deletingId === village._id ? (
                                                    <span className="text-xs">Processing...</span>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400 italic">
                                        No villages added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VillagesTab;
