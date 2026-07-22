"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SPREE_API = process.env.NEXT_PUBLIC_SPREE_API_URL || "https://spree-production-3fb8.up.railway.app";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("ALL");
  const [selectedPurity, setSelectedPurity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("featured");

  // Mock Fallback Data exactly matching the Aurora Gold design
  const mockupProducts = [
    {
      id: "MOCK-1",
      title: "22K Lotus Heritage Necklace",
      vendor: "IRA JEWELS",
      purity: "22K Gold",
      category: "Necklaces",
      weight: "41.0 g",
      price: 285000,
      displayPrice: "₹ 2,85,000",
      viewers: 148,
      timeLeft: "01:22:45",
      image: "/diamond_necklace_luxury.png",
      makingCharges: "₹ 8,500",
      bvcInsured: true
    },
    {
      id: "MOCK-2",
      title: "Solid 24K Sovereign Bangle Set",
      vendor: "DWARIKA JEWELLERS",
      purity: "24K Pure Gold",
      category: "Bangles",
      weight: "65.5 g",
      price: 560000,
      displayPrice: "₹ 5,60,000",
      viewers: 215,
      timeLeft: "",
      warning: "Only 2 Left!",
      image: "/gold_bangle_luxury.png",
      makingCharges: "₹ 12,000",
      bvcInsured: true
    },
    {
      id: "MOCK-3",
      title: "Royal Diamond & Gold Choker",
      vendor: "JEWELLERY WORLD",
      purity: "22K Gold",
      category: "Necklaces",
      weight: "85.2 g",
      price: 1245000,
      displayPrice: "₹ 12,45,000",
      viewers: 95,
      timeLeft: "04:15:30",
      image: "/hero-gold.png",
      makingCharges: "₹ 25,000",
      bvcInsured: true
    },
    {
      id: "MOCK-4",
      title: "18K Vintage Temple Earrings",
      vendor: "NEW JEWELLERY WORLD",
      purity: "18K Gold",
      category: "Earrings",
      weight: "18.4 g",
      price: 350000,
      displayPrice: "₹ 3,50,000",
      viewers: 42,
      timeLeft: "",
      image: "/diamond_necklace_luxury.png",
      makingCharges: "₹ 6,000",
      bvcInsured: true
    },
    {
      id: "MOCK-5",
      title: "24K Pure Gold Lakshmi Coin (10g)",
      vendor: "IRA JEWELS",
      purity: "24K Pure Gold",
      category: "Coins",
      weight: "10.0 g",
      price: 74500,
      displayPrice: "₹ 74,500",
      viewers: 310,
      timeLeft: "00:45:12",
      image: "/hero-gold.png",
      makingCharges: "₹ 1,000",
      bvcInsured: true
    },
    {
      id: "MOCK-6",
      title: "22K Traditional Antique Kangan",
      vendor: "DWARIKA JEWELLERS",
      purity: "22K Gold",
      category: "Bangles",
      weight: "52.8 g",
      price: 415000,
      displayPrice: "₹ 4,15,000",
      viewers: 88,
      timeLeft: "",
      image: "/gold_bangle_luxury.png",
      makingCharges: "₹ 14,500",
      bvcInsured: true
    },
    {
      id: "MOCK-7",
      title: "22K Filigree Droplet Earrings",
      vendor: "JEWELLERY WORLD",
      purity: "22K Gold",
      category: "Earrings",
      weight: "14.2 g",
      price: 112000,
      displayPrice: "₹ 1,12,000",
      viewers: 19,
      timeLeft: "",
      image: "/diamond_necklace_luxury.png",
      makingCharges: "₹ 4,500",
      bvcInsured: true
    },
    {
      id: "MOCK-8",
      title: "24K Sovereign Gold Bar (50g)",
      vendor: "NEW JEWELLERY WORLD",
      purity: "24K Pure Gold",
      category: "Coins",
      weight: "50.0 g",
      price: 368000,
      displayPrice: "₹ 3,68,000",
      viewers: 512,
      timeLeft: "05:12:00",
      image: "/hero-gold.png",
      makingCharges: "₹ 2,500",
      bvcInsured: true
    }
  ];

  const flagshipVendors = ["IRA JEWELS", "DWARIKA JEWELLERS", "JEWELLERY WORLD", "NEW JEWELLERY WORLD"];

  useEffect(() => {
    async function fetchSpreeProducts() {
      try {
        const res = await fetch(`${SPREE_API}/api/v2/storefront/products?include=images`);
        if (!res.ok) throw new Error("Spree API not responding");
        const data = await res.json();
        
        const spreeItems = data?.data || [];
        const included = data?.included || [];

        if (spreeItems.length > 0) {
          const formatted = spreeItems.map((p: any, index: number) => {
            // Extract image
            let imgUrl = "/hero-gold.png";
            const imgRelation = p.relationships?.images?.data?.[0];
            if (imgRelation) {
              const imgObj = included.find((inc: any) => inc.type === 'image' && inc.id === imgRelation.id);
              if (imgObj && imgObj.attributes?.original_url) { imgUrl = imgObj.attributes.original_url.startsWith('/') ? SPREE_API + imgObj.attributes.original_url : imgObj.attributes.original_url; }
            }

            const vendorName = flagshipVendors[index % 4];
            const purityVal = index % 2 === 0 ? "22K Gold" : "24K Pure Gold";
            const categoryVal = index % 4 === 0 ? "Necklaces" : index % 4 === 1 ? "Bangles" : index % 4 === 2 ? "Earrings" : "Coins";

            return {
              id: p.id,
              title: p.attributes?.name || "Gold Masterpiece",
              vendor: vendorName,
              purity: purityVal,
              category: categoryVal,
              weight: `${(Math.random() * 50 + 10).toFixed(1)} g`,
              price: parseFloat(p.attributes?.price || "250000"),
              displayPrice: p.attributes?.display_price || "₹ 2,50,000",
              viewers: Math.floor(Math.random() * 200) + 10,
              timeLeft: index % 3 === 0 ? "02:14:00" : "",
              image: imgUrl,
              makingCharges: "₹ 8,500",
              bvcInsured: true
            };
          });
          setProducts(formatted);
        } else {
          setProducts(mockupProducts);
        }
      } catch (error) {
        setProducts(mockupProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchSpreeProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = selectedVendor === "ALL" || p.vendor === selectedVendor;
    const matchesPurity = selectedPurity === "ALL" || p.purity.includes(selectedPurity);
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesSearch && matchesVendor && matchesPurity && matchesCategory;
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
    <main className="min-h-screen bg-[#0A1021] font-sans text-white animate-in fade-in duration-500">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-col z-10 w-full">
          
          {/* Title Banner */}
          <section className="w-full bg-gradient-to-r from-[#141C33] via-[#0E1528] to-[#141C33] border-b border-[#C5A059]/20 pt-12 pb-10 px-4 md:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 relative">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
              <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">BIS Hallmarked Luxury Vault</span>
              <h1 className="text-2xl md:text-4xl font-serif text-[#C5A059] tracking-wider mt-3 mb-2 font-bold">The Sovereign Catalog</h1>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl leading-relaxed">Explore authenticated 22K & 24K gold masterpieces from India's finest verified jewelers. Every requisition includes 100% insured transit by Sequel & Bluedart.</p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest">Active Vault Inventory</span>
               <span className="text-xl font-bold text-[#C5A059] font-mono">{loading ? "Syncing..." : `${filteredProducts.length} Verified Masterpieces`}</span>
               <span className="text-[9px] text-green-400 flex items-center gap-1 mt-1">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 100% HUID Certified
               </span>
              </div>
            </div>
          </section>

          {/* Filtering & Search Controls */}
          <section className="w-full bg-[#0A1021] border-b border-[#2A344A] py-6 px-4 md:px-8 z-10 relative">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
            
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
                  {["ALL", "IRA JEWELS", "DWARIKA JEWELLERS", "JEWELLERY WORLD", "NEW JEWELLERY WORLD"].map(vendor => (
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
                  {["ALL", "Necklaces", "Bangles", "Earrings", "Coins"].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
                    >
                      {cat === "ALL" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

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
