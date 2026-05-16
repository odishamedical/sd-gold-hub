"use client";

import { useState } from "react";

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Vendor Network</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Manage partner applications and store nodes.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#2A344A] mb-8">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "pending" ? "text-[#C5A059]" : "text-gray-500 hover:text-white"}`}
        >
          Pending Approvals
          <span className="ml-2 bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full text-[10px]">1</span>
          {activeTab === "pending" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("active")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "active" ? "text-[#C5A059]" : "text-gray-500 hover:text-white"}`}
        >
          Active Vendors
          {activeTab === "active" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>}
        </button>
      </div>

      {/* Content */}
      {activeTab === "pending" && (
        <div className="space-y-6">
          <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Glowing left edge for pending status */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C5A059] to-transparent"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#141C33] border border-[#C5A059]/30 flex items-center justify-center text-2xl">
                  ✨
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Glow Jewellers</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      Contact: John Doe (+91 9876543210)
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Applied: Just now
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 border border-[#2A344A] rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:border-[#C5A059] transition-colors bg-[#141C33]">
                  Verify Docs
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-[#996515] to-[#C5A059] rounded-xl text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                  Approve
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#2A344A] grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">GSTIN Number</p>
                <p className="font-mono text-sm text-white">22AAAAA0000A1Z5</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">BIS Hallmark ID</p>
                <p className="font-mono text-sm text-white">HM/C-1234567</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Compliance Status</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                  Pending Verification
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "active" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {/* Mock active vendors */}
          <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 hover:border-[#C5A059]/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-[#141C33] border border-[#C5A059] overflow-hidden flex items-center justify-center text-[#C5A059] font-bold group-hover:scale-110 transition-transform">
                IJ
              </div>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded border border-green-500/20">Active</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">IRA Jewels</h3>
            <p className="text-xs text-[#C5A059] mb-4">Tier 1 Premium Vendor</p>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-[#2A344A]">
              <span>Products: 1,245</span>
              <span>Sales: ₹ 45.2L</span>
            </div>
          </div>

          <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 hover:border-[#C5A059]/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-[#141C33] border border-[#C5A059] overflow-hidden flex items-center justify-center text-[#C5A059] font-bold group-hover:scale-110 transition-transform">
                DJ
              </div>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded border border-green-500/20">Active</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Dwarika Jewellers</h3>
            <p className="text-xs text-[#C5A059] mb-4">Tier 2 Verified Vendor</p>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-[#2A344A]">
              <span>Products: 854</span>
              <span>Sales: ₹ 22.1L</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
