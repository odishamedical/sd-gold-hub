"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ShieldCheck, Gem, Percent, ChevronRight, Star } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const geoChips = [
    { label: "MUMBAI", href: "/directory/maharashtra/mumbai" },
    { label: "DELHI", href: "/directory/delhi" },
    { label: "BANGALORE", href: "/directory/karnataka/bangalore" },
    { label: "HYDERABAD", href: "/directory/telangana/hyderabad" },
  ];

  return (
    <main className="min-h-screen bg-[#111111] text-white font-sans overflow-hidden">
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Luxury Hero Section */}
      <section className="relative pt-32 pb-24 z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          
          <h2 className="text-[#E2E8F0] tracking-[0.2em] uppercase text-sm font-semibold mb-4 opacity-80 font-sans">
            Curated Excellence
          </h2>
          
          <h1 className="text-5xl md:text-7xl font-normal text-white mb-10 font-[family-name:var(--font-display)] aurous-silver-text leading-tight">
            THE ART OF GOLD
          </h1>
          <p className="text-lg md:text-xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Explore a marketplace of unrivaled craftsmanship and investment-grade gold pieces.
          </p>

          {/* Frosted Glass Search Capsule */}
          <div className="aurous-glass rounded-full max-w-4xl mx-auto p-2 flex flex-col md:flex-row items-center gap-2 mb-16 relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent rounded-full opacity-50 z-[-1]"></div>
            
            <div className="flex-1 flex items-center px-6 py-4 w-full md:border-r border-[#D4AF37]/20">
              <input 
                type="text" 
                placeholder="Find Trusted Gold Jewelers in [Your City]..." 
                className="w-full bg-transparent border-none focus:outline-none text-white placeholder-[#9CA3AF] font-light text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 md:w-32 justify-end">
               <button className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#996515] rounded-full text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                 <Search className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Geo Chips */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {geoChips.map((chip) => (
              <Link key={chip.label} href={chip.href} className="px-6 py-2.5 bg-[#1A1A1A]/80 border border-[#D4AF37]/30 text-[#E2E8F0] text-sm tracking-wider font-semibold rounded-full hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:text-white transition-all backdrop-blur-sm">
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Trust Banner */}
      <section className="relative z-10 py-16 border-y border-[#D4AF37]/10 bg-[#0A0A0A]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex flex-col items-center text-center p-6 aurous-glass rounded-2xl group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-[#E2E8F0] group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(226,232,240,0.5)]">
                <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-[#D4AF37] mb-2 tracking-wide">VERIFIED HUID PRODUCTS</h3>
              <p className="text-sm text-[#9CA3AF] font-light">Every piece guaranteed by Govt. Hallmarking.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 aurous-glass rounded-2xl group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                <Percent className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-[#D4AF37] mb-2 tracking-wide">TRANSPARENT CHARGES</h3>
              <p className="text-sm text-[#9CA3AF] font-light">100% visibility on making charges and GST.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 aurous-glass rounded-2xl group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-[#B76E79] drop-shadow-[0_0_8px_rgba(183,110,121,0.5)]">
                <Gem className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-[#D4AF37] mb-2 tracking-wide">ELITE CRAFTSMANSHIP</h3>
              <p className="text-sm text-[#9CA3AF] font-light">Showcasing the pinnacle of jewelry design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Shops Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#D4AF37]/20 pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white mb-2 aurous-silver-text">ELITE TIER SHOPS</h2>
              <p className="text-[#9CA3AF] font-light">Discover the most prestigious jewelers in your area.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
               <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                 <ChevronRight className="w-5 h-5 rotate-180" />
               </button>
               <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                 <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dummy Shop Tickets - Aurous Style */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="aurous-glass rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500">
                <div className="h-56 bg-[#0A0A0A] relative overflow-hidden p-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10"></div>
                  {/* Mock Image Placeholder */}
                  <div className="w-full h-full border border-[#D4AF37]/10 rounded-xl bg-[#1A1A1A] flex items-center justify-center relative z-0">
                     <Gem className="w-12 h-12 text-[#D4AF37]/20" strokeWidth={1} />
                  </div>
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                      Elite Tier
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col bg-[#111111]/80 border-t border-[#D4AF37]/10">
                  <h3 className="text-xl font-[family-name:var(--font-display)] text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {i === 1 ? "PREMIUM JEWELS" : i === 2 ? "ELITE PRECIOUS" : "EMPRESS GOLD"}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center text-sm text-[#9CA3AF] font-light">
                       <MapPin className="w-4 h-4 mr-1 text-[#D4AF37]" />
                       Mumbai, India
                     </div>
                     <div className="flex items-center gap-1 text-[#D4AF37] text-sm">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                        <span>4.9</span>
                     </div>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#D4AF37]/10">
                    <div className="text-xs text-[#9CA3AF] font-light">
                       22K Rate: <span className="text-[#E2E8F0] font-normal tracking-wide">₹7,250/g</span>
                    </div>
                    <Link href={`/shop/demo-${i}`} className="px-4 py-1.5 border border-[#D4AF37]/40 text-[#D4AF37] text-sm rounded-full hover:bg-[#D4AF37]/10 transition-colors font-light tracking-wide">
                      Visit Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </main>
  );
}
