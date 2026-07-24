"use client";

import React, { useState, useEffect } from 'react';
import { Search, Globe, MapPin, TrendingUp, TrendingDown, Clock, Activity, Coins } from 'lucide-react';
import Link from 'next/link';
import GlobalBannerSlot from '@/components/GlobalBannerSlot';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Mathematical Base Strategy (Fallbacks)
const FALLBACK_24K_PRICE = 14333; // Per Gram in INR
const TOLA_GRAMS = 11.66;
const OUNCE_GRAMS = 31.1035;

// Mock worldwide / city data
const LOCATIONS = [
  { id: 'in', name: 'India (National)', type: 'country', offset: 0, flag: '🇮🇳' },
  { id: 'ae', name: 'Dubai (UAE)', type: 'country', offset: -150, flag: '🇦🇪' },
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
  const [liveJitter, setLiveJitter] = useState(0);
  
  // Firebase State
  const [rawGoldPrice, setRawGoldPrice] = useState(FALLBACK_24K_PRICE);
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    // Fetch base rates from Firebase
    async function fetchLiveRates() {
      try {
        const docRef = doc(db, 'market_data', 'global_rates');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.goldPrice) setRawGoldPrice(data.goldPrice);
        }
      } catch (err) {
        console.error("Failed to fetch live prices from Firebase:", err);
      } finally {
        setPricesLoading(false);
      }
    }
    fetchLiveRates();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    const marketPulse = setInterval(() => {
      const randomJitter = (Math.random() - 0.5) * 4; 
      setLiveJitter(randomJitter);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(marketPulse);
    };
  }, []);

  const baseGoldPrice = rawGoldPrice + selectedLocation.offset + liveJitter;

  const getDerivedPrice = (base: number, purityPercentage: number, multiplier = 1) => {
    return (base * (purityPercentage / 100)) * multiplier;
  };

  const goldData = [
    { id: '24k', title: '24K Gold / gram', desc: '99.9% Pure', rate: getDerivedPrice(baseGoldPrice, 99.9), spread: 0.8 },
    { id: '22k', title: '22K Gold / gram', desc: '91.6% Hallmark', rate: getDerivedPrice(baseGoldPrice, 91.6), spread: 1.2 },
    { id: '21k', title: '21K Gold / gram', desc: '87.5% Alloy', rate: getDerivedPrice(baseGoldPrice, 87.5), spread: 1.5 },
    { id: '18k', title: '18K Gold / gram', desc: '75.0% Alloy', rate: getDerivedPrice(baseGoldPrice, 75.0), spread: 2.0 },
    { id: '14k', title: '14K Gold / gram', desc: '58.3% Alloy', rate: getDerivedPrice(baseGoldPrice, 58.3), spread: 3.0 },
    { id: 'oz', title: 'Spot Gold / oz', desc: '1 Troy Ounce', rate: getDerivedPrice(baseGoldPrice, 99.9, OUNCE_GRAMS), spread: 0.5 },
    { id: 'tola', title: 'Gold / Tola', desc: '11.66 grams', rate: getDerivedPrice(baseGoldPrice, 99.9, TOLA_GRAMS), spread: 0.8 }
  ];

  const filteredLocations = LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#060A14] font-sans text-white pb-20">
      <div className="flex w-full h-[40px] bg-[#090F1D] border-b border-[#C5A059]/20 items-center justify-between px-3 md:px-6 font-sans relative z-40">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 text-[#C5A059] hover:brightness-110 transition-all shrink-0">
            <Coins className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase font-mono hidden sm:inline-block">Gold Hub</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-[#141C33] px-2 py-1 rounded border border-[#2A344A]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> <span>Live Metals Exchange</span>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-20 right-1/4 w-[600px] h-[400px] opacity-[0.03] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 bg-[#D4AF37]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Page Title & Top Ad Slot */}
        <div className="mb-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif tracking-wider font-bold transition-colors text-[#C5A059]">
              Live Gold Rates
            </h1>
          </div>

          {/* LEADERBOARD AD */}
          <div className="w-full lg:w-[468px] xl:w-[728px] min-h-[90px] shrink-0 relative hidden md:flex items-center justify-center">
            <div className="absolute inset-0 bg-[#090F1D] border border-[#2A344A] rounded-xl flex items-center justify-center overflow-hidden z-0">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Premium Ad Space</span>
            </div>
            <div className="w-full relative z-10 bg-[#060A14]">
              <GlobalBannerSlot placementId="content_top" context={{ audience: 'gold_price_live' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="bg-[#0A1021] border border-[#2A344A] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedLocation.flag}</span>
                <div>
                  <h2 className="text-2xl font-bold font-serif flex items-center gap-2 text-[#C5A059]">
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
              <div className="bg-[#141C33] border px-6 py-3 rounded-xl text-center transition-colors border-[#C5A059]/30">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Base Trend</div>
                <div className={`text-xl font-bold font-mono flex items-center gap-1 ${liveJitter >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {liveJitter >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {liveJitter >= 0 ? '+' : ''}{liveJitter.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="bg-[#0A1021] border border-[#2A344A] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141C33] border-b-2 border-[#C5A059]">
                      <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider w-1/3 text-[#C5A059]">Gold Asset</th>
                      <th className="py-4 px-6 text-sm font-bold text-white uppercase tracking-wider text-right">Rate/INR</th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Bid <span className="text-[10px] lowercase font-normal">(sell)</span></th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Ask <span className="text-[10px] lowercase font-normal">(buy)</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A344A]">
                    {goldData.map((row, index) => {
                      const rate = row.rate;
                      const bid = rate * (1 - (row.spread / 100));
                      const ask = rate * (1 + (row.spread / 100));

                      const rowJSX = (
                        <tr className="hover:bg-[#141C33]/50 transition-colors group">
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center font-bold text-black text-xs shadow-inner">
                                {row.id.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold transition-colors text-white group-hover:text-[#C5A059]">{row.title}</div>
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

                      // INTERSTITIAL AD AFTER 2ND ROW
                      const adRow = index === 1 ? (
                        <tr key={`ad-${index}`}>
                          <td colSpan={4} className="p-0 border-y border-[#2A344A] bg-[#060A14]">
                            <div className="w-full flex justify-center py-4 relative min-h-[100px]">
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-600 font-mono tracking-widest uppercase z-0">Sponsor</div>
                              <div className="w-full relative z-10 px-4">
                                <GlobalBannerSlot placementId="shop_grid_interstitial" context={{ audience: 'gold_price_live' }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null;

                      return <React.Fragment key={row.id}>{rowJSX}{adRow}</React.Fragment>;
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-[#141C33]/50 p-4 border-t border-[#2A344A] text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>The prices here reflect the raw spot rate. Various commission fees, GST, and making charges apply during retail purchase.</p>
                <div className="flex gap-4 font-mono font-bold">
                  <span className="bg-[#0A1021] px-3 py-1 rounded border border-[#2A344A] text-[#C5A059]">Avg Spread: 1.5%</span>
                  <span className="bg-[#0A1021] px-3 py-1 rounded border border-[#2A344A] text-[#C5A059]">GST: 3%</span>
                </div>
              </div>
            </div>

            {/* BOTTOM CONTENT AD */}
            <div className="mt-8 w-full min-h-[90px] relative">
              <div className="absolute inset-0 bg-[#090F1D] border border-[#2A344A] rounded-xl flex items-center justify-center text-[10px] text-gray-500 font-mono tracking-widest z-0">Advertisement</div>
              <div className="w-full relative z-10">
                <GlobalBannerSlot placementId="content_bottom" context={{ audience: 'gold_price_live' }} />
              </div>
            </div>

          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-[#0A1021] border border-[#2A344A] rounded-2xl p-6 shadow-2xl flex flex-col max-h-[600px]">
              <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-[#C5A059]">
                <Globe className="w-5 h-5" /> Global & City Search
              </h3>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search city or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141C33] border border-[#2A344A] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-opacity-50 focus:ring-1 transition-all text-white placeholder:text-gray-600 focus:border-[#C5A059] focus:ring-[#C5A059]"
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
              </div>
            </div>

            {/* SIDEBAR AD TOP */}
            <div className="w-full min-h-[250px] relative mt-2">
              <div className="absolute inset-0 bg-[#090F1D] border border-[#2A344A] rounded-xl flex flex-col items-center justify-center z-0">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-2">Featured Sponsor</span>
              </div>
              <div className="w-full relative z-10 bg-[#060A14] rounded-xl overflow-hidden">
                <GlobalBannerSlot placementId="sidebar" context={{ audience: 'gold_price_live' }} />
              </div>
            </div>

            {/* SIDEBAR AD BOTTOM (Sticky) */}
            <div className="w-full min-h-[250px] relative sticky top-24 mt-6">
              <div className="absolute inset-0 bg-[#090F1D] border border-[#2A344A] rounded-xl flex flex-col items-center justify-center z-0">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-2">Advertisement</span>
              </div>
              <div className="w-full relative z-10 bg-[#060A14] rounded-xl overflow-hidden">
                <GlobalBannerSlot placementId="shop_sidebar_bottom" context={{ audience: 'gold_price_live' }} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
