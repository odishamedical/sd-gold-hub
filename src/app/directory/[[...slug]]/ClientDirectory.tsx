"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Star, ShieldCheck, Gem } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ClientDirectory({ initialRole = 'all', initialState = 'Odisha', initialDistrict = 'all' }: { initialRole?: string, initialState?: string, initialDistrict?: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "India", href: "/directory" },
    ...(initialState && initialState !== 'all' ? [{ label: initialState, href: `/directory/all/${initialState.toLowerCase()}` }] : []),
    ...(initialDistrict && initialDistrict !== 'all' ? [{ label: initialDistrict }] : [])
  ];

  return (
    <main className="min-h-screen bg-[#111111] text-[#E2E8F0] font-sans pb-20 relative">
      {/* Ambient Diamond Sparkle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(226, 232, 240, 0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="fixed top-0 right-1/4 w-[600px] h-[300px] bg-[#D4AF37] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* Directory Header */}
      <div className="border-b border-[#D4AF37]/20 pt-12 pb-16 relative z-10 bg-[#0A0A0A]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] text-white mb-4 uppercase tracking-widest aurous-silver-text">
            {initialDistrict !== 'all' ? `${initialDistrict} JEWELERS DIRECTORY` : `JEWELERS DIRECTORY IN ${initialState}`}
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl text-lg font-light">
            Browse our curated list of hallmarked, transparent, and trusted jewelry stores.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="aurous-glass rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-[family-name:var(--font-display)] text-white mb-6 flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3 tracking-wider">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              FILTERS
            </h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">By Tier</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" defaultChecked />
                    Premium Elite
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    Gold Boutiques
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Verification</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" defaultChecked />
                    HUID Certified
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Metal Type</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" defaultChecked />
                    24K / 22K Gold
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    Platinum / Diamonds
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Directory Grid */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="aurous-glass rounded-xl p-2 flex items-center mb-8 relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent rounded-xl opacity-30 z-[-1]"></div>
            <Search className="w-5 h-5 text-[#D4AF37] ml-4" />
            <input 
              type="text" 
              placeholder="Find specific jewelers..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-[#9CA3AF] px-4 py-3 font-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Dummy Listing Cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aurous-glass rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500">
                <div className="h-48 bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10"></div>
                  
                  {/* Real Image Integration */}
                  <div className="w-full h-full border border-[#D4AF37]/10 rounded-xl bg-[#1A1A1A] overflow-hidden relative z-0">
                     <img 
                       src={i % 2 === 0 ? "/images/showrooms.png" : "/images/products-grid.png"} 
                       alt="Luxury Gold Item" 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       style={{ objectPosition: i === 1 ? 'center top' : i === 2 ? 'left center' : i === 3 ? 'right bottom' : i === 4 ? 'center center' : i === 5 ? 'left top' : 'right top' }} 
                     />
                  </div>

                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    {i % 2 === 0 ? (
                      <span className="px-3 py-1 bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                        <Star className="w-3 h-3 fill-[#D4AF37]" /> Elite
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[#1A1A1A] border border-[#E2E8F0]/40 text-[#E2E8F0] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col bg-[#111111]/80 border-t border-[#D4AF37]/10">
                  <h3 className="text-lg font-[family-name:var(--font-display)] text-white mb-1 group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
                    {i === 1 ? "ODISHA'S FINEST GOLD" : i === 2 ? "KHORDHA BULLION" : "MODERN GOLD WORKS"}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mb-4 font-light">Premium traditional jewelry.</p>
                  
                  <div className="flex items-center text-xs text-[#9CA3AF] mb-6">
                    <MapPin className="w-3 h-3 mr-1 text-[#D4AF37]" />
                    {initialDistrict !== 'all' ? initialDistrict : 'Khordha'}, {initialState}
                  </div>
                  
                  <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#D4AF37]/10">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#9CA3AF] font-light">Live 22K Rate:</span>
                      <span className="font-normal text-[#E2E8F0] tracking-wide">₹7,250/g</span>
                    </div>
                    <Link href={`/shop/demo-${i}`} className="w-full py-2.5 border border-[#D4AF37]/40 text-[#D4AF37] font-light text-center text-sm rounded-full hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-wider">
                      Visit Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
