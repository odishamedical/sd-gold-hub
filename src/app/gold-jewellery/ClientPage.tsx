"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalBannerSlot from "@/components/GlobalBannerSlot";
import UploadProductModal from "@/app/shop/[id]/components/UploadProductModal";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { getRecentProducts, getShopById } from "@/lib/firestore/products";
import { getShops } from "@/lib/firestore/shops";
import PremiumPageHero from "@/components/PremiumPageHero";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [flagshipVendors, setFlagshipVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Platform Upload States
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
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

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === 'admin' || role === 'super_admin') {
              setIsAuthorized(true);
            }
          }
        } catch (e) {
          console.error("Auth check failed", e);
        }
      }
    });

    return () => unsubscribe();
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

      <PremiumPageHero 
        title="Find Gold Jewellery from Leading Stores"
        subtitle="Explore authenticated 22K & 24K gold masterpieces from India's finest verified jewelers."
        imagePath="/stock/shop-hero-pc.png"
        mobileImagePath="/stock/shop-hero-phone.png"
        uppercaseTitle={false}
        imageAlignment="right"
        overlayStyle="text-side"
      />

      {/* Main Content Area */}
      <div className="relative flex flex-col z-10 w-full">
          
          {/* Filtering & Search Controls */}
          <section className="relative w-full border-b border-[#2A344A] py-6 px-4 sm:px-6 lg:px-8 z-10 pt-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            <div className="flex justify-between items-center mb-2">
              <Breadcrumbs items={[{ label: "Gold Jewellery" }]} />
              
              {isAuthorized && (
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#C5A059] text-black font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(197,160,89,0.3)] flex items-center gap-1.5 shrink-0"
                >
                  <span className="text-sm md:text-lg leading-none">+</span> <span className="hidden sm:inline">Upload Platform Product</span><span className="sm:hidden">Upload</span>
                </button>
              )}
            </div>
            
            {/* Top Row: Search & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="relative flex-1 max-w-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#DDA7A5]/20 to-[#D4AF37]/20 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-white/5 backdrop-blur-2xl border-2 border-white/20 rounded-[2rem] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)] group-hover:border-[#DDA7A5]/40 transition-colors w-full">
                  <input 
                    type="text" 
                    placeholder="Search by Title, Vendor, or Category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white px-6 placeholder-gray-400 font-light text-sm tracking-wide min-w-0 py-2"
                  />
                  <div className="p-2 md:p-2.5 mr-1 flex-shrink-0 rounded-full bg-gradient-to-r from-[#DDA7A5] to-[#D4AF37] text-[#111] flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <span className="text-xs text-gray-500 uppercase tracking-widest hidden md:inline">Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-[1.5rem] px-5 py-3 focus:outline-none focus:border-[#C5A059] transition-colors appearance-none cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="popular">Most Viewed / Bids</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            </div>
          </section>

          {/* Product Grid Section */}
          <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 flex-1 z-10">
            <div className="max-w-7xl mx-auto">
              
              {/* Product List Ad Injection */}
              <div className="mb-8">
                <GlobalBannerSlot placementId="global_feed" context={{ audience: 'products' }} glass />
              </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

      </div>
      
      {showUploadModal && (
        <UploadProductModal 
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          shopId="gold_dunia_official"
          isAdmin={true}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}
    </main>
  );
}
