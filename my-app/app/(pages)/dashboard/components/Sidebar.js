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
    Shield,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Layout,
    Briefcase,
    Target,
    Leaf
} from 'lucide-react';

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    userRole,
    handleBackToLogin
}) => {
    const allTabs = [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'registrations', label: 'GOP Registrations', icon: ClipboardList },
        { id: 'gallery', label: 'Gallery Images', icon: Image },
        { id: 'activities', label: 'Activity Reports', icon: Activity },
        { id: 'news', label: 'News Management', icon: Newspaper },
        { id: 'awards', label: 'Awards & Honors', icon: Award },
        { id: 'staff', label: 'Staff Directory', icon: Users },
        { id: 'villages', label: 'Adapted Villages', icon: MapPin },
        { id: 'users', label: 'User Management', icon: UserCog },
        { id: 'hero', label: 'Hero Slides', icon: Layout },
        { id: 'areas-of-work', label: 'Areas of Work', icon: Briefcase },
        { id: 'focus-areas', label: 'Focus Areas (9-Way)', icon: Target }
    ];

    const tabs = allTabs.filter(tab => {
        if (userRole === 'admin') return true;
        if (userRole === 'staff') {
            return tab.id !== 'registrations' && tab.id !== 'users' && tab.id !== 'analytics';
        }
        if (userRole === 'lead') {
            return ['activities', 'news', 'awards', 'gallery'].includes(tab.id);
        }
        return false;
    });

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-[70px]'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-screen z-40`}>
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
                {sidebarOpen && (
                    <div className="flex items-center gap-2.5 animate-fade-in">
                        <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-white" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold text-gray-900">SmartVillage</p>
                            <p className="text-[11px] text-gray-500">Dashboard</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                    title={sidebarOpen ? "Collapse" : "Expand"}
                >
                    {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
            </div>

            <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                isActive
                                    ? 'bg-green-50 text-green-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                            title={!sidebarOpen ? tab.label : undefined}
                        >
                            <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                            {sidebarOpen && <span className="truncate">{tab.label}</span>}
                        </button>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 p-3 space-y-1 shrink-0">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                    title="Security Settings"
                >
                    <Shield className="h-[18px] w-[18px] text-gray-400 shrink-0" />
                    {sidebarOpen && <span>Security</span>}
                </button>

                <button
                    onClick={handleBackToLogin}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-red-600 hover:bg-red-50 transition-colors ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0" />
                    {sidebarOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
