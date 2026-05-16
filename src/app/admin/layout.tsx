import React from 'react';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060A14] flex text-white font-sans overflow-hidden">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#0A1021] border-r border-[#2A344A] flex flex-col z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-[#2A344A] flex items-center gap-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src="/sd_logo_final.png" alt="Shyam Dash Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-light tracking-widest uppercase text-white leading-tight">Shyam Dash <span className="font-bold text-[#C5A059]">Gold Hub</span></h2>
            <span className="text-[9px] text-[#C5A059] uppercase tracking-widest mt-0.5">Admin Control</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 p-6 flex-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-4">Menu</span>
          <a href="/admin" className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#141C33] to-[#0A1021] border border-[#C5A059]/30 text-[#C5A059] font-bold flex items-center gap-3 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <a href="/admin/products" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Jewelry Vault
          </a>
          <a href="/admin/orders" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            Orders & Shipments
          </a>
          <a href="/admin/vendors" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Vendor Network
          </a>
          <a href="/admin/settings" className="px-4 py-3 rounded-xl hover:bg-[#141C33] text-gray-400 hover:text-white transition-colors border border-transparent hover:border-[#2A344A] flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            System Settings
          </a>
        </nav>
        
        <div className="p-6 border-t border-[#2A344A]">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0E1528] rounded-xl border border-[#2A344A]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#996515] overflow-hidden flex items-center justify-center text-xs font-bold text-black">
              SD
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Shyam Dash</p>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#060A14] z-10 relative">
        <header className="sticky top-0 z-50 bg-gradient-to-b from-[#FFF5C3] via-[#D4AF37] to-[#996515] border-b-4 border-[#7A4B0B] px-10 py-5 flex justify-between items-center shadow-[0_10px_30px_rgba(212,175,55,0.3)]">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-[#0A1021] tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] uppercase">Gold Hub Command Center</h2>
            <a 
              href="http://localhost:3000/launcher" 
              className="hidden md:flex items-center gap-2 bg-[#0A1021] border border-[#0A1021] hover:bg-[#141C33] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#D4AF37] transition-all shadow-inner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              App Switcher
            </a>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#0A1021] hover:text-white transition-colors relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 border border-[#D4AF37] rounded-full"></span>
            </button>
            <button className="text-xs font-black uppercase tracking-widest text-[#D4AF37] bg-[#0A1021] px-6 py-2.5 rounded-full hover:bg-black transition-colors shadow-lg border border-[#0A1021]">
              + New Product
            </button>
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
