"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop Gold", href: "/shop" },
  { label: "Auctions", href: "/auctions" },
  { label: "Directory", href: "/directory" },
  { label: "Franchise", href: "/register-franchise" }
];

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith("/franchise/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/vendor")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#060A14] border-b border-[#2A344A] shadow-xl flex flex-col transition-all duration-300">
        <div className="flex justify-between items-center gap-2 w-full px-4 sm:px-6 py-2 sm:py-3 max-w-[1600px] mx-auto">
          {/* Left Side: Gold Logo, Bhulia.com & Slogan */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative w-10 sm:w-14 h-10 sm:h-14 rounded-full overflow-hidden shadow-[0_0_20px_rgba(197,160,89,0.4)] shrink-0 bg-[#0A1021]">
              <Image src="/sd_logo_final.png" alt="SD Gold Logo" fill sizes="56px" className="object-cover scale-[1.15]" />
            </div>
            <div className="min-w-0 flex flex-col items-stretch">
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-[#C5A059] leading-none">Shyam Dash</h1>
              <div className="hidden sm:block text-[8px] sm:text-[9px] text-white/80 font-semibold uppercase mt-1 tracking-widest text-center">
                INDIA'S VERIFIED GOLD MARKETPLACE
              </div>
            </div>
          </Link>

          {/* Center: Dedicated Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 text-sm font-semibold tracking-wide text-white whitespace-nowrap">
            {NAV_LINKS.map((navItem, index) => (
              <Link key={index} href={navItem.href!} className="px-4 py-2 rounded-lg hover:bg-[#141C33] hover:text-[#C5A059] transition-all border border-transparent hover:border-[#C5A059]/30">
                {navItem.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <UserDropdown />

            <button onClick={() => router.push('/login')} className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow cursor-pointer hover:brightness-110 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              <span>Sign In</span>
            </button>
            
            <Link href="/shop" className="hidden sm:flex items-center justify-center w-10 h-10 bg-[#141C33] border border-[#2A344A] text-white rounded-xl hover:border-[#C5A059] hover:text-[#C5A059] transition-all cursor-pointer shrink-0 shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </Link>

            <button className="hidden sm:flex items-center gap-2 bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] text-white hover:text-[#C5A059] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span>Bag (2)</span>
            </button>

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="lg:hidden flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 bg-[#141C33] border border-[#2A344A] text-[#C5A059] rounded-xl transition-all cursor-pointer shrink-0 shadow">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileNavOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Golden Texture Border */}
        <div className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#e6b34a] via-[#C5A059] to-[#e6b34a] opacity-90 shadow-[0_0_15px_rgba(197,160,89,0.8)] border-b border-[#2A344A]"></div>

        {/* Scrolling SEO Ticker */}
        <div className="w-full bg-[#060A14] py-1.5 overflow-hidden flex border-t border-[#C5A059]/20">
          <div className="whitespace-nowrap animate-marquee flex gap-16 text-[10px] sm:text-xs text-white/90 font-medium tracking-[0.2em] uppercase shrink-0 min-w-full">
            <span>SHYAM DASH - INDIA'S VERIFIED GOLD MARKETPLACE</span>
            <span className="text-[#C5A059]">•</span>
            <span>EXPLORE EXQUISITE 22K & 24K HALLMARKED BRIDAL COLLECTIONS</span>
            <span className="text-[#C5A059]">•</span>
            <span>DISCOVER RARE ANTIQUE KUNDAN & POLKI MASTERPIECES</span>
            <span className="text-[#C5A059]">•</span>
            <span>SHOP VERIFIED HUID CERTIFIED TEMPLE JEWELLERY DIRECT FROM MASTER ARTISANS</span>
            <span className="text-[#C5A059]">•</span>
            <span>SHYAM DASH - INDIA'S VERIFIED GOLD MARKETPLACE</span>
            <span className="text-[#C5A059]">•</span>
            <span>EXPLORE EXQUISITE 22K & 24K HALLMARKED BRIDAL COLLECTIONS</span>
            <span className="text-[#C5A059]">•</span>
            <span>DISCOVER RARE ANTIQUE KUNDAN & POLKI MASTERPIECES</span>
            <span className="text-[#C5A059]">•</span>
            <span>SHOP VERIFIED HUID CERTIFIED TEMPLE JEWELLERY DIRECT FROM MASTER ARTISANS</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          ></div>
          
          <div className="relative w-4/5 max-w-sm bg-[#060A14] h-full flex flex-col shadow-2xl border-r border-[#C5A059]/30">
            <div className="p-6 border-b border-[#C5A059]/20 bg-[#0A1021]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#C5A059] font-serif font-bold text-xl tracking-wider">Shyam Dash</h2>
                <button onClick={() => setMobileNavOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <button onClick={() => { setMobileNavOpen(false); router.push('/login'); }} className="w-full bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-lg">
                Sign In / Register
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {NAV_LINKS.map((navItem, index) => (
                <Link key={index} href={navItem.href!} onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-200 hover:bg-[#141C33] hover:text-[#C5A059] rounded-xl transition-colors uppercase tracking-widest">
                  {navItem.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
