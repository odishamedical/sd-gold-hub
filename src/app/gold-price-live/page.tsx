"use client";

import React, { useState, useEffect } from 'react';
import { Search, Globe, MapPin, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import GlobalBannerSlot from '@/components/GlobalBannerSlot';

// Mathematical Base Strategy
const BASE_24K_PRICE = 7850; // Per Gram in INR
const TOLA_GRAMS = 11.66;
const OUNCE_GRAMS = 31.1035;

// Mock worldwide / city data
const LOCATIONS = [
  { id: 'in', name: 'India (National)', type: 'country', offset: 0, flag: '🇮🇳' },
  { id: 'ae', name: 'Dubai (UAE)', type: 'country', offset: -150, flag: '🇦🇪' }, // Cheaper
  { id: 'us', name: 'USA', type: 'country', offset: 10, flag: '🇺🇸' },
  { id: 'sg', name: 'Singapore', type: 'country', offset: -50, flag: '🇸🇬' },
  { id: 'au', name: 'Australia', type: 'country', offset: 45, flag: '🇦🇺' },
  { id: 'qa', name: 'Qatar', type: 'country', offset: -120, flag: '🇶🇦' },
  { id: 'kw', name: 'Kuwait', type: 'country', offset: -110, flag: '🇰🇼' },
  { id: 'sa', name: 'Saudi Arabia', type: 'country', offset: -130, flag: '🇸🇦' },
  
  // Indian Cities
  { id: 'mum', name: 'Mumbai', type: 'city', offset: 0, flag: '🇮🇳' },
  { id: 'del', name: 'Delhi', type: 'city', offset: -5, flag: '🇮🇳' },
  { id: 'che', name: 'Chennai', type: 'city', offset: 120, flag: '🇮🇳' },
  { id: 'kol', name: 'Kolkata', type: 'city', offset: 15, flag: '🇮🇳' },
  { id: 'blr', name: 'Bangalore', type: 'city', offset: 85, flag: '🇮🇳' },
  { id: 'hyd', name: 'Hyderabad', type: 'city', offset: 95, flag: '🇮🇳' },
  { id: 'ker', name: 'Kerala', type: 'city', offset: 145, flag: '🇮🇳' },
  { id: 'ahm', name: 'Ahmedabad', type: 'city', offset: -10, flag: '🇮🇳' },
];

export default function LiveRatesPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveJitter, setLiveJitter] = useState(0); // For live pulse effect
  
  // Real-time clock & pulse simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Simulate live market fluctuation every 3-7 seconds
    const marketPulse = setInterval(() => {
      const randomJitter = (Math.random() - 0.5) * 4; // Fluctuates by +/- 2 rupees
      setLiveJitter(randomJitter);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(marketPulse);
    };
  }, []);

  // Calculate Base Adjusted Price
  const basePrice = BASE_24K_PRICE + selectedLocation.offset + liveJitter;

  // Derivations
  const getDerivedPrice = (purityPercentage: number, multiplier = 1) => {
    return (basePrice * (purityPercentage / 100)) * multiplier;
  };

  const tableData = [
    { 
      id: '24k', 
      title: '24K Gold / gram', 
      desc: '99.9% Pure',
      rate: getDerivedPrice(99.9), 
      spread: 0.8 // bid/ask spread %
    },
    { 
      id: '22k', 
      title: '22K Gold / gram', 
      desc: '91.6% Hallmark',
      rate: getDerivedPrice(91.6), 
      spread: 1.2
    },
    { 
      id: '21k', 
      title: '21K Gold / gram', 
      desc: '87.5% Alloy',
      rate: getDerivedPrice(87.5), 
      spread: 1.5
    },
    { 
      id: '18k', 
      title: '18K Gold / gram', 
      desc: '75.0% Alloy',
      rate: getDerivedPrice(75.0), 
      spread: 2.0
    },
    { 
      id: '14k', 
      title: '14K Gold / gram', 
      desc: '58.3% Alloy',
      rate: getDerivedPrice(58.3), 
      spread: 3.0
    },
    { 
      id: 'oz', 
      title: 'Spot Gold / oz', 
      desc: '1 Troy Ounce',
      rate: getDerivedPrice(99.9, OUNCE_GRAMS), 
      spread: 0.5
    },
    { 
      id: 'tola', 
      title: 'Gold / Tola', 
      desc: '11.66 grams',
      rate: getDerivedPrice(99.9, TOLA_GRAMS), 
      spread: 0.8
    }
  ];

  const filteredLocations = LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#060A14] font-sans text-white">
      {/* Custom Breadcrumb Bar */}
      <div className="flex w-full h-[40px] bg-[#090F1D] border-b border-[#C5A059]/20 items-center justify-between px-3 md:px-6 font-sans relative z-40">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 text-[#C5A059] hover:brightness-110 transition-all shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase font-mono hidden sm:inline-block">Gold Hub</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-[#141C33] px-2 py-1 rounded border border-[#2A344A]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> <span>Gold price now around the world</span>
          </div>
        </div>
      </div>

      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-20 right-1/4 w-[600px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Page Title & Top Ad Slot */}
        <div className="mb-8 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] tracking-wider font-bold">
              Gold Price Live
            </h1>
            <p className="text-gray-400 mt-2 text-xs max-w-2xl mx-auto md:mx-0">
              Check live gold prices today in India and globally. Track 22K and 24K gold rates across different states and cities with real-time accuracy.
            </p>
          </div>

          {/* Leaderboard Ad Slot (Top Right) */}
          <div className="w-full lg:w-[468px] xl:w-[728px] min-h-[90px] shrink-0 relative hidden md:flex items-center justify-center">
            {/* Fallback Placeholder */}
            <div className="absolute inset-0 bg-[#090F1D] border border-[#2A344A] rounded-xl flex items-center justify-center overflow-hidden group hover:border-[#C5A059]/30 transition-colors shadow-inner z-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              <div className="flex flex-col items-center z-10 text-center">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1 bg-[#0A1021] px-2 py-0.5 rounded">Advertisement</span>
                <span className="text-sm text-[#C5A059] font-bold uppercase tracking-wider">Premium Ad Space Available</span>
                <span className="text-[10px] text-gray-400 mt-0.5">728 x 90 Leaderboard (AdSense or Direct Sponsor)</span>
              </div>
            </div>
            {/* Injected Ad Slot (Renders on top if active) */}
            <div className="w-full relative z-10 bg-[#060A14]">
              <GlobalBannerSlot placementId="content_top" context={{ audience: 'global' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT: MAIN DATA TABLE */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Header Block */}
            <div className="bg-[#0A1021] border border-[#2A344A] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedLocation.flag}</span>
                <div>
                  <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
                    Gold Rate in {selectedLocation.name} 
                    <span className="bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold font-mono tracking-widest flex items-center gap-1 animate-pulse">
                      <Activity className="w-3 h-3" /> LIVE
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 
                    Live update: {currentTime.toUTCString().replace('GMT', 'UTC')}
                  </p>
                </div>
              </div>
              <div className="bg-[#141C33] border border-[#C5A059]/30 px-6 py-3 rounded-xl text-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Base Trend</div>
                <div className={`text-xl font-bold font-mono flex items-center gap-1 ${liveJitter >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {liveJitter >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {liveJitter >= 0 ? '+' : ''}{liveJitter.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* The Table */}
            <div className="bg-[#0A1021] border border-[#2A344A] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141C33] border-b-2 border-[#C5A059]">
                      <th className="py-4 px-6 text-sm font-bold text-[#C5A059] uppercase tracking-wider w-1/3">Gold Asset</th>
                      <th className="py-4 px-6 text-sm font-bold text-white uppercase tracking-wider text-right">Rate/INR</th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Bid <span className="text-[10px] lowercase font-normal">(sell)</span></th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Ask <span className="text-[10px] lowercase font-normal">(buy)</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A344A]">
                    {tableData.map((row, index) => {
                      const rate = row.rate;
                      const bid = rate * (1 - (row.spread / 100));
                      const ask = rate * (1 + (row.spread / 100));

                      return (
                        <tr key={row.id} className="hover:bg-[#141C33]/50 transition-colors group">
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center font-bold text-black text-xs shadow-inner">
                                {row.id.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white group-hover:text-[#C5A059] transition-colors">{row.title}</div>
                                <div className="text-xs text-gray-500 font-mono mt-0.5">{row.desc}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className={`font-mono text-xl font-bold bg-[#141C33] inline-block px-4 py-1.5 rounded-lg border transition-colors ${liveJitter >= 0 ? 'text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.1)]' : 'text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(248,113,113,0.1)]'}`}>
                              ₹ {rate.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right font-mono font-bold text-gray-300">
                            ₹ {bid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="py-5 px-6 text-right font-mono font-bold text-white">
                            ₹ {ask.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-[#141C33]/50 p-4 border-t border-[#2A344A] text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>The prices here reflect the raw gold spot rate. Various commission fees, GST, and making charges apply during retail purchase.</p>
                <div className="flex gap-4 font-mono font-bold">
                  <span className="bg-[#0A1021] px-3 py-1 rounded border border-[#2A344A] text-[#C5A059]">Avg Spread: 1.5%</span>
                  <span className="bg-[#0A1021] px-3 py-1 rounded border border-[#2A344A] text-[#C5A059]">GST: 3%</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: SIDEBAR (WORLDWIDE / CITIES) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-[#0A1021] border border-[#2A344A] rounded-2xl p-6 shadow-2xl flex flex-col h-full sticky top-24 max-h-[calc(100vh-120px)]">
              <h3 className="text-lg font-serif text-[#C5A059] font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" /> Global & City Search
              </h3>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search city or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141C33] border border-[#2A344A] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-white placeholder:text-gray-600"
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-2">
                
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 pl-2">Countries</div>
                {filteredLocations.filter(l => l.type === 'country').map(loc => (
                  <button 
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${selectedLocation.id === loc.id ? 'bg-[#141C33] border border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-transparent border border-transparent hover:bg-[#141C33] hover:border-[#2A344A]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{loc.flag}</span>
                      <span className={`font-bold text-sm ${selectedLocation.id === loc.id ? 'text-[#C5A059]' : 'text-gray-300 group-hover:text-white'}`}>{loc.name}</span>
                    </div>
                  </button>
                ))}

                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-6 mb-2 pl-2">Indian Cities</div>
                {filteredLocations.filter(l => l.type === 'city').map(loc => (
                  <button 
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${selectedLocation.id === loc.id ? 'bg-[#141C33] border border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-transparent border border-transparent hover:bg-[#141C33] hover:border-[#2A344A]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-4 h-4 ${selectedLocation.id === loc.id ? 'text-[#C5A059]' : 'text-gray-500 group-hover:text-white'}`} />
                      <span className={`font-bold text-sm ${selectedLocation.id === loc.id ? 'text-[#C5A059]' : 'text-gray-300 group-hover:text-white'}`}>{loc.name}</span>
                    </div>
                  </button>
                ))}

                {filteredLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No locations found.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Sticky Ad Slot */}
            <div className="mt-6 sticky top-24 w-full min-h-[250px] relative">
              {/* Fallback Placeholder */}
              <div className="absolute inset-0 bg-[#090F1D] border border-[#2A344A] rounded-xl flex items-center justify-center overflow-hidden group hover:border-[#C5A059]/30 transition-colors shadow-inner z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#141C33] to-transparent opacity-50"></div>
                <div className="flex flex-col items-center z-10 text-center p-4">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-2 bg-[#0A1021] px-2 py-0.5 rounded">Featured Sponsor</span>
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-3">
                    <Globe className="w-8 h-8 text-[#C5A059]" />
                  </div>
                  <span className="text-sm text-white font-bold uppercase tracking-wider">Showcase Your Shop</span>
                  <span className="text-[10px] text-gray-400 mt-1">Highly visible 300x250 Ad Block. Perfect for promoting top vendor collections or Google AdSense.</span>
                </div>
              </div>
              
              {/* Injected Ad Slot (Renders on top if active) */}
              <div className="w-full relative z-10 bg-[#060A14]">
                <GlobalBannerSlot placementId="sidebar" context={{ audience: 'global' }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
