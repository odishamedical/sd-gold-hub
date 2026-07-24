"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Globe, MapPin, TrendingUp, TrendingDown, Clock, Activity, Coins, ChevronRight } from 'lucide-react';
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
  { id: 'np', name: 'Nepal', type: 'country', offset: -10, flag: '🇳🇵' },
  { id: 'bt', name: 'Bhutan', type: 'country', offset: 25, flag: '🇧🇹' },
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
];

export default function LiveRatesPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveJitter, setLiveJitter] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  
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

  const handleLocationChange = (loc: typeof LOCATIONS[0]) => {
    if (loc.id === selectedLocation.id) return;
    setIsChanging(true);
    setTimeout(() => {
      setSelectedLocation(loc);
      setIsChanging(false);
    }, 300); // Animation duration
  };

  const baseGoldPrice = rawGoldPrice + selectedLocation.offset + liveJitter;

  const getDerivedPrice = (base: number, purityPercentage: number, multiplier = 1) => {
    return (base * (purityPercentage / 100)) * multiplier;
  };

  const goldData = useMemo(() => {
    return {
      '24k': { title: '24K Gold', desc: '99.9% Pure', rate: getDerivedPrice(baseGoldPrice, 99.9) },
      '22k': { title: '22K Gold', desc: '91.6% Hallmark', rate: getDerivedPrice(baseGoldPrice, 91.6) },
      '21k': { title: '21K Gold', desc: '87.5% Alloy', rate: getDerivedPrice(baseGoldPrice, 87.5) },
      '18k': { title: '18K Gold', desc: '75.0% Alloy', rate: getDerivedPrice(baseGoldPrice, 75.0) },
      '14k': { title: '14K Gold', desc: '58.3% Alloy', rate: getDerivedPrice(baseGoldPrice, 58.3) },
      'oz': { title: 'Spot Gold / oz', desc: '1 Troy Ounce', rate: getDerivedPrice(baseGoldPrice, 99.9, OUNCE_GRAMS) },
      'tola': { title: 'Gold / Tola', desc: '11.66 grams', rate: getDerivedPrice(baseGoldPrice, 99.9, TOLA_GRAMS) }
    };
  }, [baseGoldPrice]);

  return (
    <main className="min-h-screen bg-[#11050A] font-sans text-white pb-20 relative overflow-hidden">
      {/* GLOBAL HEADER (Minimal) */}
      <div className="flex w-full h-[50px] bg-[#000000]/40 backdrop-blur-md border-b border-[#E3B061]/20 items-center justify-between px-4 md:px-6 relative z-50">
        <Link href="/" className="flex items-center gap-2 text-[#E3B061] hover:text-white transition-all shrink-0">
          <Coins className="w-5 h-5" />
          <span className="text-xs font-black tracking-[0.2em] uppercase font-mono">Gold Hub</span>
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-bold text-red-200 uppercase tracking-widest bg-red-950/50 px-3 py-1.5 rounded-full border border-red-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> <span>Live Metals Exchange</span>
        </div>
      </div>

      {/* LUXURY BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dark crimson gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C050B] via-[#0D0205] to-[#250711]" />
        {/* Glow Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#E3B061]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(227, 176, 97, 1) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* HEADER AREA */}
        <div className="mb-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-serif tracking-wide font-bold bg-gradient-to-r from-[#FFF5D1] via-[#E3B061] to-[#C58B39] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(227,176,97,0.2)]">
              Live Global Rates
            </h1>
            <p className="text-sm md:text-base text-rose-200/60 mt-2 font-mono flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4" /> 
              {currentTime.toUTCString().replace('GMT', 'UTC')}
            </p>
          </div>

          {/* LEADERBOARD AD */}
          <div className="w-full lg:w-[728px] h-[90px] shrink-0 relative hidden md:flex items-center justify-center bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Premium Sponsor</span>
            </div>
            <div className="w-full relative z-10">
              <GlobalBannerSlot placementId="content_top" context={{ audience: 'gold_price_live' }} />
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* 1. HERO BENTO (Col-Span-12 or 8) */}
          <div className={`md:col-span-12 lg:col-span-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isChanging ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}`}>
            
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-4xl md:text-5xl shadow-inner backdrop-blur-md">
                  {selectedLocation.flag}
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold font-serif text-white tracking-wide">
                    {selectedLocation.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold font-mono tracking-widest flex items-center gap-1 animate-pulse">
                      <Activity className="w-3 h-3" /> LIVE TRADING
                    </span>
                    <span className="text-xs text-rose-200/50 font-mono">
                      Market Open
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-rose-200/60 uppercase tracking-widest font-bold mb-1">Session Trend</span>
                <div className={`text-xl md:text-2xl font-bold font-mono flex items-center gap-1 bg-black/20 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md ${liveJitter >= 0 ? 'text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)]' : 'text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.1)]'}`}>
                  {liveJitter >= 0 ? <TrendingUp className="w-5 h-5 md:w-6 md:h-6" /> : <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />}
                  {liveJitter >= 0 ? '+' : ''}{liveJitter.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 24K BIG */}
              <div className="bg-black/40 border border-[#E3B061]/30 rounded-2xl p-6 relative overflow-hidden group hover:border-[#E3B061] transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#E3B061]/20 blur-2xl rounded-full group-hover:bg-[#E3B061]/40 transition-all" />
                <div className="text-sm text-[#E3B061] font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                  <span>24K Gold</span>
                  <span className="text-[10px] bg-[#E3B061]/20 px-2 py-0.5 rounded text-[#E3B061]">99.9%</span>
                </div>
                <div className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tight">
                  ₹{goldData['24k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-lg text-white/40 font-normal">/g</span>
                </div>
              </div>

              {/* 22K */}
              <div className="bg-black/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/30 transition-colors">
                <div className="text-sm text-rose-100 font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                  <span>22K Gold</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">91.6%</span>
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
                  ₹{goldData['22k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-base text-white/40 font-normal">/g</span>
                </div>
              </div>

              {/* 18K */}
              <div className="bg-black/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/30 transition-colors">
                <div className="text-sm text-rose-100 font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                  <span>18K Gold</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">75.0%</span>
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
                  ₹{goldData['18k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-base text-white/40 font-normal">/g</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AD BENTO (Col-Span-12 or 4) */}
          <div className="md:col-span-6 lg:col-span-4 bg-gradient-to-b from-[#2A0812]/80 to-black/80 backdrop-blur-xl border border-red-900/30 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
             <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-[10px] text-white/10 uppercase tracking-widest font-mono">Sponsor</span>
             </div>
             <div className="w-full h-full relative z-10 flex items-center justify-center">
               <GlobalBannerSlot placementId="shop_grid_interstitial" context={{ audience: 'gold_price_live' }} />
             </div>
          </div>

          {/* 3. SECONDARY BENTOS */}
          <div className="md:col-span-6 lg:col-span-4 bg-gradient-to-br from-indigo-900/40 to-black/60 backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
            <div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-indigo-300 font-bold">OZ</span>
              </div>
              <h3 className="text-indigo-200 font-bold tracking-widest uppercase text-sm mb-1">{goldData['oz'].title}</h3>
              <p className="text-xs text-indigo-200/50 font-mono mb-4">{goldData['oz'].desc}</p>
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              ₹{goldData['oz'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-4 bg-gradient-to-br from-emerald-900/40 to-black/60 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-emerald-300 font-bold">14K</span>
              </div>
              <h3 className="text-emerald-200 font-bold tracking-widest uppercase text-sm mb-1">{goldData['14k'].title}</h3>
              <p className="text-xs text-emerald-200/50 font-mono mb-4">{goldData['14k'].desc}</p>
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              ₹{goldData['14k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-lg text-white/40 font-normal">/g</span>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-4 bg-gradient-to-br from-amber-900/40 to-black/60 backdrop-blur-xl border border-amber-500/20 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between group hover:border-amber-500/40 transition-all">
            <div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-amber-300 font-bold">TOLA</span>
              </div>
              <h3 className="text-amber-200 font-bold tracking-widest uppercase text-sm mb-1">{goldData['tola'].title}</h3>
              <p className="text-xs text-amber-200/50 font-mono mb-4">{goldData['tola'].desc}</p>
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              ₹{goldData['tola'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>

        </div>

        {/* 4. GLOBAL MARKETS SELECTOR (SCROLLING ROW) */}
        <div className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-3">
              <Globe className="text-[#E3B061] w-6 h-6" /> 
              Global Markets
            </h3>
            <span className="text-xs text-white/40 uppercase tracking-widest font-mono hidden md:block">Tap to view local rates</span>
          </div>
          
          <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {LOCATIONS.map((loc, index) => {
              const isSelected = selectedLocation.id === loc.id;
              const localBaseRate = rawGoldPrice + loc.offset + liveJitter;
              const local24k = getDerivedPrice(localBaseRate, 99.9);
              
              // Dynamic colors for variety
              const tints = [
                'from-rose-500/20 to-transparent hover:border-rose-400/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
                'from-blue-500/20 to-transparent hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
                'from-emerald-500/20 to-transparent hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
                'from-amber-500/20 to-transparent hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
                'from-purple-500/20 to-transparent hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              ];
              const tint = tints[index % tints.length];
              
              return (
                <button 
                  key={loc.id}
                  onClick={() => handleLocationChange(loc)}
                  className={`snap-center shrink-0 w-[160px] md:w-[200px] text-left rounded-2xl p-4 md:p-5 transition-all duration-500 border backdrop-blur-md bg-gradient-to-b group hover:-translate-y-2 ${isSelected ? 'bg-white/10 border-[#E3B061]/80 shadow-[0_0_30px_rgba(227,176,97,0.2)] scale-105 z-10' : `bg-black/30 border-white/5 ${tint}`}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl md:text-4xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">{loc.flag}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#E3B061] shadow-[0_0_10px_#E3B061] animate-pulse" />
                    )}
                  </div>
                  <h4 className={`font-bold font-serif mb-1 truncate transition-colors ${isSelected ? 'text-white' : 'text-rose-100 group-hover:text-white'}`}>
                    {loc.name}
                  </h4>
                  <div className="font-mono font-bold text-[#E3B061] text-sm md:text-base">
                    ₹{local24k.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase mt-1">24K Rate</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CONTENT AD */}
        <div className="mt-8 md:mt-12 w-full h-[90px] relative bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hidden md:flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Advertisement</span>
          </div>
          <div className="w-full relative z-10">
            <GlobalBannerSlot placementId="content_bottom" context={{ audience: 'gold_price_live' }} />
          </div>
        </div>

      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
