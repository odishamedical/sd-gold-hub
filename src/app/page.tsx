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
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <img src="/images/hero-bg.png" alt="Luxury Gold Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111] opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-[#111111] opacity-70"></div>
        </div>

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
      <section className="relative z-10 py-10 border-y border-[#D4AF37]/10 bg-gradient-to-r from-[#111111]/90 via-[#1A1A1A]/90 to-[#111111]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aurous-glass rounded-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-[#D4AF37]/20">
            
            {/* Banner Item 1 */}
            <div className="flex-1 flex items-center p-6 md:p-8 md:border-r border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#E2E8F0] group-hover:text-white transition-colors">
                <ShieldCheck className="w-12 h-12" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[#E2E8F0] tracking-wide mb-1 group-hover:text-white">Verified HUID</h3>
                <p className="text-xs text-[#9CA3AF] font-light">Certified authenticity for every piece.</p>
              </div>
            </div>
            
            {/* Banner Item 2 */}
            <div className="flex-1 flex items-center p-6 md:p-8 md:border-r border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#D4AF37] group-hover:text-[#FDE047] transition-colors">
                <Percent className="w-12 h-12" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[#D4AF37] tracking-wide mb-1 group-hover:text-[#FDE047]">Transparent Making Charges</h3>
                <p className="text-xs text-[#9CA3AF] font-light">Upfront pricing, no hidden fees.</p>
              </div>
            </div>
            
            {/* Banner Item 3 */}
            <div className="flex-1 flex items-center p-6 md:p-8 hover:bg-[#D4AF37]/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#B76E79] group-hover:text-[#DDA7A5] transition-colors">
                <Star className="w-12 h-12" strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[#E2E8F0] tracking-wide mb-1 group-hover:text-white">Platinum Diamond White Texts</h3>
                <p className="text-xs text-[#9CA3AF] font-light">Luxury aesthetics in every interaction.</p>
              </div>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dummy Shop Tickets - Aurous Style Map from Image-1 */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="aurous-glass rounded-xl overflow-hidden group cursor-pointer relative border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#1A1A1A]/90 to-[#0A0A0A]/90">
                
                {/* Corner Ribbon */}
                <div className="absolute -right-[40px] top-[25px] w-[150px] transform rotate-45 bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#D4AF37] text-black text-center py-1 z-30 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Elite Tier</span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-[family-name:var(--font-display)] text-[#D4AF37] mb-1">
                    {i === 1 ? "Premium Jewels" : i === 2 ? "Elite Precious" : "Empress Gold"}
                  </h3>
                  <p className="text-[#9CA3AF] text-xs font-light mb-4">Specialists in fine gold jewelry</p>
                  
                  <div className="flex gap-4">
                    {/* Left: Image */}
                    <div className="w-[120px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden border border-[#D4AF37]/10 relative">
                       <img 
                         src={i === 1 ? "/images/showrooms.png" : "/images/products-grid.png"} 
                         alt="Luxury Gold Item" 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         style={{ objectPosition: i === 1 ? 'center top' : i === 2 ? 'left center' : 'right bottom' }} 
                       />
                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    
                    {/* Right: Transparent Price Breakdown */}
                    <div className="flex-1 bg-[#111111] rounded-lg p-3 border border-[#D4AF37]/10">
                      <h4 className="text-[10px] text-[#E2E8F0] tracking-wide mb-2 uppercase border-b border-[#D4AF37]/10 pb-1">Transparent Price Breakdown</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#9CA3AF] font-light">Weight</span>
                          <span className="text-[#D4AF37] font-medium">₹{i === 1 ? '45,000' : i === 2 ? '25,000' : '3,00,000'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#9CA3AF] font-light">GST (3%):</span>
                          <span className="text-[#E2E8F0]">₹9,750</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#9CA3AF] font-light">Making Charges</span>
                          <span className="text-[#E2E8F0]">₹25,000</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#D4AF37]/10 mt-1">
                          <span className="text-white font-medium">Total Price:</span>
                          <span className="text-[#D4AF37] font-bold">₹3,34,750</span>
                        </div>
                      </div>
                    </div>
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
