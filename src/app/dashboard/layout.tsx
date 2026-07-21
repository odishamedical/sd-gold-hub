import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Heart, User, Store, Settings, LogOut } from 'lucide-react';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20 md:pb-0">
      <div className="bg-white border-b border-gray-200">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-24 shadow-sm">
              <div className="mb-6 px-4">
                <h2 className="text-xl font-serif font-bold text-gray-900">My Account</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Customer Portal</p>
              </div>

              <nav className="flex flex-col gap-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors">
                  <User className="w-4 h-4" />
                  Overview
                </Link>
                <Link href="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
                <Link href="/dashboard/following" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors">
                  <Store className="w-4 h-4" />
                  Followed Shops
                </Link>
                <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors">
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </Link>
                
                <div className="border-t border-gray-100 my-2 pt-2">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
          
        </div>
      </div>
    </main>
  );
}
