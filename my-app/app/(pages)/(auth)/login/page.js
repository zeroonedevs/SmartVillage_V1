"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SVRLogin = () => {
    const [credentials, setCredentials] = useState({ userId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('login'); // login, forgot, reset
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const router = useRouter();

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (captchaInput !== captcha) {
            setError('Invalid security code');
            generateCaptcha();
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/gop/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                router.push('/dashboard');
            } else {
                setError(data.message || 'Authentication failed');
                generateCaptcha();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            generateCaptcha();
        } finally {
            setLoading(false);
        }
    };

    const [forgotEmail, setForgotEmail] = useState('');
    const [resetData, setResetData] = useState({ code: '', newPassword: '', confirmPassword: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage(data.message);
                setTimeout(() => setView('reset'), 2000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (resetData.newPassword !== resetData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: forgotEmail,
                    resetCode: resetData.code,
                    newPassword: resetData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage(data.message);
                setTimeout(() => setView('login'), 2000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F3F6F6]">
            <div className="flex-1 flex flex-col lg:flex-row shadow-2xl overflow-hidden">
                {/* Left Side: Image */}
                <div className="hidden lg:block lg:w-[60%] relative">
                    <img
                        src="/hero/1president.jpg"
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Smart Village Portal"
                    />
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-[40%] bg-white flex flex-col justify-center px-8 lg:px-16 py-12">
                    {view === 'login' && (
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-[32px] font-bold text-[#008000] leading-tight mb-8">
                                Welcome to Smart Village <br /> Revolution Portal
                            </h1>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm flex items-center gap-2 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-md mb-6 text-sm flex items-center gap-2 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-[15px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                        EMP/ERP ID
                                    </label>
                                    <input
                                        type="number"
                                        name="userId"
                                        value={credentials.userId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-[#008000] focus:ring-1 focus:ring-[#008000] transition-all outline-none"
                                        placeholder="Enter ID"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[15px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-[#008000] focus:ring-1 focus:ring-[#008000] transition-all outline-none pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26a4 4 0 015.486 5.486L8.001 6.577zM16.204 14.79c.742-.551 1.363-1.22 1.83-1.965A10.005 10.005 0 0019.542 10 10.005 10.005 0 0010 4.5a10 10 0 00-4.331 1.002L6.104 5.938A8 8 0 0110 5a8 8 0 017.938 5 8 8 0 01-1.734 3.79z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[15px] font-semibold text-gray-700 uppercase tracking-wide">
                                            Security Code: <span className="text-[#008000] font-bold tracking-widest">{captcha}</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={generateCaptcha}
                                            className="text-gray-500 hover:text-[#008000]"
                                            title="Refresh Code"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-[#008000] focus:ring-1 focus:ring-[#008000] transition-all outline-none"
                                        placeholder="Enter the code above"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#008000] active:bg-[#006400] text-white font-bold rounded-md shadow-md hover:shadow-lg transition-all text-lg"
                                >
                                    {loading ? 'Authenticating...' : 'Login'}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot')}
                                        className="text-[#008000] font-bold hover:underline py-2"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'forgot' && (
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-[32px] font-bold text-[#008000] leading-tight mb-8">
                                Reset Password
                            </h1>
                            <p className="text-gray-600 mb-8">Enter your registered email to reset your password.</p>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm flex items-center gap-2 font-medium">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-md mb-6 text-sm flex items-center gap-2 font-medium">
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleForgotSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[15px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-[#008000] transition-all outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#008000] text-white font-bold rounded-md"
                                >
                                    {loading ? 'Processing...' : 'Proceed'}
                                </button>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('login')}
                                        className="text-gray-500 font-bold hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'reset' && (
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-[28px] font-bold text-[#008000] leading-tight mb-6 text-center">
                                Update Password
                            </h1>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm flex items-center gap-2 font-medium">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-md mb-6 text-sm flex items-center gap-2 font-medium">
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleResetSubmit} className="space-y-5">
                                <input
                                    type="text"
                                    value={resetData.code}
                                    onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-center tracking-widest font-bold text-xl"
                                    placeholder="Security Code"
                                />
                                <input
                                    type="password"
                                    value={resetData.newPassword}
                                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded"
                                    placeholder="New Password"
                                />
                                <input
                                    type="password"
                                    value={resetData.confirmPassword}
                                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded"
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#008000] text-white font-bold rounded-md"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Footer */}
            <div className="bg-[#E9F2F2] py-6 px-4 text-center border-t border-gray-200">
                <p className="text-[14px] font-bold text-[#004d00] mb-1">
                    Copyright © 2025. All rights reserved by KLEF – SAC
                </p>
                <p className="text-[13px] text-[#006600]">
                    Designed & Developed by <Link href="https://www.linkedin.com/in/dinesh-korukonda-513855271/" target="_blank" rel="noopener noreferrer">Dinesh Korukonda</Link> & <Link href="https://www.linkedin.com/in/singananischal/" target="_blank" rel="noopener noreferrer">Nischal Singana</Link>
                </p>
            </div>
        </div>
    );
};

export default SVRLogin;
