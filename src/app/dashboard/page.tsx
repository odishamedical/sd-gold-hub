'use client';

import React from 'react';
import { useCustomer } from '@/context/CustomerContext';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const { profile, loading, loginDemo } = useCustomer();

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-mono">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Welcome to Gold Hub</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Sign in to save your favorite products, follow trusted jewelers, and contact shops directly on WhatsApp.</p>
        <button 
          onClick={loginDemo}
          className="bg-[#C5A059] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#996515] transition-colors"
        >
          Sign In (Demo)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome back, {profile.name}</h1>
        <p className="text-gray-500 text-sm">Manage your saved items and shop preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-start">
          <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.savedProducts.length} Saved Products</h3>
          <p className="text-sm text-gray-500 mb-6">Compare making charges across your favorite items.</p>
          <Link href="/dashboard/wishlist" className="mt-auto text-[#C5A059] font-bold text-sm uppercase tracking-widest hover:underline">
            View Wishlist →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-start">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.followedShops.length} Followed Shops</h3>
          <p className="text-sm text-gray-500 mb-6">Get updates when your favorite shops drop their making charges.</p>
          <Link href="/dashboard/following" className="mt-auto text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline">
            View Shops →
          </Link>
        </div>
      </div>
    </div>
  );
}
