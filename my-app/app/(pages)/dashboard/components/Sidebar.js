"use client";
import React from 'react';
import {
    BarChart3,
    ClipboardList,
    Image,
    Activity,
    Newspaper,
    Award,
    Users,
    MapPin,
    UserCog,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    userRole,
    handleBackToLogin
}) => {
    // Define all possible tabs
    const allTabs = [
        {
            id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />
        },
        {
            id: 'registrations', label: 'GOP Registrations', icon: <ClipboardList className="h-5 w-5" />
        },
        {
            id: 'gallery', label: 'Gallery Images', icon: <Image className="h-5 w-5" />
        },
        {
            id: 'activities', label: 'Activity Reports', icon: <Activity className="h-5 w-5" />
        },
        {
            id: 'news', label: 'News Management', icon: <Newspaper className="h-5 w-5" />
        },
        {
            id: 'awards', label: 'Awards & Honors', icon: <Award className="h-5 w-5" />
        },
        {
            id: 'staff', label: 'Staff Directory', icon: <Users className="h-5 w-5" />
        },
        {
            id: 'villages', label: 'Adapted Villages', icon: <MapPin className="h-5 w-5" />
        },
        {
            id: 'users', label: 'User Management', icon: <UserCog className="h-5 w-5" />
        }
    ];

    // Filter tabs based on role
    const tabs = allTabs.filter(tab => {
        if (userRole === 'admin') return true;
        if (userRole === 'staff') {
            // everything except GOP (registrations), users, and analytics
            return tab.id !== 'registrations' && tab.id !== 'users' && tab.id !== 'analytics';
        }
        if (userRole === 'lead') {
            // only acitvities , news , awards , gallery
            return ['activities', 'news', 'awards', 'gallery'].includes(tab.id);
        }
        return false;
    });

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-screen z-40 shadow-sm`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between min-h-[73px]">
                {sidebarOpen && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-green-800">SmartVillage</h2>
                        <p className="text-xs text-gray-500 font-medium">Dashboard</p>
                    </div>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-700 transition-all duration-200"
                    title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md transition-all duration-200 group ${activeTab === tab.id
                            ? 'bg-white text-gray-900 font-semibold shadow-md ring-1 ring-gray-200'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <span className="flex-shrink-0">
                            {tab.icon}
                        </span>
                        {sidebarOpen && (
                            <span className="text-sm tracking-wide">
                                {tab.label}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 transition-all group ${!sidebarOpen ? 'justify-center p-3' : ''}`}
                    title="Change Password"
                >
                    <Settings className="h-5 w-5" />
                    {sidebarOpen && <span className="font-bold text-sm">SECURITY</span>}
                </button>

                <button
                    onClick={handleBackToLogin}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-all duration-300 group ${!sidebarOpen ? 'justify-center p-3' : ''}`}
                >
                    <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    {sidebarOpen && <span className="font-bold text-sm tracking-uppercase">LOGOUT</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
