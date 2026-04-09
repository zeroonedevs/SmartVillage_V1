'use client';
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
  ChevronLeft,
  ChevronRight,
  Layout,
  Briefcase,
  Target,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    items: [{ id: 'analytics', label: 'Analytics', Icon: BarChart3 }],
  },
    {
    items: [{ id: 'users', label: 'Users', Icon: UserCog }],
  },
  {
    items: [
      { id: 'registrations', label: 'GOP registrations', Icon: ClipboardList },
      { id: 'gallery', label: 'Gallery', Icon: Image },
      { id: 'activities', label: 'Activity reports', Icon: Activity },
      { id: 'news', label: 'News', Icon: Newspaper },
      { id: 'awards', label: 'Awards & honors', Icon: Award },
    ],
  },
  {
    items: [
      { id: 'staff', label: 'Staff directory', Icon: Users },
      { id: 'villages', label: 'Adapted villages', Icon: MapPin },
    ],
  },
  {
    items: [
      { id: 'hero', label: 'Hero slides', Icon: Layout },
      { id: 'areas-of-work', label: 'Areas of work', Icon: Briefcase },
      { id: 'focus-areas', label: 'Focus areas (9-way)', Icon: Target },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

function isItemAllowedForRole(tabId, userRole) {
  if (userRole === 'admin') return true;
  if (userRole === 'staff') {
    return !['registrations', 'users', 'analytics'].includes(tabId);
  }
  if (userRole === 'lead') {
    return ['activities', 'news', 'awards', 'gallery'].includes(tabId);
  }
  return false;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, userRole, onOpenSettings }) => {
  const visibleItems = ALL_NAV_ITEMS.filter(item => isItemAllowedForRole(item.id, userRole));

  const renderNavButton = item => {
    const { id, label, Icon } = item;
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setActiveTab(id)}
        title={!sidebarOpen ? label : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-left text-sm ${
          isActive
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'text-gray-800 border border-transparent'
        }`}
      >
        <span className={`flex-shrink-0 ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        {sidebarOpen && <span className="leading-snug">{label}</span>}
      </button>
    );
  };

  return (
    <div
      className={`dashboard-sidebar ${sidebarOpen ? 'w-64' : 'w-[4.5rem]'} bg-white border-r border-gray-200 transition-[width] duration-300 flex flex-col fixed h-screen z-40 text-black shadow-lg`}
    >
      <div className="p-3 border-b border-gray-200 flex items-center gap-2 min-h-[72px] bg-white">
        {sidebarOpen ? (
          <div className="flex-1 min-w-0 animate-fade-in pl-1">
            <h2 className="text-lg font-normal text-black tracking-tight truncate font-style-bold">SmartVillage</h2>
          </div>
        ) : (
          <div className="flex-1" aria-hidden />
        )}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-none text-black shrink-0"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-3 space-y-0.5">
        {visibleItems.map(renderNavButton)}
      </nav>

      <div className="p-3 border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={onOpenSettings}
          title={!sidebarOpen ? 'Account & security' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none border text-sm ${
            activeTab === 'settings'
              ? 'border-black bg-black text-white shadow-sm'
              : 'border-gray-300 bg-gray-100 text-black'
          } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
          {sidebarOpen && <span className="font-normal">Account & security</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
