
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistrationsTab = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Format date helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Fetch registrations function
    const fetchRegistrations = async () => {
        try {
            const response = await fetch('/api/gop/registrations');
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setRegistrations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete registration handler
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        setDeletingId(id);
        try {
            const response = await fetch(`/api/gop/registrations?id=${id}`, {
                method: 'DELETE',
            });

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete registration');
            }

            // Remove the deleted item from the list
            setRegistrations(registrations.filter(reg => reg._id !== id));
        } catch (err) {
            alert(err.message || 'Failed to delete registration');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                {error}
            </div>
        );
    }

    if (registrations.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">No Registrations Yet</h3>
                <p className="text-gray-500">New GOP registrations will appear here once submitted.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Registration List</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage all submitted GOP registrations</p>
                </div>
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-green-200">
                    Total: {registrations.length}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Interests</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {registrations.map((reg) => (
                            <tr key={reg._id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {formatDate(reg.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{reg.orgName}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-0.5">{reg.category}</div>
                                    <div className="text-xs text-gray-400 mt-1 max-w-xs truncate flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {reg.orgAddress}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-gray-800">{reg.contactPerson}</div>
                                    <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-0.5 mb-1 font-medium">{reg.designation}</div>
                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        {reg.contactEmail}
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        {reg.contactPhone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                                        {reg.tenure || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                                        {reg.interestedDomains && reg.interestedDomains.length > 0 ? (
                                            reg.interestedDomains.map((domain, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-200 font-medium">
                                                    {domain}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">None selected</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(reg._id)}
                                        disabled={deletingId === reg._id}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto ${
                                            deletingId === reg._id
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {deletingId === reg._id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegistrationsTab;
