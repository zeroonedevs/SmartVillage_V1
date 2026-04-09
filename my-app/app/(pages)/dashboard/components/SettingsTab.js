'use client';
import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

const SettingsTab = ({ onBack }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success !== false) {
        setMessage({ type: 'success', text: data.message || 'Password updated successfully.' });
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Could not update password. Try again.',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-800 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </button>

      <div className="dash-panel overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5 flex items-start gap-3">
          <div className="rounded-xl bg-green-100 p-2.5 text-green-800">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Account security</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Update your sign-in password. Use a strong password you do not reuse elsewhere.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {message.text && (
            <div
              role="alert"
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-900 border border-green-100'
                  : 'bg-red-50 text-red-800 border border-red-100'
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Lock className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              Current password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-600 transition-shadow"
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>

          <div className="pt-1 border-t border-slate-100 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-600 transition-shadow"
                value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1.5">At least 8 characters.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm new password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-600 transition-shadow"
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="sm:flex-1 py-2.5 rounded-xl font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="sm:flex-1 py-2.5 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
