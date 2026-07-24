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
  { id: 'uk', name: 'United Kingdom', type: 'country', offset: 50, flag: '🇬🇧' },
  { id: 'ca', name: 'Canada', type: 'country', offset: 15, flag: '🇨🇦' },
  { id: 'jp', name: 'Japan', type: 'country', offset: -80, flag: '🇯🇵' },
  { id: 'cn', name: 'China', type: 'country', offset: 5, flag: '🇨🇳' },
];

const INDIAN_CITIES = [
  { id: 'mum', name: 'Mumbai', offset: 0, flag: '🇮🇳' },
  { id: 'del', name: 'Delhi', offset: -5, flag: '🇮🇳' },
  { id: 'che', name: 'Chennai', offset: 120, flag: '🇮🇳' },
  { id: 'kol', name: 'Kolkata', offset: 15, flag: '🇮🇳' },
  { id: 'blr', name: 'Bangalore', offset: 80, flag: '🇮🇳' },
  { id: 'hyd', name: 'Hyderabad', offset: 90, flag: '🇮🇳' },
  { id: 'ahm', name: 'Ahmedabad', offset: -10, flag: '🇮🇳' },
  { id: 'pun', name: 'Pune', offset: -5, flag: '🇮🇳' },
  { id: 'jai', name: 'Jaipur', offset: -15, flag: '🇮🇳' },
  { id: 'ker', name: 'Kerala', offset: 150, flag: '🇮🇳' },
  { id: 'odi', name: 'Odisha', offset: 30, flag: '🇮🇳' },
];

