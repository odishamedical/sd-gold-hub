'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCustomer } from '@/context/CustomerContext';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, loginDemo, logout } = useCustomer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: '/dashboard', label: 'Overview', icon: '👤' },
    { id: '/dashboard/orders', label: 'My Orders', icon: '📦' },
    { id: '/dashboard/wishlist', label: 'Saved Items', icon: '❤️' },
    { id: '/dashboard/following', label: 'Followed Shops', icon: '🏪' },
    { id: '/dashboard/profile', label: 'Profile Settings', icon: '⚙️' }
  ];

  const userName = profile?.name || "Customer";
  const userRole = "user";

  const isImpersonating = typeof window !== "undefined" && localStorage.getItem("admin_impersonating_customer");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {isImpersonating && (
        <div className="bg-amber-500 text-white px-4 py-2 text-sm font-bold flex justify-between items-center z-50 relative sticky top-0">
          <div className="flex items-center gap-2">
            <span>👀</span> You are currently viewing this user as an Admin (Impersonation Mode)
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_impersonating_customer");
              window.location.href = "/admin";
            }}
            className="bg-black/20 hover:bg-black/30 px-3 py-1 rounded transition-colors"
          >
            Exit Impersonation
          </button>
        </div>
      )}
      {/* Header matching Vendor Dashboard */}
      <header className="bg-[#0066CC] sticky top-0 z-40 w-full shadow-md flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#0052A3]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <Link href="/">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm cursor-pointer bg-white">
              <Image src="/sd_logo_final.png" alt="Gold Hub Logo" fill sizes="56px" className="object-contain p-1" />
            </div>
          </Link>
          <div>
            <span className="font-black text-xl tracking-tight text-white leading-none">SHYAM DASH <span className="font-normal text-blue-100 capitalize hidden sm:inline">User Panel</span></span>
          </div>
        </div>

        {/* Center: Buttons */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-3">
          <Link href="/" className="px-5 py-2 text-sm font-bold flex items-center gap-2 rounded-full bg-white/20 text-white border border-white/20 shadow-sm hover:bg-white/30 transition-all">
            <span>🌐</span> Marketplace
          </Link>
          <Link href="/admin" className="px-5 py-2 text-sm font-bold flex items-center gap-2 rounded-full bg-red-500/20 text-white border border-red-500/30 shadow-sm hover:bg-red-500/40 transition-all">
            <span>🛡️</span> Admin Panel
          </Link>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('admin_impersonating_shop', 'demo_vendor_1');
                window.location.href = '/vendor';
              }
            }}
            className="px-5 py-2 text-sm font-bold flex items-center gap-2 rounded-full bg-green-500/20 text-white border border-green-500/30 shadow-sm hover:bg-green-500/40 transition-all"
          >
            <span>🏪</span> Shop Panel (Demo)
          </button>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('admin_impersonating_customer', 'demo_customer_1');
                window.location.href = '/dashboard';
              }
            }}
            className="px-5 py-2 text-sm font-bold flex items-center gap-2 rounded-full bg-[#0074E4] text-white border border-white/40 shadow-inner"
          >
            <span>👤</span> User Panel (Demo)
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="text-sm font-bold text-blue-100 hover:text-white md:hidden transition-colors">Marketplace</Link>
          <div className="w-9 h-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white font-bold uppercase hidden sm:flex shadow-sm">
             {userName?.charAt(0) || "C"}
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* MOBILE BACKDROP */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-72 shrink-0 space-y-6 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="bg-[#0074E4] lg:rounded-3xl shadow-[4px_0_30px_rgba(0,116,228,0.3)] border border-[#0052A3] p-6 h-full lg:h-[calc(100vh-120px)] overflow-y-auto flex flex-col text-white sticky top-24">
            
            {/* Top Identity Block */}
            <div className="flex items-center gap-4 border-b border-[#0052A3] pb-6 mb-6">
              <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-sm border border-white/20">
                {userName?.charAt(0) || "C"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{userName}</h3>
                <p className="text-xs text-blue-100 font-bold truncate uppercase tracking-wider">{userRole}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-2 pr-2">
              {navItems.map((item) => {
                const isActive = pathname === item.id;
                return (
                  <Link 
                    key={item.id}
                    href={item.id}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left px-4 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-3 ${
                      isActive ? "bg-white/20 text-white font-bold shadow-inner" : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-[#0052A3]">
              <button 
                onClick={async () => {
                  if (!profile) await loginDemo();
                  else await logout();
                }} 
                className="w-full text-left px-4 py-2.5 rounded-full text-sm font-semibold flex items-center gap-3 text-red-200 hover:text-white hover:bg-red-500/80 transition-all border border-transparent"
              >
                <span className="text-lg">{profile ? '🚪' : '🔑'}</span> 
                {profile ? 'Sign Out' : 'Sign In with Google'}
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 custom-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-smooth snap-x">
            {navItems.map(item => (
              <Link
                key={item.id}
                href={item.id}
                className={`whitespace-nowrap snap-center px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center ${
                  pathname === item.id ? "bg-[#0074E4] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
