
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const GOPLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/gop/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/GOP/Admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-green-50 font-[Poppins]">
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-600">
                    <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
                        Admin Login
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold text-white shadow transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GOPLogin;
