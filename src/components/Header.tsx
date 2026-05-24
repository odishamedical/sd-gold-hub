"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";
import EcosystemSwitcher from "@/components/EcosystemSwitcher";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="w-full font-sans">
      {/* Top Live Rates Bar */}
      <div className="bg-[#121A30] text-[#9BA3AF] text-[10px] md:text-xs py-2 px-4 md:px-6 flex overflow-x-auto no-scrollbar whitespace-nowrap justify-start md:justify-center items-center gap-4 md:gap-6 border-b border-[#2A344A] rounded-t-none md:rounded-t-xl">
        <span className="text-[#C5A059] font-bold tracking-widest uppercase shrink-0">Live Gold Rates</span>
        <span className="opacity-40 shrink-0">|</span>
        <span className="shrink-0">24K: ₹7,138.50/gm <span className="text-green-500">(▲0.8%)</span></span>
        <span className="opacity-40 shrink-0">|</span>
        <span className="shrink-0">22K: ₹6,985.20/gm <span className="text-green-500">(▲0.6%)</span></span>
        <span className="opacity-40 shrink-0">|</span>
        <span className="shrink-0">Updated: 14:32 IST</span>
      </div>

      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-[#0A1021]/95 backdrop-blur-sm px-4 md:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center border-b border-[#2A344A]">
        <div className="absolute bottom-0 inset-x-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_20px_rgba(230,179,74,0.8)] z-20"></div>
        <div className="flex items-center gap-4 md:gap-8 lg:gap-12 shrink-0 min-w-0">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
              <Image 
                src="/sd_logo_final.png" 
                alt="Shyam Dash Logo" 
                fill 
                className="object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.5)] group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="flex flex-col mt-1 md:mt-2 min-w-0">
              <h1 className="text-lg md:text-xl lg:text-2xl font-serif text-[#C5A059] tracking-widest font-bold leading-none whitespace-nowrap truncate">
                Shyam Dash
              </h1>
              <span className="text-[7px] md:text-[9px] lg:text-[10px] text-[#C5A059]/70 uppercase tracking-widest mt-1 whitespace-nowrap truncate">India's Verified Gold Marketplace.</span>
            </div>
          </Link>
          
          <div className="relative hidden md:block shrink-0">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-[#141C33] border border-[#2A344A] text-white text-xs lg:text-sm rounded-full py-2 px-10 w-36 lg:w-64 focus:outline-none focus:border-[#C5A059] transition-all"
            />
            <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* Mobile Right Actions */}
        <div className="flex md:hidden items-center gap-3 text-white shrink-0">
          <Link href="/cart" className="relative p-1">
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#0A1021] text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">2</span>
          </Link>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="p-1 cursor-pointer hover:opacity-80 transition-opacity" aria-label="Toggle Menu">
            <svg className="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm text-gray-300 shrink-0">
          <Link href="/shop" className="hover:text-[#C5A059] transition-colors shrink-0">Search</Link>
          <Link href="/shop" className="text-[#C5A059] font-bold transition-colors flex items-center gap-1 shrink-0">Shop <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
          <Link href="/auctions" className="hover:text-[#C5A059] transition-colors flex items-center gap-1 shrink-0">Auctions <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
          <Link href="/register-franchise" className="hover:text-[#0A1021] hover:bg-[#C5A059] text-[#C5A059] border border-[#C5A059]/40 transition-colors flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Franchise</Link>
          
          <div className="flex items-center gap-3 shrink-0">
          {/* Removed duplicate switcher and user dropdown since they are in GlobalHeader */}
          </div>
          
          <Link href="/cart" className="flex items-center gap-1.5 lg:gap-2 text-white bg-[#141C33] border border-[#2A344A] px-3 lg:px-4 py-1.5 lg:py-2 rounded-full hover:border-[#C5A059] transition-all shrink-0 shadow-sm">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#C5A059] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest shrink-0">Bag</span>
            <span className="bg-[#C5A059] text-[#0A1021] text-[9px] lg:text-[10px] font-bold w-3.5 h-3.5 lg:w-4 lg:h-4 flex items-center justify-center rounded-full shrink-0">2</span>
          </Link>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden sticky top-[73px] z-40 bg-[#0A1021]/98 backdrop-blur-md border-b border-[#C5A059]/40 px-6 py-6 space-y-6 shadow-2xl animate-fadeIn">
          {/* Mobile Search Bar */}
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search jewelry..." 
              className="w-full bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl py-3 px-10 focus:outline-none focus:border-[#C5A059] transition-all"
            />
            <svg className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div className="flex flex-col space-y-4 text-xs font-bold uppercase tracking-widest text-gray-200 border-t border-[#2A344A] pt-4">
            <Link href="/" onClick={() => setMobileNavOpen(false)} className="hover:text-[#C5A059] border-b border-[#2A344A] pb-3 block">Home</Link>
            <Link href="/shop" onClick={() => setMobileNavOpen(false)} className="text-[#C5A059] border-b border-[#2A344A] pb-3 block flex justify-between items-center">
              <span>Shop Catalog</span>
              <span>→</span>
            </Link>
            <Link href="/auctions" onClick={() => setMobileNavOpen(false)} className="hover:text-[#C5A059] border-b border-[#2A344A] pb-3 block flex justify-between items-center">
              <span>Live Auctions</span>
              <span>→</span>
            </Link>
            <Link href="/register-franchise" onClick={() => setMobileNavOpen(false)} className="text-[#C5A059] border-b border-[#2A344A] pb-3 block flex justify-between items-center">
              <span>Apply for Franchise</span>
              <span>🏢</span>
            </Link>
            <Link href="/cart" onClick={() => setMobileNavOpen(false)} className="hover:text-[#C5A059] border-b border-[#2A344A] pb-3 block flex justify-between items-center">
              <span>My Insured Bag (2)</span>
              <span>🛍️</span>
            </Link>
          </div>

          {/* Removed duplicate user profile and switcher on mobile */}
        </div>
      )}
    </div>
  );
}
