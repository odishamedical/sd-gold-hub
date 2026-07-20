"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ClaimListingPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{placeId: string, name: string, address: string}[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  
  // Claim Form State
  const [isClaiming, setIsClaiming] = useState(false);
  const [phone, setPhone] = useState("");
  const [claimSuccess, setClaimSuccess] = useState(false);

  const searchPlaces = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    
    // Simulate Google Places Autocomplete API call
    setTimeout(() => {
      setResults([
        { placeId: "ChIJ1", name: query, address: "Main Market, Bhubaneswar, Odisha" },
        { placeId: "ChIJ2", name: `${query} Jewellers`, address: "Cuttack Road, Cuttack, Odisha" },
        { placeId: "ChIJ3", name: `${query} Gold & Diamonds`, address: "Bargarh, Odisha" },
      ]);
      setIsSearching(false);
    }, 800);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsClaiming(true);
    
    // Simulate Firebase Auth & Claim Write
    setTimeout(() => {
      setIsClaiming(false);
      setClaimSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A1021] text-white font-sans selection:bg-[#C5A059]/30">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#C5A059] mb-4">Claim Your Gold Shop</h1>
          <p className="text-slate-400">Search the Google Places database to claim ownership of your business listing on the SD Gold Hub directory.</p>
        </div>

        {!selectedPlace ? (
          <div className="bg-[#0E1528] rounded-2xl p-8 border border-[#2A344A] shadow-xl relative overflow-hidden">
             {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

            <form onSubmit={searchPlaces} className="relative z-10 flex gap-4">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for your shop name..."
                className="flex-1 bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>

            {results.length > 0 && (
              <div className="mt-8 space-y-4 relative z-10">
                <p className="text-sm text-[#C5A059] uppercase tracking-widest font-bold mb-4">Select your business</p>
                {results.map((place) => (
                  <div key={place.placeId} className="flex items-center justify-between p-4 rounded-xl bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059]/50 transition-colors cursor-pointer" onClick={() => setSelectedPlace(place)}>
                    <div>
                      <h3 className="text-lg font-bold text-white">{place.name}</h3>
                      <p className="text-sm text-slate-400">{place.address}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                      →
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !claimSuccess ? (
          <div className="bg-[#0E1528] rounded-2xl p-8 border border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1)] relative overflow-hidden">
            <button onClick={() => setSelectedPlace(null)} className="text-sm text-slate-400 hover:text-white mb-6">← Back to search</button>
            
            <div className="mb-8 pb-6 border-b border-[#2A344A]">
              <h2 className="text-2xl font-bold text-white">{selectedPlace.name}</h2>
              <p className="text-[#C5A059]">{selectedPlace.address}</p>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Verify Phone Number</label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter shop owner mobile number"
                  className="w-full bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors"
                />
                <p className="text-xs text-slate-500 mt-2">We will send an OTP to this number to verify your ownership.</p>
              </div>
              
              <button 
                type="submit"
                disabled={isClaiming}
                className="w-full bg-[#C5A059] text-[#0A1021] hover:bg-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(197,160,89,0.4)]"
              >
                {isClaiming ? "Verifying..." : "Verify & Claim Listing"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#0E1528] rounded-2xl p-12 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500 text-green-500 text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">Listing Claimed!</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">You have successfully verified ownership of <strong>{selectedPlace.name}</strong>. You can now access your dashboard to upload jewelry inventory.</p>
            
            <Link href="/vendor" className="inline-block bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] font-bold px-8 py-4 rounded-xl transition-all">
              Go to Vendor Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
