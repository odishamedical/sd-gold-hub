"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

import { getRecentProducts, getShopById } from "@/lib/firestore/products";
import { getShops } from "@/lib/firestore/shops";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [flagshipVendors, setFlagshipVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("ALL");
  const [selectedPurity, setSelectedPurity] = useState(searchParams?.get("purity") || "ALL");
  
  // Handle singular/plural category matching from GlobalSearchConsole
  const urlCategory = searchParams?.get("category");
  const initialCategory = urlCategory ? (urlCategory + (urlCategory.endsWith('s') ? '' : 's')) : "ALL";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  const minPriceParam = searchParams?.get("minPrice");
  const maxPriceParam = searchParams?.get("maxPrice");
  const initialPriceRange = (minPriceParam && maxPriceParam) ? `${minPriceParam}-${maxPriceParam}` : "ALL";
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPriceRange);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const liveProducts = await getRecentProducts(20);
        
        if (liveProducts && liveProducts.length > 0) {
          const formatted = await Promise.all(liveProducts.map(async (p: any, index: number) => {
            // Fetch shop details to get the vendor name
            const shop = await getShopById(p.shopId);
            
            return {
              id: p.id,
              title: p.title || "Gold Masterpiece",
              vendor: shop ? shop.name : "Verified Jeweler",
              purity: p.purity || "22K Gold",
              category: p.categoryId || "Necklaces",
              weight: `${p.weightGrams} g`,
              price: p.price || 250000,
              displayPrice: `₹ ${(p.price || 250000).toLocaleString('en-IN')}`,
              viewers: p.viewers || 0,
              timeLeft: p.timeLeft || "",
              image: (p.images && p.images[0]) ? p.images[0] : "/hero-gold.png",
              makingCharges: p.makingCharges || "N/A",
              bvcInsured: p.bvcInsured ?? false
            };
          }));
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveProducts();

    async function fetchFlagshipVendors() {
      try {
        const allShops = await getShops(true);
        // Take up to 4 elite/verified shops for quick tabs
        const topShops = allShops
          .filter(s => s.subscriptionTier === 'ELITE' || s.isVerified)
          .slice(0, 4)
          .map(s => s.name);
        setFlagshipVendors(topShops);
      } catch (error) {
        console.error("Failed to fetch shops for tabs:", error);
      }
    }
    fetchFlagshipVendors();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = selectedVendor === "ALL" || p.vendor === selectedVendor;
    const matchesPurity = selectedPurity === "ALL" || p.purity.includes(selectedPurity);
    
    // Handle category match flexibly
    const baseCategory = selectedCategory === "ALL" ? "ALL" : selectedCategory.replace(/s$/, '').toLowerCase();
    const matchesCategory = selectedCategory === "ALL" || p.category.toLowerCase().includes(baseCategory);

    // Price Match
    let matchesPrice = true;
    if (selectedPriceRange !== "ALL") {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      matchesPrice = p.price >= min && p.price <= max;
    }

    return matchesSearch && matchesVendor && matchesPurity && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "popular") return b.viewers - a.viewers;
    return 0; // featured
  });

  const handleAddToCart = (product: any) => {
    alert(`🛒 Successfully added ${product.title} to your secure shopping bag!\n\nBIS Hallmarked Purity: ${product.purity}\nInsured Transit Partner: Sequel Secure Logistics.`);
  };

  return (
    <main className="min-h-screen bg-[#060A14] font-sans text-white animate-in fade-in duration-500 overflow-hidden">
      
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative flex flex-col z-10 w-full">
          
          {/* Filtering & Search Controls */}
          <section className="relative w-full border-b border-[#2A344A] py-6 px-4 sm:px-6 lg:px-8 z-10 pt-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            <Breadcrumbs items={[{ label: "Shop Gold" }]} className="mb-2" />
            
            {/* Top Row: Search & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-[#2A344A] pb-6">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-4 top-3 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search by Title, Vendor, or Category..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest hidden md:inline">Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="popular">Most Viewed / Bids</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Advanced Tabs */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
              {/* Flagship Vendor Tabs */}
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified Flagship Jeweler</span>
                <div className="flex flex-wrap gap-2 bg-[#0A1021] border border-[#2A344A] p-1.5 rounded-xl">
                  {["ALL", ...flagshipVendors].map(vendor => (
                    <button 
                      key={vendor}
                      onClick={() => setSelectedVendor(vendor)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedVendor === vendor ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
                    >
                      {vendor === "ALL" ? "All Hubs" : vendor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purity Tabs */}
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gold Purity Index</span>
                <div className="flex flex-wrap gap-2 bg-[#0A1021] border border-[#2A344A] p-1.5 rounded-xl">
                  {["ALL", "22K", "24K", "18K"].map(purity => (
                    <button 
                      key={purity}
                      onClick={() => setSelectedPurity(purity)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedPurity === purity ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
                    >
                      {purity === "ALL" ? "All Purity" : `${purity} Hallmarked`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Jewelry Classification</span>
                <div className="flex flex-wrap gap-2 bg-[#0A1021] border border-[#2A344A] p-1.5 rounded-xl">
                  {["ALL", "Necklaces", "Bangles", "Rings", "Earrings", "Bracelets", "Pendants", "Coins"].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat || (selectedCategory === cat.slice(0, -1)) ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
                    >
                      {cat === "ALL" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tabs */}
              <div className="flex flex-col gap-2 w-full lg:w-auto mt-4 lg:mt-0">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price Range</span>
                <div className="flex flex-wrap gap-2 bg-[#0A1021] border border-[#2A344A] p-1.5 rounded-xl">
                  {[
                    { label: "Any", val: "ALL" },
                    { label: "10k-50k", val: "10000-50000" },
                    { label: "50k-1L", val: "50000-100000" },
                    { label: "1L-2.5L", val: "100000-250000" },
                    { label: "2.5L-5L", val: "250000-500000" },
                    { label: "5L+", val: "500000-99999999" }
                  ].map(pr => (
                    <button 
                      key={pr.val}
                      onClick={() => setSelectedPriceRange(pr.val)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedPriceRange === pr.val ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              </div>

            </div>
          </section>

          {/* Product Grid Section */}
          <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 flex-1 z-10">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 border border-[#2A344A] rounded-2xl bg-[#0E1528]/50 backdrop-blur-sm">
                  <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-mono text-[#C5A059] uppercase tracking-widest">Syncing Live Catalog with Spree Backend...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 border border-[#2A344A] rounded-2xl bg-[#0E1528]/50 backdrop-blur-sm text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-[#141C33] flex items-center justify-center text-[#C5A059] border border-[#2A344A]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h3 className="text-xl font-serif text-[#C5A059]">No Matching Masterpieces Found</h3>
                  <p className="text-xs text-gray-400 max-w-md">We couldn't find any jewelry matching your selected purity, vendor, or search filters. Please adjust your criteria to explore the vault.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedVendor("ALL"); setSelectedPurity("ALL"); setSelectedCategory("ALL"); setSelectedPriceRange("ALL"); router.push("/shop"); }}
                    className="mt-2 bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-white transition-colors shadow"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                <div key={product.id} className="relative bg-[#0E1528] rounded-2xl border border-[#2A344A] overflow-hidden group hover:border-[#C5A059] transition-all duration-300 shadow-xl flex flex-col justify-between">
                  <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <Link href={`/product/${product.id}`} className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center p-4">
                        <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                        
                        {/* Insured Tag */}
                        {product.bvcInsured && (
                          <span className="absolute top-3 left-3 bg-[#141C33]/90 border border-[#C5A059]/40 text-[#C5A059] text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow z-20 pointer-events-none">
                            <svg className="w-3 h-3 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
                            100% Insured Transit
                          </span>
                        )}

                        {/* Viewer Ticket */}
                        {(product.viewers > 0 || product.timeLeft) && (
                          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-[#C5A059]/40 rounded-lg flex items-center text-[10px] text-[#C5A059] overflow-hidden z-20 shadow-lg pointer-events-none">
                            {product.viewers > 0 && (
                              <div className="px-2.5 py-1 flex items-center gap-1 font-mono">
                                <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                <span>{product.viewers} Active Viewers</span>
                              </div>
                            )}
                            {product.viewers > 0 && product.timeLeft && <div className="w-[1px] h-3 bg-[#C5A059]/40"></div>}
                            {product.timeLeft && (
                              <div className="px-2.5 py-1 flex items-center gap-1 font-mono text-red-400">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>{product.timeLeft}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-6 pb-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{product.vendor}</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-[#141C33] px-2 py-0.5 rounded border border-[#2A344A]">{product.purity}</span>
                        </div>
                        
                        <h3 className="text-white text-base font-bold mb-3 line-clamp-1 group-hover:text-[#C5A059] transition-colors">{product.title}</h3>
                        
                        {/* Weight & Making Breakdown */}
                        <div className="flex justify-between items-center bg-[#0A1021] border border-[#2A344A] p-3 rounded-xl mb-4 text-xs">
                           <div className="flex flex-col">
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest">Gold Weight</span>
                              <span className="font-bold text-white font-mono">{product.weight}</span>
                           </div>
                           <div className="w-[1px] h-6 bg-[#2A344A]"></div>
                           <div className="flex flex-col text-right">
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest">Making Charges</span>
                              <span className="font-bold text-[#C5A059] font-mono">{product.makingCharges}</span>
                           </div>
                        </div>

                        {/* Pricing Display */}
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-0.5">Est. Total (Inc. 3% GST)</span>
                            <span className="text-[#C5A059] text-xl font-bold font-mono">{product.displayPrice}</span>
                          </div>
                          {product.warning ? (
                            <span className="text-xs font-bold text-red-400 animate-pulse">{product.warning}</span>
                          ) : (
                            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> In Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Heart Button */}
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`❤️ Added ${product.title} to your Sovereign Wishlist!`); }} className="absolute top-3 right-3 text-[#C5A059] hover:text-white transition-colors z-20 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-[#2A344A]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </button>
                </div>
              ))}
                </div>
              )}
            </div>
          </section>

      </div>
    </main>
  );
}
