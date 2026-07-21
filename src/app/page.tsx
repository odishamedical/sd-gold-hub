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
      <section className="relative pt-32 pb-16 z-10 flex flex-col items-center justify-center min-h-[55vh]">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <img src="/images/hero-bg.png" alt="Luxury Gold Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-black/60"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full mt-8">

          {/* Search Capsule matching Mockup */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-[#E2E8F0]/20 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border-2 border-white/30 rounded-[2rem] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] group-hover:border-white/50 transition-colors">
              <input 
                type="text" 
                placeholder="Find Trusted Gold Jewelers in [Your City]" 
                className="flex-1 bg-transparent border-none outline-none text-white px-6 placeholder-gray-300 font-light text-lg tracking-wide"
              />
              <button className="p-3 mr-2 rounded-full text-white transition-all flex items-center justify-center">
                <Search className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Geo Chips matching Mockup */}
          <div className="flex justify-center gap-4 mt-6">
            {['Mumbai', 'Delhi', 'Bangalore'].map((city, idx) => (
              <button key={city} className={`px-6 py-1.5 rounded-[2rem] border text-sm font-light tracking-wide backdrop-blur-md transition-all ${idx === 0 ? 'border-[#D4AF37] text-[#FDE047] shadow-[0_0_15px_rgba(212,175,55,0.4)] bg-black/40' : 'border-white/30 text-white bg-black/20 hover:border-white/60'}`}>
                {city}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Luxury Trust Banner */}
      <section className="relative z-10 py-8 border-y border-white/5 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-3xl rounded-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10">
            
            {/* Banner Item 1 */}
            <div className="flex-1 flex items-center p-6 md:p-8 md:border-r border-white/10 hover:bg-white/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-white tracking-wide mb-1">Verified HUID</h3>
                <p className="text-xs text-gray-300 font-light">Certified authenticity for every piece.</p>
              </div>
            </div>
            
            {/* Banner Item 2 */}
            <div className="flex-1 flex items-center p-6 md:p-8 md:border-r border-white/10 hover:bg-white/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
                <Percent className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[#FDE047] tracking-wide mb-1">Transparent Making Charges</h3>
                <p className="text-xs text-gray-300 font-light">Upfront pricing, no hidden fees.</p>
              </div>
            </div>
            
            {/* Banner Item 3 */}
            <div className="flex-1 flex items-center p-6 md:p-8 hover:bg-white/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#DDA7A5] drop-shadow-[0_0_8px_rgba(221,167,165,0.8)]">
                <Star className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-white tracking-wide mb-1">Platinum Diamond White Texts</h3>
                <p className="text-xs text-gray-300 font-light">Luxury aesthetics in every interaction.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Elite Shops Section */}
      <section className="relative z-10 py-16 bg-gradient-to-b from-[#111111] to-[#0A0A0A]">
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
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden group cursor-pointer relative border border-[#D4AF37]/30 hover:border-[#D4AF37]/80 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                
                {/* Corner Ribbon */}
                <div className="absolute top-0 right-0 w-[100px] h-[100px] overflow-hidden z-30">
                  <div className="absolute top-[20px] -right-[28px] w-[140px] transform rotate-45 bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#D4AF37] text-black text-center py-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.6)]">
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none drop-shadow-sm">Elite Tier</span>
                  </div>
                </div>

                <div className="p-5 pt-6">
                  <h3 className="text-xl font-[family-name:var(--font-display)] text-[#FDE047] mb-1">
                    {i === 1 ? "Premium Jewels" : i === 2 ? "Elite Precious" : "Empress Gold"}
                  </h3>
                  <p className="text-gray-400 text-xs font-light mb-4">Specialists in fine gold jewelry</p>
                  
                  <div className="flex gap-4">
                    {/* Left: Image */}
                    <div className="w-[110px] h-[110px] flex-shrink-0 rounded-lg overflow-hidden border border-[#D4AF37]/20 relative shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                       <img 
                         src={i === 1 ? "/images/showrooms.png" : "/images/products-grid.png"} 
                         alt="Luxury Gold Item" 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         style={{ objectPosition: i === 1 ? 'center top' : i === 2 ? 'left center' : 'right bottom' }} 
                       />
                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    
                    {/* Right: Transparent Price Breakdown */}
                    <div className="flex-1 bg-black/40 rounded-lg p-3 border border-white/5">
                      <h4 className="text-[10px] text-white tracking-wide mb-2 uppercase border-b border-white/10 pb-1">Transparent Price Breakdown</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-light">Weight</span>
                          <span className="text-white font-medium">₹{i === 1 ? '45,000' : i === 2 ? '25,000' : '3,00,000'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-light">GST (3%):</span>
                          <span className="text-white">₹9,750</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-light">Making Charges</span>
                          <span className="text-white">₹25,000</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-white/10 mt-1">
                          <span className="text-white font-medium">Total Price:</span>
                          <span className="text-[#FDE047] font-bold">₹3,34,750</span>
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
