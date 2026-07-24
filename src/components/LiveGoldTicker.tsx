"use client";

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity } from 'lucide-react';
import Link from 'next/link';

const FALLBACK_24K_PRICE = 14333; // Per Gram in INR

export default function LiveGoldTicker({ layoutSize = 'auto' }: { layoutSize?: string }) {
  const [rawGoldPrice, setRawGoldPrice] = useState(FALLBACK_24K_PRICE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveRate() {
      try {
        const docRef = doc(db, 'market_data', 'global_rates');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().goldPrice) {
          setRawGoldPrice(docSnap.data().goldPrice);
        }
      } catch (err) {
        console.error("Ticker failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveRate();
  }, []);

  const price24k = rawGoldPrice;
  const price22k = rawGoldPrice * 0.916;

  // Formatting helper
  const formatPrice = (p: number) => loading ? "..." : `₹${p.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  if (layoutSize === "full") {
    // Widescreen / Horizontal Banner Layout
    return (
      <Link href="/gold-price-live" className="flex w-full items-center justify-between gap-4 bg-[#141C33]/80 border border-[#2A344A] px-6 py-4 rounded-xl hover:border-[#C5A059] transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059] opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <div>
            <div className="text-sm text-gray-300 uppercase tracking-widest font-black flex items-center gap-1.5">
              Live Spot <Activity className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">Real-time Global Exchange Rates</div>
          </div>
        </div>
        
        <div className="flex gap-8 text-sm font-mono font-bold">
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">24K Pure Gold</span>
            <span className="text-[#C5A059] group-hover:text-yellow-400 transition-colors text-lg">
              {formatPrice(price24k)}
            </span>
          </div>
          <div className="w-px bg-[#2A344A] h-10"></div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">22K Hallmark</span>
            <span className="text-white text-lg">
              {formatPrice(price22k)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Square / Tall / Default Layout
  return (
    <Link href="/gold-price-live" className="flex flex-col w-full h-full justify-center gap-4 bg-[#141C33]/80 border border-[#2A344A] p-6 rounded-2xl hover:border-[#C5A059] transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059] opacity-5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between border-b border-[#2A344A] pb-4">
        <div className="text-xs text-gray-300 uppercase tracking-widest font-black flex items-center gap-1.5">
           Spot Price
        </div>
        <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 font-mono font-bold">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-wider">24K / gram</span>
          <span className="text-[#C5A059] group-hover:text-yellow-400 transition-colors text-xl">
            {formatPrice(price24k)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-wider">22K / gram</span>
          <span className="text-white text-xl">
            {formatPrice(price22k)}
          </span>
        </div>
      </div>
    </Link>
  );
}
