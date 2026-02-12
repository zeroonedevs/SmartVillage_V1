
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmallFooter from "../components/SmallFooter/footer";
import RegistrationsTab from './components/RegistrationsTab';
import GalleryTab from './components/GalleryTab';
import ActivitiesTab from './components/ActivitiesTab';
import UsersTab from './components/UsersTab';
import NewsTab from './components/NewsTab';
import AwardsTab from './components/AwardsTab';
import StaffTab from './components/StaffTab';
import VillagesTab from './components/VillagesTab';

const SVRAdmin = () => {
    const [activeTab, setActiveTab] = useState('registrations');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    // Check auth on mount
    useEffect(() => {
        // Fetch user info to get role
        const fetchUserInfo = async () => {
            try {
                // Use the /api/auth/me endpoint to get user role
                const response = await fetch('/api/auth/me', {
                    credentials: 'include'
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        setUserRole(data.data.role);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Try fallback - check if can access registrations
                try {
                    const regResponse = await fetch('/api/gop/registrations', {
                        credentials: 'include'
                    });
                    if (regResponse.status === 401) {
                        router.push('/login');
                    }
                } catch (err) {
                    console.error('Fallback auth check failed:', err);
                }
            }
        };

        fetchUserInfo();
    }, [router]);

    const handleBackToLogin = async () => {
        try {
            // Clear the GOP admin session cookie via API
            await fetch('/api/gop/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed', error);
            // Fallback: clear cookie client-side
            document.cookie = 'gop_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        router.push('/login');
    };

    const tabs = [
        {
            id: 'registrations', label: 'GOP Registrations', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: 'gallery', label: 'Gallery Images', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: 'activities', label: 'Activity Reports', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: 'news', label: 'News', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
            )
        },
        {
            id: 'awards', label: 'Awards', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )
        },
        {
            id: 'staff', label: 'Staff Directory', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            )
        },
        {
            id: 'villages', label: 'Adapted Villages', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                </svg>
            )
        },
        ...(userRole === 'admin' ? [{
            id: 'users',
            label: 'Users Management',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
            )
        }] : [])
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 font-[Poppins] flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-screen z-40`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">SVR Admin</h2>
                            <p className="text-xs text-gray-500">Dashboard</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {sidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-green-700'
                                }`}
                        >
                            <span className="flex-shrink-0">{tab.icon}</span>
                            {sidebarOpen && (
                                <span className="font-medium">{tab.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleBackToLogin}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 1 0 0 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {tabs.find(t => t.id === activeTab)?.label || 'Admin Dashboard'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage registrations, gallery, and activities</p>
                    </div>

                    {/* Content Area */}
                    <div className="animate-fade-in-up">
                        {activeTab === 'registrations' && <RegistrationsTab />}
                        {activeTab === 'gallery' && <GalleryTab />}
                        {activeTab === 'activities' && <ActivitiesTab />}
                        {activeTab === 'users' && userRole === 'admin' && <UsersTab />}
                        {activeTab === 'news' && <NewsTab />}
                        {activeTab === 'awards' && <AwardsTab />}
                        {activeTab === 'staff' && <StaffTab />}
                        {activeTab === 'villages' && <VillagesTab />}
                    </div>
                </div>
                <div className="mt-auto">
                    <SmallFooter />
                </div>
            </div>
        </div>
    );
};

export default SVRAdmin;
