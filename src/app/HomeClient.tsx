"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShieldCheck, Gem, Percent, ChevronRight, Star } from "lucide-react";
import { Shop, Product } from "@/types/gold-hub";
import ProductCard from "@/components/ProductCard";
import GlobalBannerSlot from "@/components/GlobalBannerSlot";
import { getRecentProducts } from "@/lib/firestore/products";
import { getShops } from "@/lib/firestore/shops";

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, shops] = await Promise.all([
          getRecentProducts(20),
          getShops(true)
        ]);
        setRecentProducts(products || []);
        setFeaturedShops(shops || []);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you might pass this as a query param or to a search route
      router.push(`/directory?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/directory`);
    }
  };

  const geoChips = [
    { label: "ODISHA", href: "/directory/india/odisha" },
    { label: "DELHI", href: "/directory/india/delhi" },
    { label: "MUMBAI", href: "/directory/india/maharashtra/mumbai" },
    { label: "KOLKATA", href: "/directory/india/west-bengal/kolkata" },
    { label: "CHENNAI", href: "/directory/india/tamil-nadu/chennai" },
    { label: "DUBAI", href: "/directory/uae/dubai" },
  ];

  // Group products by category for different rows
  const neckJewellery = recentProducts.filter(p => p.categoryId?.toLowerCase().includes("neck"));
  const handJewellery = recentProducts.filter(p => p.categoryId?.toLowerCase().includes("hand") || p.subcategoryId?.toLowerCase().includes("bangle"));
  
  // If no specific category found, just slice
  const row1Products = neckJewellery.length > 0 ? neckJewellery : recentProducts.slice(0, 4);
  const row2Products = handJewellery.length > 0 ? handJewellery : recentProducts.slice(4, 8);

  // Sort and slice shops based on featured status
  const topShops = featuredShops.slice(0, 3);
  const regionalShops = featuredShops.length > 3 ? featuredShops.slice(3, 6) : featuredShops.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#060A14] text-white font-sans overflow-hidden">
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Luxury Hero Section */}
      <section className="relative pt-32 pb-16 z-10 flex flex-col items-center justify-center min-h-[55vh]">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          {/* Desktop Image */}
          <img src="/stock/home-hero-pc.png" alt="Luxury Bridal Gold" className="hidden md:block w-full h-full object-cover object-left" />
          {/* Mobile Image */}
          <img src="/stock/home-hero-phone.png" alt="Luxury Bridal Gold" className="block md:hidden w-full h-full object-cover object-top" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-black/30 to-black/70"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-end mt-8">
          <div className="w-full max-w-2xl text-center md:text-right">
            {/* Hero Text */}
            <div className="mb-8 flex flex-col items-center md:items-end">
              <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#DDA7A5] via-[#E5C158] to-[#D4AF37] font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-3">
                The World of Gold
              </h1>
              <h2 className="text-lg md:text-xl text-white/90 font-light tracking-[0.2em] uppercase mb-2 drop-shadow-md">
                Time-Tested Pure Value
              </h2>
              <p className="text-sm md:text-base text-gray-400 font-light tracking-widest">
                GOLDDUNIA.COM
              </p>
            </div>

            {/* Search Capsule */}
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#DDA7A5]/20 to-[#D4AF37]/20 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border-2 border-white/30 rounded-[2rem] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] group-hover:border-[#DDA7A5]/50 transition-colors">
                <input 
                  type="text" 
                  placeholder="Find Trusted Gold Jewelers or Products..." 
                  className="flex-1 bg-transparent border-none outline-none text-white px-6 placeholder-gray-300 font-light text-lg tracking-wide text-left"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="p-3 mr-2 rounded-full bg-gradient-to-r from-[#DDA7A5] to-[#D4AF37] text-[#111] transition-all flex items-center justify-center hover:scale-105 shadow-lg">
                  <Search className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </form>

            {/* Geo Chips */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-6">
              {geoChips.map((chip, idx) => (
                <Link key={chip.label} href={chip.href} className={`px-5 py-1.5 rounded-[2rem] border text-xs font-light tracking-wide backdrop-blur-md transition-all hover:scale-105 ${idx === 0 ? 'border-[#DDA7A5] text-[#DDA7A5] shadow-[0_0_15px_rgba(221,167,165,0.3)] bg-black/40' : 'border-white/30 text-white bg-black/20 hover:border-white/60 hover:text-[#D4AF37]'}`}>
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          
          {/* Tile A: The Shop (2x2) */}
          <Link href="/shop" className="relative group col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
            <img src="/stock/bento-shop.png" alt="Premium Gold Products" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <h3 className="text-3xl md:text-4xl font-serif text-[#C5A059] mb-2 drop-shadow-md">Premium Gold Products</h3>
                <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed hidden md:block">Book breathtaking, HUID-certified 22K & 24K temple jewelry directly from master artisans and verified showrooms.</p>
                <div className="mt-4 inline-flex items-center text-white text-sm tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                  Shop Masterpieces <ChevronRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile B: Directory (1x1) */}
          <Link href="/directory" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
            <img src="/stock/bento-directory.png" alt="Global Directory" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                <h3 className="text-xl font-serif text-[#C5A059] mb-1">Global Directory</h3>
                <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                  Find Jewelers <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile C: Vendor / Sell (1x1) */}
          <Link href="/sell-with-us" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
            <img src="/stock/bento-vendor.png" alt="List Your Shop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                <h3 className="text-xl font-serif text-[#C5A059] mb-1">List Your Shop</h3>
                <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                  Sell With Us <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile D: Live Rates (1x1) */}
          <Link href="/gold-price-live" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
            <img src="/stock/bento-rates.png" alt="Live Gold Rates" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                <h3 className="text-xl font-serif text-[#C5A059] mb-1">Live Gold Rates</h3>
                <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                  Check Prices <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Tile E: Jobs (1x1) */}
          <Link href="/jobs" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
            <img src="/stock/bento-jobs.png" alt="Jewelry Careers" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                <h3 className="text-xl font-serif text-[#C5A059] mb-1">Jewelry Careers</h3>
                <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                  Browse Jobs <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Luxury Trust Banner - With Rose Gold / Soft Pink Accents */}
      <section className="relative z-10 py-8 border-y border-white/5 bg-gradient-to-r from-[#DDA7A5]/5 via-white/5 to-[#D4AF37]/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-3xl rounded-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10">
            
            <div className="flex-1 flex items-center p-6 md:p-8 md:border-r border-white/10 hover:bg-white/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-white tracking-wide mb-1">Verified HUID</h3>
                <p className="text-xs text-gray-300 font-light">Certified authenticity for every piece.</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center p-6 md:p-8 md:border-r border-white/10 hover:bg-white/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
                <Percent className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[#FDE047] tracking-wide mb-1">Transparent Making Charges</h3>
                <p className="text-xs text-gray-300 font-light">Upfront pricing, no hidden fees.</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center p-6 md:p-8 hover:bg-white/5 transition-colors group w-full">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#DDA7A5] drop-shadow-[0_0_8px_rgba(221,167,165,0.8)]">
                <Star className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[#DDA7A5] tracking-wide mb-1">Premium Boutiques</h3>
                <p className="text-xs text-gray-300 font-light">Luxury aesthetics in every interaction.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Latest Products - Row 1 (Necklaces) */}
      <section className="relative z-10 py-16 bg-gradient-to-b from-[#060A14] to-[#0A1021]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-[#DDA7A5]/20 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-white mb-2 tracking-widest uppercase">
                Bridal & <span className="text-[#DDA7A5]">Neck Jewellery</span>
              </h2>
              <p className="text-[#9CA3AF] font-light text-sm">Discover latest designs directly from verified vendors.</p>
            </div>
            <Link href="/directory" className="text-[#DDA7A5] text-sm hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 font-light">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-light flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-2 border-[#DDA7A5] border-t-transparent rounded-full animate-spin"></div>
               Loading Masterpieces...
            </div>
          ) : row1Products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {row1Products.slice(0, 4).map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 font-light">No products available in this category yet.</div>
          )}
        </div>
      </section>

      {/* AdSense Placement 1 */}
      <section className="relative z-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <GlobalBannerSlot placementId="homepage_middle" context={{ audience: "global" }} />
        </div>
      </section>

      {/* Elite Shops Section (Top) */}
      <section className="relative z-10 py-16 bg-[#0A1021]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-[#D4AF37]/20 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-white mb-2 aurous-silver-text uppercase tracking-widest">
                Elite Tier <span className="text-[#D4AF37]">Shops</span>
              </h2>
              <p className="text-[#9CA3AF] font-light text-sm">Discover the most prestigious jewelers in your area.</p>
            </div>
            <Link href="/directory" className="text-[#D4AF37] text-sm hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 font-light">
              View Directory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 py-12 text-center text-gray-500 font-light flex flex-col items-center gap-4">
                 <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                 Loading Elite Shops...
              </div>
            ) : topShops.map((shop, i) => (
              <Link href={`/shop/${shop.id}`} key={shop.id} className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden group relative border border-[#D4AF37]/20 hover:border-[#DDA7A5]/60 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                {/* Corner Ribbon */}
                {shop.subscriptionTier === 'ELITE' && (
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] overflow-hidden z-30">
                    <div className="absolute top-[20px] -right-[28px] w-[140px] transform rotate-45 bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#D4AF37] text-black text-center py-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.6)]">
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none drop-shadow-sm">Elite</span>
                    </div>
                  </div>
                )}
                <div className="p-5 pt-6 flex flex-col h-full">
                  <h3 className="text-xl font-[family-name:var(--font-display)] text-white group-hover:text-[#DDA7A5] transition-colors mb-1 truncate">
                    {shop.name}
                  </h3>
                  <div className="flex items-center text-[10px] text-gray-400 mb-4 tracking-widest uppercase">
                    <MapPin className="w-3 h-3 mr-1 text-[#D4AF37]" />
                    {shop.location?.district || "India"}, {shop.location?.state || ""}
                  </div>
                  
                  <div className="flex gap-4 mt-auto">
                    <div className="w-[110px] h-[110px] flex-shrink-0 rounded-lg overflow-hidden border border-white/10 relative shadow-inner">
                       <img 
                         src={shop.coverImages?.[0] || "/images/showrooms.png"} 
                         alt={shop.name} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    
                    <div className="flex-1 bg-black/40 rounded-lg p-3 border border-white/5 flex flex-col justify-center items-center text-center group-hover:bg-[#DDA7A5]/10 transition-colors">
                       <span className="text-xs text-gray-300 font-light mb-2">View full collection & live rates</span>
                       <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-xs font-light text-white group-hover:border-[#DDA7A5] transition-all">
                         Visit Store
                       </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!loading && topShops.length === 0 && (
               <div className="col-span-3 py-12 text-center text-gray-500 font-light">No shops available yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* AdSense Placement 2 */}
      <section className="relative z-10 py-4 bg-[#0A1021]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <GlobalBannerSlot placementId="content_bottom" context={{ audience: "global" }} />
        </div>
      </section>

    </main>
  );
}
