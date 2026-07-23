"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Star, ShieldCheck, Gem } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

import { Shop } from "@/types/gold-hub";

import { getShops } from "@/lib/firestore/shops";

export default function ClientDirectory({ 
  initialCountry = 'global', 
  initialState = '', 
  initialDistrict = '',
  initialBlock = ''
}: { 
  initialCountry?: string, 
  initialState?: string, 
  initialDistrict?: string,
  initialBlock?: string
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterElite, setFilterElite] = useState(false);
  const [filterBoutique, setFilterBoutique] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterGold, setFilterGold] = useState(false);
  const [filterPlatinum, setFilterPlatinum] = useState(false);

  // Get query params if we came from homepage search
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q');
      if (q) setSearchQuery(q);
    }
  }, []);

  useEffect(() => {
    async function fetchShops() {
      try {
        const fetchedShops = await getShops(); // Fetch ALL shops (verified and unverified)
        setShops(fetchedShops || []);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  const formatLocation = (loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1);

  const breadcrumbItems = [
    { label: "Global", href: "/directory" },
    ...(initialCountry !== 'global' ? [{ label: formatLocation(initialCountry), href: `/directory/${initialCountry}` }] : []),
    ...(initialState ? [{ label: formatLocation(initialState), href: `/directory/${initialCountry}/${initialState}` }] : []),
    ...(initialDistrict ? [{ label: formatLocation(initialDistrict), href: `/directory/${initialCountry}/${initialState}/${initialDistrict}` }] : []),
    ...(initialBlock ? [{ label: formatLocation(initialBlock) }] : [])
  ];

  const getHeading = () => {
    if (initialBlock) return `${formatLocation(initialBlock)} JEWELERS`;
    if (initialDistrict) return `JEWELERS IN ${formatLocation(initialDistrict)}`;
    if (initialState) return `TOP JEWELERS IN ${formatLocation(initialState)}`;
    if (initialCountry !== 'global') return `VERIFIED JEWELERS - ${formatLocation(initialCountry)}`;
    return "GLOBAL JEWELERS DIRECTORY";
  };

  const filteredShops = shops.filter(shop => {
    let matches = true;
    
    // Search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const shopName = shop.name?.toLowerCase() || '';
      const shopDesc = shop.description?.toLowerCase() || '';
      const shopLocation = shop.address?.toLowerCase() || '';
      const shopDistrict = shop.location?.district?.toLowerCase() || '';
      const shopCity = shop.location?.city?.toLowerCase() || '';
      const shopBlock = shop.location?.block?.toLowerCase() || '';

      if (!shopName.includes(q) && !shopDesc.includes(q) && !shopLocation.includes(q) && !shopDistrict.includes(q) && !shopCity.includes(q) && !shopBlock.includes(q)) {
        matches = false;
      }
    }

    // Location match
    if (initialCountry !== 'global' && initialCountry) {
      if (shop.location?.country?.toLowerCase() !== initialCountry.toLowerCase()) matches = false;
    }
    if (initialState) {
      if (shop.location?.state?.toLowerCase() !== initialState.toLowerCase()) matches = false;
    }
    if (initialDistrict) {
      if (shop.location?.district?.toLowerCase() !== initialDistrict.toLowerCase()) matches = false;
    }
    if (initialBlock) {
      if (shop.location?.block?.toLowerCase() !== initialBlock.toLowerCase()) matches = false;
    }

    // Sidebar Filters
    if (filterElite || filterBoutique) {
      const isElite = shop.subscriptionTier === 'ELITE';
      const isBoutique = shop.subscriptionTier === 'PRO' || shop.subscriptionTier === 'BASIC';
      
      // If Elite is checked but shop is not elite, and boutique is not checked -> fail
      // If Boutique is checked but shop is not boutique, and elite is not checked -> fail
      // Basically, if either is checked, it must match one of the checked tiers.
      if (!((filterElite && isElite) || (filterBoutique && isBoutique))) {
        matches = false;
      }
    }
    
    if (filterVerified) {
      if (!shop.isVerified) matches = false;
    }
    
    if (filterGold || filterPlatinum) {
      // Assuming 'shop.specialties' is an array of strings like '24K Gold', 'Platinum', etc.
      // If shop has no specialties defined, we might filter it out, or we could keep it. Let's filter it out.
      const hasGold = shop.specialties?.some(s => s.toLowerCase().includes('gold'));
      const hasPlatinum = shop.specialties?.some(s => s.toLowerCase().includes('platinum') || s.toLowerCase().includes('diamond'));
      
      if (!((filterGold && hasGold) || (filterPlatinum && hasPlatinum))) {
        matches = false;
      }
    }

    return matches;
  });

  return (
    <main className="min-h-screen bg-[#060A14] text-[#E2E8F0] font-sans pb-20 relative">
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Directory Header */}
      <div className="border-b border-[#D4AF37]/20 pt-12 pb-16 relative z-10 bg-[#0A1021]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] text-white mb-4 uppercase tracking-widest aurous-silver-text">
            {getHeading()}
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl text-lg font-light">
            Browse our curated list of hallmarked, transparent, and trusted jewelry stores.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="aurous-glass rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-[family-name:var(--font-display)] text-white mb-6 flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3 tracking-wider">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              FILTERS
            </h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">By Tier</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" checked={filterElite} onChange={(e) => setFilterElite(e.target.checked)} className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    Premium Elite
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" checked={filterBoutique} onChange={(e) => setFilterBoutique(e.target.checked)} className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    Gold Boutiques
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Verification</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)} className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    HUID Certified
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Metal Type</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" checked={filterGold} onChange={(e) => setFilterGold(e.target.checked)} className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    24K / 22K Gold
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#E2E8F0] cursor-pointer group hover:text-white transition-colors">
                    <input type="checkbox" checked={filterPlatinum} onChange={(e) => setFilterPlatinum(e.target.checked)} className="rounded border-[#D4AF37]/30 bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0 transition-all" />
                    Platinum / Diamonds
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Directory Grid */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="aurous-glass rounded-xl p-2 flex items-center mb-8 relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent rounded-xl opacity-30 z-[-1]"></div>
            <Search className="w-5 h-5 text-[#D4AF37] ml-4" />
            <input 
              type="text" 
              placeholder="Find specific jewelers..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-[#9CA3AF] px-4 py-3 font-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center text-gray-500 font-light flex flex-col items-center gap-4">
                 <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                 Loading Directory...
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-500 font-light">
                No jewelers found matching your criteria.
              </div>
            ) : (
              filteredShops.map((shop, idx) => (
                <div key={shop.id} className="aurous-glass rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500">
                  <div className="h-48 bg-[#0A1021] relative overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] to-transparent z-10"></div>
                    
                    {/* Real Image Integration */}
                    <div className="w-full h-full border border-[#D4AF37]/10 rounded-xl bg-[#1A1A1A] overflow-hidden relative z-0">
                       <img 
                         src={shop.coverImages?.[0] || (idx % 2 === 0 ? "/images/showrooms.png" : "/images/products-grid.png")} 
                         alt={shop.name} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         style={{ objectPosition: 'center' }} 
                       />
                    </div>

                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      {shop.subscriptionTier === 'ELITE' ? (
                        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                          <Star className="w-3 h-3 fill-[#D4AF37]" /> Elite
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#E2E8F0]/40 text-[#E2E8F0] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col bg-[#060A14]/80 border-t border-[#D4AF37]/10">
                    <h3 className="text-lg font-[family-name:var(--font-display)] text-white mb-1 group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider truncate">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mb-4 font-light line-clamp-2">{shop.description || 'Premium traditional jewelry.'}</p>
                    
                    <div className="flex items-center text-xs text-[#9CA3AF] mb-6 truncate">
                      <MapPin className="w-3 h-3 mr-1 text-[#D4AF37]" />
                      {shop.location?.district || "India"}, {shop.location?.state || ""}
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#D4AF37]/10">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#9CA3AF] font-light">Status:</span>
                        <span className="font-normal text-[#E2E8F0] tracking-wide">Active</span>
                      </div>
                      <Link href={`/shop/${shop.id}`} className="w-full py-2.5 border border-[#D4AF37]/40 text-[#D4AF37] font-light text-center text-sm rounded-full hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-wider">
                        Visit Shop
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