export default function LiveRatesPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
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
    <main className="min-h-screen bg-[#11050A] font-sans text-white pb-20 pt-6 md:pt-10 relative overflow-hidden">
      {/* LUXURY BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dark crimson gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C050B] via-[#0D0205] to-[#250711]" />
        {/* Glow Orbs behind the glass */}
        <div className="absolute top-[-5%] left-[15%] w-[800px] h-[800px] bg-[#E3B061]/5 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[5%] w-[700px] h-[700px] bg-indigo-900/10 blur-[150px] rounded-full mix-blend-screen" />
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

        {/* 1. GLOBAL MARKETS SELECTOR (SCROLLING ROW) */}
        <div className="mb-8 md:mb-10 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
              <Globe className="text-[#E3B061] w-4 h-4" /> 
              Global Markets
            </h3>
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Swipe to view</span>
          </div>
          
          <div className="flex overflow-x-auto pb-4 gap-3 md:gap-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {LOCATIONS.map((loc, index) => {
              const isSelected = selectedLocation.id === loc.id;
              
              return (
                <button 
                  key={`${loc.id}-${index}`}
                  onClick={() => handleLocationChange(loc)}
                  className={`snap-center shrink-0 w-[110px] md:w-[130px] text-left rounded-xl p-3 transition-all duration-300 border backdrop-blur-xl group hover:-translate-y-1 ${isSelected ? 'bg-white/10 border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(227,176,97,0.2)] scale-105 z-10' : 'bg-white/5 border-white/10 border-b-transparent border-r-transparent hover:bg-white/10'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl md:text-2xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">{loc.flag}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E3B061] shadow-[0_0_10px_#E3B061] animate-pulse" />
                    )}
                  </div>
                  <h4 className={`font-bold font-serif truncate transition-colors text-xs md:text-sm ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {loc.name}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. TRUE GLASSMORPHISM HERO BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* HERO BENTO (Col-Span-12 or 8) */}
          <div className={`md:col-span-12 lg:col-span-8 bg-white/5 backdrop-blur-2xl border border-white/20 border-b-white/5 border-r-white/5 rounded-[2rem] p-6 md:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isChanging ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}`}>
            
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent opacity-30 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-center text-4xl md:text-5xl shadow-inner backdrop-blur-md">
                  {selectedLocation.flag}
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold font-serif text-white tracking-wide drop-shadow-md">
                    {selectedLocation.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold font-mono tracking-widest flex items-center gap-1 animate-pulse">
                      <Activity className="w-3 h-3" /> LIVE TRADING
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Session Trend</span>
                <div className={`text-xl md:text-2xl font-bold font-mono flex items-center gap-1 bg-black/20 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md shadow-inner ${liveJitter >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {liveJitter >= 0 ? <TrendingUp className="w-5 h-5 md:w-6 md:h-6" /> : <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />}
                  {liveJitter >= 0 ? '+' : ''}{liveJitter.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 24K BIG */}
              <div className="bg-black/20 border border-white/20 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-2xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#E3B061]/20 blur-2xl rounded-full group-hover:bg-[#E3B061]/30 transition-all" />
                <div className="text-sm text-[#E3B061] font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                  <span>24K Gold</span>
                  <span className="text-[10px] bg-[#E3B061]/20 px-2 py-0.5 rounded text-[#E3B061] border border-[#E3B061]/20">99.9%</span>
                </div>
                <div className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tight drop-shadow-md">
                  ₹{goldData['24k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-lg text-white/40 font-normal">/g</span>
                </div>
              </div>

              {/* 22K */}
              <div className="bg-black/20 border border-white/10 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors">
                <div className="text-sm text-white/80 font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                  <span>22K Gold</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 border border-white/10">91.6%</span>
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight drop-shadow-md">
                  ₹{goldData['22k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-base text-white/40 font-normal">/g</span>
                </div>
              </div>

              {/* 18K */}
              <div className="bg-black/20 border border-white/10 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors">
                <div className="text-sm text-white/80 font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                  <span>18K Gold</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 border border-white/10">75.0%</span>
                </div>
                <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight drop-shadow-md">
                  ₹{goldData['18k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-base text-white/40 font-normal">/g</span>
                </div>
              </div>
            </div>
          </div>

          {/* AD BENTO (Col-Span-12 or 4) */}
          <div className="md:col-span-6 lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
             <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-[10px] text-white/10 uppercase tracking-widest font-mono">Sponsor</span>
             </div>
             <div className="w-full h-full relative z-10 flex items-center justify-center">
               <GlobalBannerSlot placementId="shop_grid_interstitial" context={{ audience: 'gold_price_live' }} />
             </div>
          </div>

          {/* SECONDARY BENTOS */}
          <div className="md:col-span-6 lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 flex flex-col justify-between group hover:bg-white/10 transition-all">
            <div>
              <div className="w-12 h-12 bg-white/10 border border-white/5 shadow-inner rounded-xl flex items-center justify-center mb-4">
                <span className="text-white/80 font-bold">OZ</span>
              </div>
              <h3 className="text-white/80 font-bold tracking-widest uppercase text-sm mb-1">{goldData['oz'].title}</h3>
              <p className="text-xs text-white/40 font-mono mb-4">{goldData['oz'].desc}</p>
            </div>
            <div className="text-3xl font-mono font-bold text-white drop-shadow-md">
              ₹{goldData['oz'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 flex flex-col justify-between group hover:bg-white/10 transition-all">
            <div>
              <div className="w-12 h-12 bg-white/10 border border-white/5 shadow-inner rounded-xl flex items-center justify-center mb-4">
                <span className="text-white/80 font-bold">14K</span>
              </div>
              <h3 className="text-white/80 font-bold tracking-widest uppercase text-sm mb-1">{goldData['14k'].title}</h3>
              <p className="text-xs text-white/40 font-mono mb-4">{goldData['14k'].desc}</p>
            </div>
            <div className="text-3xl font-mono font-bold text-white drop-shadow-md">
              ₹{goldData['14k'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-lg text-white/40 font-normal">/g</span>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 flex flex-col justify-between group hover:bg-white/10 transition-all">
            <div>
              <div className="w-12 h-12 bg-white/10 border border-white/5 shadow-inner rounded-xl flex items-center justify-center mb-4">
                <span className="text-white/80 font-bold">TOLA</span>
              </div>
              <h3 className="text-white/80 font-bold tracking-widest uppercase text-sm mb-1">{goldData['tola'].title}</h3>
              <p className="text-xs text-white/40 font-mono mb-4">{goldData['tola'].desc}</p>
            </div>
            <div className="text-3xl font-mono font-bold text-white drop-shadow-md">
              ₹{goldData['tola'].rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>

        </div>

        {/* 3. INDIAN CITIES (VERTICAL ROWS WITH ADS) */}
        <div className="mt-16 md:mt-24 relative z-10">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white flex items-center gap-3">
              <MapPin className="text-[#E3B061] w-6 h-6 md:w-8 md:h-8" />
              Indian Metro Rates
            </h2>
            <span className="text-xs text-white/40 uppercase tracking-widest font-mono hidden md:block">Real-time local tracking</span>
          </div>

          <div className="flex flex-col gap-4">
            {INDIAN_CITIES.map((city, index) => {
              const localBaseRate = rawGoldPrice + city.offset + liveJitter;
              const local24k = getDerivedPrice(localBaseRate, 99.9);
              const local22k = getDerivedPrice(localBaseRate, 91.6);
              const local18k = getDerivedPrice(localBaseRate, 75.0);

              // Inject Ad every 4 items
              const showAd = (index > 0 && index % 4 === 0);

              return (
                <React.Fragment key={city.id}>
                  {showAd && (
                    <div className="w-full h-[90px] relative bg-white/5 backdrop-blur-xl border border-white/10 border-b-transparent border-r-transparent rounded-2xl overflow-hidden flex items-center justify-center my-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)]">
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                        <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Sponsor</span>
                      </div>
                      <div className="w-full relative z-10">
                        <GlobalBannerSlot placementId="homepage_middle" context={{ audience: 'gold_price_live' }} />
                      </div>
                    </div>
                  )}

                  <div className="w-full bg-white/5 backdrop-blur-xl border border-white/20 border-b-transparent border-r-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.3)] rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/10 transition-all group">
                    {/* Left: City Name */}
                    <div className="flex items-center gap-4 w-full lg:w-[30%]">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-black/30 rounded-xl flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-white/10 backdrop-blur-md">
                        {city.flag}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-[#E3B061] transition-colors drop-shadow-md">{city.name}</h3>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">Local Market Live</div>
                      </div>
                    </div>

                    {/* Right: Prices */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 w-full lg:w-[70%]">
                      {/* 24K */}
                      <div className="bg-black/30 border border-[#E3B061]/30 rounded-xl p-3 md:p-4 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-[#E3B061]/50 transition-colors shadow-inner">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-[#E3B061]/10 blur-xl rounded-full" />
                        <span className="text-[10px] md:text-xs text-[#E3B061] font-bold tracking-widest uppercase mb-1">24K Rate</span>
                        <span className="text-sm md:text-xl font-mono font-bold text-white drop-shadow-sm">₹{local24k.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-[10px] md:text-xs text-white/40 font-normal ml-1">/g</span></span>
                      </div>
                      
                      {/* 22K */}
                      <div className="bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 flex flex-col justify-center items-center shadow-inner group-hover:border-white/20 transition-colors">
                        <span className="text-[10px] md:text-xs text-white/60 font-bold tracking-widest uppercase mb-1">22K Rate</span>
                        <span className="text-sm md:text-xl font-mono font-bold text-white drop-shadow-sm">₹{local22k.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-[10px] md:text-xs text-white/40 font-normal ml-1">/g</span></span>
                      </div>

                      {/* 18K */}
                      <div className="bg-black/30 border border-white/10 rounded-xl p-3 md:p-4 flex flex-col justify-center items-center shadow-inner group-hover:border-white/20 transition-colors">
                        <span className="text-[10px] md:text-xs text-white/60 font-bold tracking-widest uppercase mb-1">18K Rate</span>
                        <span className="text-sm md:text-xl font-mono font-bold text-white drop-shadow-sm">₹{local18k.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<span className="text-[10px] md:text-xs text-white/40 font-normal ml-1">/g</span></span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
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
