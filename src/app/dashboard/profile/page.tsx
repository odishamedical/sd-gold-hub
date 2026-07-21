'use client';

import React from 'react';
import { useCustomer } from '@/context/CustomerContext';

export default function ProfileSettingsPage() {
  const { profile, loading } = useCustomer();

  if (loading) return null;

  if (!profile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
        <p className="text-gray-500">Please sign in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-500 text-sm">Manage your personal information and contact details.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <form className="max-w-xl space-y-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              defaultValue={profile.name}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              defaultValue={profile.email}
              disabled
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-500 mt-1">Email cannot be changed as it is linked to your authentication provider.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">WhatsApp / Phone Number</label>
            <input 
              type="tel" 
              defaultValue={profile.phone || ''}
              placeholder="+91"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059]"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button 
              type="button"
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
