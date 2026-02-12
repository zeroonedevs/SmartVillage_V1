
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmallFooter from "../components/SmallFooter/footer";
import Sidebar from './components/Sidebar';

// Tab Components
import RegistrationsTab from './components/RegistrationsTab';
import GalleryTab from './components/GalleryTab';
import ActivitiesTab from './components/ActivitiesTab';
import UsersTab from './components/UsersTab';
import NewsTab from './components/NewsTab';
import AwardsTab from './components/AwardsTab';
import StaffTab from './components/StaffTab';
import VillagesTab from './components/VillagesTab';
import ChangePasswordModal from './components/ChangePasswordModal';


const SVRDashboard = () => {
    const [activeTab, setActiveTab] = useState('activities'); 
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Role-based title mapping
    const tabTitles = {
        'registrations': 'GOP Registrations',
        'gallery': 'Gallery Images',
        'activities': 'Activity Reports',
        'news': 'News Management',
        'awards': 'Awards & Honors',
        'staff': 'Staff Directory',
        'villages': 'Adapted Villages',
        'users': 'User Management'
    };

    // Check auth on mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Auth Role-based Check: Fetch user info to get role
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
                        const role = data.data.role;
                        setUserRole(role);

                        // Set initial landing tab based on role
                        if (role === 'admin') {
                            setActiveTab('registrations');
                        } else if (role === 'staff') {
                            setActiveTab('gallery');
                        } else if (role === 'lead') {
                            setActiveTab('activities');
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/gop/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed', error);
            document.cookie = 'gop_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 font-[Poppins] flex">
            {/* Sidebar Component */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userRole={userRole}
                handleBackToLogin={handleLogout}
            />

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                                {tabTitles[activeTab] || 'Dashboard'}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Manage your village infrastructure and records
                            </p>
                        </div>
                        {userRole && (
                            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                                    Role: {userRole}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="animate-fade-in-up">
                        {activeTab === 'registrations' && userRole === 'admin' && <RegistrationsTab />}
                        {activeTab === 'gallery' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <GalleryTab />}
                        {activeTab === 'activities' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <ActivitiesTab />}
                        {activeTab === 'users' && userRole === 'admin' && <UsersTab />}
                        {activeTab === 'news' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <NewsTab />}
                        {activeTab === 'awards' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <AwardsTab />}
                        {activeTab === 'staff' && (userRole === 'admin' || userRole === 'staff') && <StaffTab />}
                        {activeTab === 'villages' && (userRole === 'admin' || userRole === 'staff') && <VillagesTab />}
                        {/* Modals */}
                        <ChangePasswordModal
                            isOpen={activeTab === 'settings'}
                            onClose={() => setActiveTab('activities')}
                        />
                    </div>
                </div>
                <div className="mt-auto">
                    <SmallFooter />
                </div>
            </div>
        </div>
    );
};

export default SVRDashboard;
