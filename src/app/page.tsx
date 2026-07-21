"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ShieldCheck, Gem, Percent } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const geoChips = [
    { label: "Odisha", href: "/directory/odisha" },
    { label: "Maharashtra", href: "/directory/maharashtra" },
    { label: "Delhi", href: "/directory/delhi" },
    { label: "Karnataka", href: "/directory/karnataka" },
    { label: "Gujarat", href: "/directory/gujarat" },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gray-50 pt-24 pb-32 overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E7EB 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            India's Largest Verified Gold Directory
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Find Trusted Gold Jewelers in <span className="text-blue-600">Your City</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover premium gold shops, compare live making charges, and verify HUID products before you visit the store.
          </p>

          {/* Massive Premium Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex-1 flex items-center px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search for jewelry type or shop name..." 
                className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 w-full">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="City, state, or pincode" 
                className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap">
              Search Now
            </button>
          </div>

          {/* Geo Chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mr-2">Popular:</span>
            {geoChips.map((chip) => (
              <Link key={chip.label} href={chip.href} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm">
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">100% Verified Shops</h3>
                <p className="text-sm text-gray-600">Every shop is manually vetted with valid GST and trade licenses.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Gem className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">HUID Certified Gold</h3>
                <p className="text-sm text-gray-600">Browse thousands of products with transparent Govt HUIDs.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Percent className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Transparent Making Charges</h3>
                <p className="text-sm text-gray-600">Compare live daily rates and making charges side-by-side.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Shops Section Placeholder */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Featured Jewelers Near You</h2>
              <p className="text-gray-600">Discover elite shops with the highest ratings and best transparent pricing.</p>
            </div>
            <Link href="/directory" className="text-blue-600 font-bold hover:text-blue-800 transition-colors hidden md:block">
              View All Shops &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Dummy Shop Tickets */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full">
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10"></div>
                  <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                    <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">Elite Shop</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Royal Jewelers</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    Bhubaneswar, Odisha
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">Live 22K Rate: <span className="font-bold text-gray-900">₹7,250</span>/gm</div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/directory" className="inline-block px-6 py-3 bg-white border border-gray-200 text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-colors w-full">
              View All Shops
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
