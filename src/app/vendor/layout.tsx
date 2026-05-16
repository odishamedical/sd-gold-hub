import React from 'react';
import Image from 'next/image';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060A14] flex text-white font-sans overflow-hidden">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/5 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#0A1021] border-r border-[#2A344A] flex flex-col z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-[#2A344A] flex items-center gap-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src="/sd_logo_final.png" alt="Shyam Dash Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-light tracking-widest uppercase text-white leading-tight">Shyam Dash <span className="font-bold text-[#C5A059]">Gold Hub</span></h2>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">Verified Vendor</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 p-6 flex-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-4">My Store</span>
          <a href="/vendor" className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#141C33] to-[#0A1021] border border-[#C5A059]/30 text-[#C5A059] font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <a href="/vendor/products" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            My Products
          </a>
          <a href="/vendor/orders" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            Customer Orders
          </a>
          <a href="/vendor/profile" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Store Profile
          </a>
        </nav>
        
        <div className="p-6 border-t border-[#2A344A]">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0E1528] rounded-xl border border-[#2A344A]">
            <div className="w-8 h-8 rounded-full bg-[#141C33] border border-[#C5A059] overflow-hidden flex items-center justify-center text-xs font-bold text-[#C5A059]">
              IJ
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">IRA Jewels</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Premium Vendor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#060A14] z-10 relative">
        <header className="sticky top-0 z-50 bg-[#0A1021]/90 backdrop-blur-md border-b border-[#2A344A] px-10 py-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#141C33] border border-[#C5A059] overflow-hidden flex items-center justify-center text-sm font-bold text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.2)]">
              IJ
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-bold text-white tracking-wider uppercase leading-tight">IRA Jewels</h2>
              <span className="text-[10px] text-[#C5A059] uppercase tracking-widest">Vendor Command Center</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#A0AEC0] hover:text-white transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 border border-[#0A1021] rounded-full"></span>
            </button>
            <a href="https://sd-auth-center.vercel.app" className="text-xs font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 bg-[#141C33] px-4 py-2 rounded-lg hover:border-[#C5A059] transition-colors shadow-inner">
              Sign Out
            </a>
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
