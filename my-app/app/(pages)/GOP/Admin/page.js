
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../../../components/navbar/Navbar";
import ResNavbar from "../../../components/navbar/ResNav";
import Footer from "../../../components/footer/Footer";

const GOPAdmin = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await fetch('/api/gop/registrations');
                if (response.status === 401) {
                    router.push('/GOP/Login');
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

        fetchRegistrations();
    }, [router]);

    // Format date helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 font-[Poppins]">
            <div className="Navbar block"><Navbar /></div>
            <div className="Navbar-Res hidden"><ResNavbar /></div>

            <div className="max-w-7xl mx-auto px-4 py-12 pt-32">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-700">
                        GOP Registrations
                    </h1>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                        Total: {registrations.length}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                        {error}
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
                        No registrations found yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Organization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Interests</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(reg.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{reg.org_name}</div>
                                            <div className="text-sm text-gray-500">{reg.category}</div>
                                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">{reg.org_address}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{reg.contact_person}</div>
                                            <div className="text-xs text-gray-500">{reg.designation}</div>
                                            <div className="text-sm text-gray-600 mt-1">{reg.contact_email}</div>
                                            <div className="text-sm text-gray-600">{reg.contact_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                {reg.tenure || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {reg.interested_domains && reg.interested_domains.length > 0 ? (
                                                    reg.interested_domains.map((domain, idx) => (
                                                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                                            {domain}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic">None</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default GOPAdmin;
