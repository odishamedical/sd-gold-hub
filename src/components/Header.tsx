"use client";

import React, { useState } from "react";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import GlobalSearchConsole from "./GlobalSearchConsole";
import { Suspense } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gold Jewellery", href: "/gold-jewellery" },
  { label: "Directory", href: "/directory" },
  { label: "Jobs", href: "/jobs" },
  // { label: "Auctions", href: "/auctions" },
  // { label: "Franchise", href: "/register-franchise" }
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
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative w-12 sm:w-16 h-10 sm:h-12 shrink-0 overflow-hidden rounded-lg">
              <Image src="/gdlogo.png" alt="Gold Dunia Logo" fill sizes="(max-width: 640px) 48px, 64px" className="object-cover object-top scale-[1.3] sm:scale-[1.4]" priority />
            </div>
            <div className="min-w-0 flex flex-col items-stretch">
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-[#C5A059] leading-none truncate mt-0.5">Gold Dunia</h1>
              <div className="hidden sm:block text-[7px] sm:text-[8px] text-[#C5A059] font-bold uppercase mt-1 tracking-[0.2em]">
                Authentic Gold & Fine Jewelry
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
            <Link href="/gold-price-live" className="flex items-center gap-2 text-[10px] md:text-xs font-black text-white hover:text-red-100 uppercase tracking-widest transition-all bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 rounded-lg border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:-translate-y-0.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              GOLD PRICE TODAY
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <UserDropdown />

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
            <span>GOLD DUNIA - THE ULTIMATE WORLD OF AUTHENTIC GOLD & FINE JEWELRY</span>
            <span className="text-[#C5A059]">•</span>
            <span>CHECK INDIAN GOLD PRICE, DUBAI GOLD PRICE, AND USA GOLD PRICE LIVE</span>
            <span className="text-[#C5A059]">•</span>
            <span>GET TODAY GOLD PRICE ALERTS DIRECTLY TO YOUR DEVICE</span>
            <span className="text-[#C5A059]">•</span>
            <span>EXPLORE THE LATEST EXCLUSIVE GOLD JEWELLERY DESIGN TRENDS</span>
            <span className="text-[#C5A059]">•</span>
            <span>EXPLORE EXQUISITE 22K & 24K HALLMARKED BRIDAL COLLECTIONS</span>
            <span className="text-[#C5A059]">•</span>
            <span>DISCOVER RARE ANTIQUE KUNDAN & POLKI MASTERPIECES</span>
            <span className="text-[#C5A059]">•</span>
            <span>SHOP VERIFIED HUID CERTIFIED TEMPLE JEWELLERY DIRECT FROM MASTER ARTISANS</span>
            <span className="text-[#C5A059]">•</span>
            <span>GOLD DUNIA - THE ULTIMATE WORLD OF AUTHENTIC GOLD & FINE JEWELRY</span>
            <span className="text-[#C5A059]">•</span>
            <span>CHECK INDIAN GOLD PRICE, DUBAI GOLD PRICE, AND USA GOLD PRICE LIVE</span>
            <span className="text-[#C5A059]">•</span>
            <span>GET TODAY GOLD PRICE ALERTS DIRECTLY TO YOUR DEVICE</span>
            <span className="text-[#C5A059]">•</span>
            <span>EXPLORE THE LATEST EXCLUSIVE GOLD JEWELLERY DESIGN TRENDS</span>
          </div>
        </div>
        <Suspense fallback={null}>
          <GlobalSearchConsole />
        </Suspense>
      </header>

      {/* Mobile Navigation Modal (Compact & Centered) */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-[320px] bg-[#060A14] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[#C5A059]/30 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-[#C5A059]/20 bg-[#0A1021] flex items-center justify-between">
              <div className="w-6 h-6"></div> {/* Spacer to keep title centered */}
              <div className="relative w-28 h-10">
                <Image src="/gdlogo.png" alt="Gold Dunia" fill className="object-contain scale-110" />
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 flex flex-col space-y-2 text-center">
              {NAV_LINKS.map((navItem, index) => (
                <Link 
                  key={index} 
                  href={navItem.href!} 
                  onClick={() => setMobileNavOpen(false)} 
                  className="block px-4 py-3 text-sm font-bold text-gray-200 hover:bg-[#141C33] hover:text-[#C5A059] rounded-xl transition-colors uppercase tracking-widest text-center"
                >
                  {navItem.label}
                </Link>
              ))}
              
              <div className="h-px w-full bg-[#C5A059]/20 my-2"></div>
              
              <Link 
                href="/gold-price-live" 
                onClick={() => setMobileNavOpen(false)} 
                className="flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black text-white bg-gradient-to-r from-red-600 to-red-800 border border-red-500/50 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] uppercase tracking-widest mt-2"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                GOLD PRICE TODAY
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
