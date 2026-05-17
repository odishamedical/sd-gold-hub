"use client";

import React from "react";
import Link from "next/link";

export default function UserDropdown() {
  return (
    <div className="relative group/user">
      {/* Simulated Logged-In State (Persistent Gmail Session) */}
      <button className="flex items-center gap-2 bg-[#141C33] border border-[#2A344A] px-4 py-2 rounded-full hover:border-[#C5A059] transition-all text-[#C5A059]">
        <div className="w-5 h-5 rounded-full bg-[#C5A059] text-[#0A1021] flex items-center justify-center font-bold text-xs font-mono">G</div>
        <span className="text-xs font-bold uppercase tracking-widest text-white">Rajesh (Gmail)</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-[#0E1528] border border-[#C5A059] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 opacity-0 pointer-events-none group-hover/user:opacity-100 group-hover/user:pointer-events-auto transition-all duration-300 z-50 flex flex-col gap-3">
        <div className="border-b border-[#2A344A] pb-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Sovereign Gmail Account</p>
          <p className="text-sm font-bold text-white truncate font-mono">rajesh.sharma@gmail.com</p>
          <span className="inline-block bg-green-500/20 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 animate-pulse font-mono">● Push Notifications Active</span>
        </div>

        <div className="flex flex-col gap-1.5 text-xs font-mono">
          <Link href="/accounts" className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#141C33] hover:text-[#C5A059] transition-colors text-gray-300">
            <span>👤</span> My Sovereign Profile (Address & KYC)
          </Link>
          <Link href="/accounts" className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#141C33] hover:text-[#C5A059] transition-colors text-gray-300">
            <span>📦</span> My Requisitions & Armored Transit
          </Link>
          <Link href="/cart" className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#141C33] hover:text-[#C5A059] transition-colors text-gray-300">
            <span>🛍️</span> My Insured Bag (Cart)
          </Link>
        </div>

        <div className="border-t border-[#2A344A] pt-3 flex justify-between items-center">
          <button 
            onClick={() => alert("🚪 Sign Out Triggered.\n\nSovereign Gmail Session Disconnected. To reconnect, click 'Sign In with Gmail' on your next visit.")}
            className="text-[10px] text-gray-500 hover:text-red-400 transition-colors tracking-widest uppercase font-mono"
          >
            Sign Out
          </button>
          <span className="text-[9px] text-[#C5A059] font-mono">Secured by SD Auth</span>
        </div>
      </div>
    </div>
  );
}
