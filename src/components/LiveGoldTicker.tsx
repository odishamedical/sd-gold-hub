"use client";

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity } from 'lucide-react';
import Link from 'next/link';

const FALLBACK_24K_PRICE = 14333; // Per Gram in INR

export default function LiveGoldTicker() {
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

  return (
    <Link href="/gold-price-live" className="flex items-center gap-2 md:gap-4 bg-[#141C33]/80 border border-[#2A344A] px-3 py-1.5 rounded-lg hover:border-[#C5A059] transition-all group shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold hidden sm:block">Live Spot</span>
        <Activity className="w-3 h-3 text-red-500 hidden sm:block" />
      </div>
      
      <div className="h-3 w-px bg-[#2A344A] hidden sm:block"></div>
      
      <div className="flex gap-3 text-xs font-mono font-bold">
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-[10px]">24K:</span>
          <span className="text-[#C5A059] group-hover:text-yellow-400 transition-colors">
            {loading ? "..." : `₹${price24k.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-[10px]">22K:</span>
          <span className="text-white">
            {loading ? "..." : `₹${price22k.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
