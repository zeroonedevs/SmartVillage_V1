"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmallFooter from "@/app/components/SmallFooter/footer";
import Sidebar from './components/Sidebar';

import RegistrationsTab from './components/RegistrationsTab';
import GalleryTab from './components/GalleryTab';
import ActivitiesTab from './components/ActivitiesTab';
import UsersTab from './components/UsersTab';
import NewsTab from './components/NewsTab';
import AwardsTab from './components/AwardsTab';
import StaffTab from './components/StaffTab';
import VillagesTab from './components/VillagesTab';
import AnalyticsTab from './components/AnalyticsTab';
import ChangePasswordModal from './components/ChangePasswordModal';
import HeroTab from './components/HeroTab';
import AreasOfWorkTab from './components/AreasOfWorkTab';
import FocusAreasTab from './components/FocusAreasTab';


const SVRDashboard = () => {
    const [activeTab, setActiveTab] = useState('activities');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const tabTitles = {
        'analytics': 'Analytics',
        'registrations': 'GOP Registrations',
        'gallery': 'Gallery',
        'activities': 'Activity Reports',
        'news': 'News',
        'awards': 'Awards & Honors',
        'staff': 'Staff Directory',
        'villages': 'Adapted Villages',
        'users': 'User Management',
        'hero': 'Hero Slides',
        'areas-of-work': 'Areas of Work',
        'focus-areas': 'Focus Areas (9-Way)'
    };

    const tabDescriptions = {
        'analytics': 'Overview of key metrics and trends',
        'registrations': 'Manage GOP organization registrations',
        'gallery': 'Upload and organize gallery images',
        'activities': 'Document events and upload reports',
        'news': 'Manage news articles and publications',
        'awards': 'Track awards and achievements',
        'staff': 'Manage staff members',
        'villages': 'Manage adapted village records',
        'users': 'Manage system users and roles',
        'hero': 'Configure homepage hero slides',
        'areas-of-work': 'Define areas of work content',
        'focus-areas': 'Configure 9-way focus area items'
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const url = `${window.location.origin}/api/auth/me`;
                const response = await fetch(url, {
                    credentials: 'include',
                    cache: 'no-store',
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (!response.ok) {
                    router.push('/login');
                    return;
                }

                const data = await response.json();
                if (data.success && data.data) {
                    const role = data.data.role;
                    setUserRole(role);

                    if (role === 'admin') {
                        setActiveTab('analytics');
                    } else if (role === 'staff') {
                        setActiveTab('gallery');
                    } else if (role === 'lead') {
                        setActiveTab('activities');
                    }
                } else {
                    router.push('/login');
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
            document.cookie = 'gop_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50/80 flex">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userRole={userRole}
                handleBackToLogin={handleLogout}
            />

            <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-[70px]'}`}>
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">
                                {tabTitles[activeTab] || 'Dashboard'}
                            </h1>
                            <p className="text-xs text-gray-500">
                                {tabDescriptions[activeTab] || 'Manage your village infrastructure'}
                            </p>
                        </div>
                        {userRole && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                            </span>
                        )}
                    </div>
                </header>

                <main className="flex-grow max-w-7xl mx-auto px-6 py-6 w-full">
                    <div className="animate-fade-in">
                        {activeTab === 'analytics' && userRole === 'admin' && <AnalyticsTab />}
                        {activeTab === 'registrations' && userRole === 'admin' && <RegistrationsTab />}
                        {activeTab === 'gallery' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <GalleryTab />}
                        {activeTab === 'activities' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <ActivitiesTab />}
                        {activeTab === 'users' && userRole === 'admin' && <UsersTab />}
                        {activeTab === 'news' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <NewsTab />}
                        {activeTab === 'awards' && (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <AwardsTab />}
                        {activeTab === 'staff' && (userRole === 'admin' || userRole === 'staff') && <StaffTab />}
                        {activeTab === 'villages' && (userRole === 'admin' || userRole === 'staff') && <VillagesTab />}
                        {activeTab === 'hero' && (userRole === 'admin' || userRole === 'staff') && <HeroTab />}
                        {activeTab === 'areas-of-work' && (userRole === 'admin' || userRole === 'staff') && <AreasOfWorkTab />}
                        {activeTab === 'focus-areas' && (userRole === 'admin' || userRole === 'staff') && <FocusAreasTab />}
                        <ChangePasswordModal
                            isOpen={activeTab === 'settings'}
                            onClose={() => setActiveTab('activities')}
                        />
                    </div>
                </main>
                <div className="mt-auto">
                    <SmallFooter />
                </div>
            </div>
        </div>
    );
};

export default SVRDashboard;
