'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import DashboardChrome from './components/DashboardChrome';

// Tab Components
import RegistrationsTab from './components/RegistrationsTab';
import GalleryTab from './components/GalleryTab';
import ActivitiesTab from './components/ActivitiesTab';
import UsersTab from './components/UsersTab';
import NewsTab from './components/NewsTab';
import AwardsTab from './components/AwardsTab';
import StaffTab from './components/StaffTab';
import VillagesTab from './components/VillagesTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import HeroTab from './components/HeroTab';
import AreasOfWorkTab from './components/AreasOfWorkTab';
import FocusAreasTab from './components/FocusAreasTab';

const SVRDashboard = () => {
  const [activeTab, setActiveTab] = useState('activities');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const tabBeforeSettingsRef = useRef(null);

  const tabTitles = {
    settings: 'Account & security',
    analytics: 'Analytics',
    registrations: 'GOP registrations',
    gallery: 'Gallery',
    activities: 'Activity reports',
    news: 'News',
    awards: 'Awards & honors',
    staff: 'Staff directory',
    villages: 'Adapted villages',
    users: 'Users',
    hero: 'Hero slides',
    'areas-of-work': 'Areas of work',
    'focus-areas': 'Focus areas (9-way)',
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
          console.error(
            'Auth check failed:',
            response.status,
            await response.text().catch(() => '')
          );
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (data.success && data.data) {
          const role = data.data.role;
          setUserRole(role);
          setUserName(data.data.name ?? null);
          setUserID(data.data.userID ?? null);

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
      console.error('Logout failed', error);
      document.cookie = 'gop_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/login');
  };

  const openSettings = () => {
    if (activeTab !== 'settings') {
      tabBeforeSettingsRef.current = activeTab;
    }
    setActiveTab('settings');
  };

  const closeSettings = () => {
    const fallback =
      userRole === 'admin' ? 'analytics' : userRole === 'staff' ? 'gallery' : 'activities';
    setActiveTab(tabBeforeSettingsRef.current ?? fallback);
  };

  const sectionLabel = tabTitles[activeTab] || 'Overview';

  if (loading) {
    return (
      <div className="dash-app w-full min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-11 w-11 border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="dash-app min-h-screen bg-slate-100/90 flex text-slate-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onOpenSettings={openSettings}
        onLogout={handleLogout}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ${sidebarOpen ? 'ml-64' : 'ml-[4.5rem]'}`}
      >
        <DashboardChrome
          userName={userName}
          userId={userID}
          sectionSlug={sectionLabel}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {activeTab === 'settings' && userName && (
              <p className="text-sm text-slate-600 mb-6">
                Signed in as <span className="font-semibold text-slate-900">{userName}</span>.
              </p>
            )}

            <div className="animate-fade-in-up space-y-6">
              {activeTab === 'settings' && <SettingsTab onBack={closeSettings} />}
              {activeTab === 'analytics' && userRole === 'admin' && <AnalyticsTab />}
              {activeTab === 'registrations' && userRole === 'admin' && <RegistrationsTab />}
              {activeTab === 'gallery' &&
                (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && (
                  <GalleryTab />
                )}
              {activeTab === 'activities' &&
                (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && (
                  <ActivitiesTab />
                )}
              {activeTab === 'users' && userRole === 'admin' && <UsersTab />}
              {activeTab === 'news' &&
                (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && <NewsTab />}
              {activeTab === 'awards' &&
                (userRole === 'admin' || userRole === 'staff' || userRole === 'lead') && (
                  <AwardsTab />
                )}
              {activeTab === 'staff' && (userRole === 'admin' || userRole === 'staff') && (
                <StaffTab />
              )}
              {activeTab === 'villages' && (userRole === 'admin' || userRole === 'staff') && (
                <VillagesTab />
              )}
              {activeTab === 'hero' && (userRole === 'admin' || userRole === 'staff') && <HeroTab />}
              {activeTab === 'areas-of-work' && (userRole === 'admin' || userRole === 'staff') && (
                <AreasOfWorkTab />
              )}
              {activeTab === 'focus-areas' && (userRole === 'admin' || userRole === 'staff') && (
                <FocusAreasTab />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVRDashboard;
