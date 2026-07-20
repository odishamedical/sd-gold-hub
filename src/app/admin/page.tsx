import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Admin Top Navigation Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-6 py-2.5 rounded-full bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest whitespace-nowrap">Dashboard</button>
        <button className="px-6 py-2.5 rounded-full bg-[#141C33] border border-[#2A344A] text-gray-400 hover:text-white hover:border-[#C5A059] transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap">Jewelry Vault</button>
        <button className="px-6 py-2.5 rounded-full bg-[#141C33] border border-[#2A344A] text-gray-400 hover:text-white hover:border-[#C5A059] transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap">Orders & Shipments</button>
        <button className="px-6 py-2.5 rounded-full bg-[#141C33] border border-[#2A344A] text-gray-400 hover:text-white hover:border-[#C5A059] transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap">Vendor Network</button>
        <button className="px-6 py-2.5 rounded-full bg-[#141C33] border border-[#2A344A] text-gray-400 hover:text-white hover:border-[#C5A059] transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap">Storefront CMS</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0E1528] rounded-2xl p-6 border border-[#C5A059]/30 relative overflow-hidden shadow-[0_0_20px_rgba(197,160,89,0.1)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 relative z-10">Total Revenue</p>
          <p className="text-3xl font-bold text-[#C5A059] relative z-10">₹ 14,50,000</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-500 relative z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            <span>+12.5% from last month</span>
          </div>
        </div>
        <div className="bg-[#0E1528] rounded-2xl p-6 border border-[#2A344A] shadow-lg">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Active Orders</p>
          <p className="text-3xl font-bold text-white">24</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#C5A059]">
            <span>5 Pending Processing</span>
          </div>
        </div>
        <div className="bg-[#0E1528] rounded-2xl p-6 border border-[#2A344A] shadow-lg">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Verified Vendors</p>
          <p className="text-3xl font-bold text-white">12</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
            <span>All nodes operational</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0E1528] rounded-2xl p-8 border border-[#2A344A] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 inset-x-[20%] h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent"></div>
        <h2 className="text-lg font-serif text-[#C5A059] tracking-wider mb-6">Recent Activity</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#2A344A] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141C33] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">New Order #4029</p>
                <p className="text-xs text-gray-500 mt-1">Celestial Diamond Solitaire</p>
              </div>
            </div>
            <p className="text-xs text-[#C5A059] font-bold">Just now</p>
          </div>
          <div className="flex justify-between items-center border-b border-[#2A344A] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Vendor Approval</p>
                <p className="text-xs text-gray-500 mt-1">Royal Diamonds applied for Tier 3</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">System Update</p>
                <p className="text-xs text-gray-500 mt-1">Live Gold Rate automatically updated</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
