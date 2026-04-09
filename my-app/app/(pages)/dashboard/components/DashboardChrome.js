'use client';
import React from 'react';
import { LogOut } from 'lucide-react';

const DashboardChrome = ({ userName, userId, sectionSlug, onLogout }) => {
  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="shrink-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">SmartVillage Dashboard</p>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 md:col-start-3">
          {userName && <span className="hidden sm:inline text-sm font-semibold text-slate-900">{userName}</span>}
          <div
            className="h-9 w-9 rounded-full bg-green-100 text-green-900 flex items-center justify-center text-sm font-semibold border border-green-200"
            title={userName || 'User'}
          >
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardChrome;
