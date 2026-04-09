"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwords.new.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(passwords)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ type: 'success', text: data.message || 'Password changed successfully!' });
                setPasswords({ current: '', new: '', confirm: '' });
                setTimeout(onClose, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl animate-scale-up border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`px-3 py-2 rounded-md mb-4 text-sm ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
