"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Star, ShieldCheck, Gem, ChevronDown, ChevronUp } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalBannerSlot from "@/components/GlobalBannerSlot";

import { Shop, Product } from '@/types/gold-hub';
import { getProxiedImageUrl } from '@/lib/image-proxy';
import PremiumPageHero from "@/components/PremiumPageHero";

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
  const [pageLayout, setPageLayout] = useState<any>(null);
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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
        
        // Only fetch layout if on root global directory
        if (initialCountry === 'global') {
          const { getPageLayout } = await import("@/lib/firestore/layouts");
          const layout = await getPageLayout("DIRECTORY");
          setPageLayout(layout);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, [initialCountry]);

  const formatLocation = (loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1);

  const breadcrumbItems = [
    { label: "Global", href: "/directory" },
    ...(initialCountry !== 'global' ? [{ label: formatLocation(initialCountry), href: `/directory/${initialCountry}` }] : []),
    ...(initialState ? [{ label: formatLocation(initialState), href: `/directory/${initialCountry}/${initialState}` }] : []),
    ...(initialDistrict ? [{ label: formatLocation(initialDistrict), href: `/directory/${initialCountry}/${initialState}/${initialDistrict}` }] : []),
    ...(initialBlock ? [{ label: formatLocation(initialBlock) }] : [])
  ];

  const getHeading = () => {
    if (initialBlock) return `Gold Jewelers in ${formatLocation(initialBlock)}`;
    if (initialDistrict) return `Gold Jewelers in ${formatLocation(initialDistrict)}`;
    if (initialState) return `Top Gold Jewelers in ${formatLocation(initialState)}`;
    if (initialCountry !== 'global') return `Verified Gold Jewelers - ${formatLocation(initialCountry)}`;
    return "Global Gold Jewelers Directory";
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

  // Grouping Logic
  const groupedShops = filteredShops.reduce((acc, shop) => {
    const state = shop.location?.state || 'Other';
    const district = shop.location?.district || 'Other';
    const groupKey = `${state}|${district}`;
    
    if (!acc[groupKey]) {
      acc[groupKey] = { state, district, shops: [] };
    }
    acc[groupKey].shops.push(shop);
    return acc;
  }, {} as Record<string, { state: string, district: string, shops: Shop[] }>);

  // Sorting: Odisha first, then alphabetical state, then alphabetical district
  const sortedGroups = Object.values(groupedShops).sort((a, b) => {
    const isOdishaA = a.state.toLowerCase() === 'odisha';
    const isOdishaB = b.state.toLowerCase() === 'odisha';
    
    if (isOdishaA && !isOdishaB) return -1;
    if (!isOdishaA && isOdishaB) return 1;
    
    if (a.state !== b.state) return a.state.localeCompare(b.state);
    return a.district.localeCompare(b.district);
  });

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };


  return (
    <main className="min-h-screen bg-[#060A14] text-[#E2E8F0] font-sans pb-20 relative">
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <PremiumPageHero 
        title={getHeading()}
        imagePath="/stock/directory-hero-pc.png"
        mobileImagePath="/stock/directory-hero-phone.png"
        uppercaseTitle={false}
        imageAlignment="right"
        overlayStyle="text-side"
      >
        <div className="flex flex-col gap-4">
          <Breadcrumbs items={breadcrumbItems} className="mb-2 w-full justify-center md:justify-start" />
          <p className="text-lg md:text-xl font-light">
            Browse our curated list of hallmarked, transparent, and trusted jewelry stores.
          </p>
        </div>
      </PremiumPageHero>

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 flex flex-col md:flex-row gap-8 relative z-10">
        
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
            
            {/* Sidebar Ad Injection */}
            <div className="mt-8">
              <GlobalBannerSlot placementId="global_sidebar_right" context={{ audience: 'shops' }} glass />
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

          <div className="flex flex-col gap-12">
            {loading ? (
              <div className="py-20 text-center text-gray-500 font-light flex flex-col items-center gap-4">
                 <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                 Loading Directory...
              </div>
            ) : sortedGroups.length === 0 ? (
              <div className="py-20 text-center text-gray-500 font-light">
                No jewelers found matching your criteria.
              </div>
            ) : (
              sortedGroups.map((group) => {
                const groupKey = `${group.state}|${group.district}`;
                const isExpanded = expandedGroups[groupKey];
                
                // Show up to 10 shops initially (2 rows on large screens), then all if expanded
                const displayShops = isExpanded ? group.shops : group.shops.slice(0, 10);
                const hasMore = group.shops.length > 10;

                return (
                  <div key={groupKey} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
                      <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-white tracking-wide">
                        {group.state} <span className="text-[#D4AF37] mx-2">|</span> <span className="text-gray-400">{group.district}</span>
                      </h2>
                      <span className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/20">
                        {group.shops.length} Shops
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-8">
                      {displayShops.map((shop, idx) => (
                        <div key={shop.id} className="relative group cursor-pointer flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 block">
                          
                          {/* Invisible Full Card Link for reliable clicking (Fixes mobile double-tap issues) */}
                          <Link href={`/gold-shop/${shop.id}`} className="absolute inset-0 z-[100] rounded-[2.5rem]">
                            <span className="sr-only">View {shop.name}</span>
                          </Link>
                          
                          {/* Top Layer: Image */}
                          <div className="h-56 relative rounded-[1.5rem] overflow-hidden z-10 shadow-lg border-2 border-[#C0C0C0]">
                            
                            {/* Real Image Integration */}
                            <div className="w-full h-full bg-[#1A1A1A] relative z-0">
                               <img 
                                 src={getProxiedImageUrl(shop.coverImages?.[0], idx % 2 === 0 ? "/images/showrooms.png" : "/images/products-grid.png")} 
                                 alt={shop.name} 
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                 style={{ objectPosition: 'center' }} 
                               />
                            </div>

                            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                              {shop.subscriptionTier === 'ELITE' && (
                                <span className="px-3 py-1 bg-gradient-to-r from-black via-gray-900 to-black border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                  <Star className="w-3 h-3 fill-[#D4AF37]" /> Elite
                                </span>
                              )}
                              {shop.isVerified && (
                                <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-md border border-green-500">
                                  <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Bottom Layer: 3D Gold Info Card (Oval Box) */}
                          <div className="block flex flex-col flex-1 justify-between bg-gradient-to-b from-[#E5C158] via-[#D4AF37] to-[#996515] p-5 pt-8 -mt-6 rounded-[2.5rem] shadow-[inset_0_2px_15px_rgba(255,255,255,0.6),inset_0_-2px_10px_rgba(0,0,0,0.3),0_15px_25px_rgba(0,0,0,0.5)] border-2 border-[#FFF8E7]/60 relative z-0 hover:brightness-110 transition-all">
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-[#060A14] leading-tight line-clamp-2 font-serif transition-colors drop-shadow-sm mb-2 uppercase tracking-wider">
                                {shop.name}
                              </h3>
                              <p className="text-xs text-[#060A14]/80 mb-4 font-medium line-clamp-2">{shop.description || 'Premium traditional jewelry.'}</p>
                              
                              <div className="flex items-center text-xs text-[#060A14]/90 mb-4 truncate font-bold">
                                <MapPin className="w-3 h-3 mr-1 text-[#060A14]" />
                                {shop.location?.district || "India"}, {shop.location?.state || ""}
                              </div>
                            </div>
                            
                            <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#060A14]/15">
                              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#060A14]/70">
                                <span>Status:</span>
                                <span className="text-[#060A14]">Active</span>
                              </div>
                              <div className="w-full py-2.5 bg-[#060A14] text-[#D4AF37] font-bold text-center text-xs rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] group-hover:bg-black transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                                Visit Shop
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <div className="flex justify-center mt-4">
                        <button 
                          onClick={() => toggleGroup(groupKey)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          {isExpanded ? (
                            <>Collapse <ChevronUp className="w-4 h-4" /></>
                          ) : (
                            <>Show All {group.shops.length} Shops <ChevronDown className="w-4 h-4" /></>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
