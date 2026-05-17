"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";
import SocialShareButtons from "@/components/SocialShareButtons";

const SPREE_API = process.env.NEXT_PUBLIC_SPREE_API_URL || "https://spree-production-3fb8.up.railway.app";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Product States
  const [selectedImage, setSelectedImage] = useState("/diamond_necklace_luxury.png");
  const [selectedPurity, setSelectedPurity] = useState("22K Gold"); // 22K Gold vs 24K Pure Gold
  const [selectedSize, setSelectedSize] = useState("Standard (16 Inch)");
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("specifications"); // specifications vs hallmark vs shipping vs reviews

  // Mock Masterpiece Fallback Data
  const fallbackProduct = {
    id: "PROD-901",
    title: "22K Lotus Heritage Masterpiece Necklace",
    vendor: "IRA JEWELS",
    sku: "IRA-NK-8842",
    huidCode: "HUID-784921",
    baseWeight: 41.0, // grams
    goldRate22K: 6985,
    goldRate24K: 7138,
    baseMakingCharges: 8500,
    description: "An extraordinary embodiment of royal Indian craftsmanship. The Lotus Heritage Masterpiece is meticulously hand-carved by master artisans over 140 hours of dedicated precision. Featuring intricate filigree wirework, sovereign temple motifs, and a breathtaking dual-tone matte finish, this piece stands as the pinnacle of productive luxury.",
    images: [
      "/diamond_necklace_luxury.png",
      "/hero-gold.png",
      "/gold_bangle_luxury.png",
      "/diamond_necklace_luxury.png"
    ],
    sizes: [
      { label: "Standard (16 Inch)", weightMultiplier: 1.0 },
      { label: "Matinee (20 Inch)", weightMultiplier: 1.25 },
      { label: "Opera Length (24 Inch)", weightMultiplier: 1.5 }
    ],
    specifications: [
      { label: "Gold Purity", value: "22K (916 Hallmarked) / 24K (999 Pure)" },
      { label: "Gross Weight", value: "41.00 Grams (Standard)" },
      { label: "Net Gold Weight", value: "41.00 Grams" },
      { label: "Hallmarking Agency", value: "Government of India BIS Bureau" },
      { label: "Manufacturing Technique", value: "Handcrafted Filigree & Die Stamping" },
      { label: "Insured Courier Partner", value: "Sequel Secure Logistics (Armored Transit)" }
    ],
    reviews: [
      { name: "Devika R.", rating: 5, date: "May 14, 2026", comment: "Absolutely breathtaking craftsmanship. The BIS HUID certificate was verified online instantly. Sequel delivered it in an armored vehicle with OTP verification. Flawless experience!" },
      { name: "Vikramaditya M.", rating: 5, date: "May 10, 2026", comment: "The weight and making charges are completely transparent. Highly recommend IRA Jewels on the Shyam Dash marketplace." }
    ]
  };

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        // Fetch first product from Spree as live demo
        const res = await fetch(`${SPREE_API}/api/v2/storefront/products?include=images`);
        if (!res.ok) throw new Error("Spree API not responding");
        const data = await res.json();
        const spreeItems = data?.data || [];
        const included = data?.included || [];

        if (spreeItems.length > 0) {
          const p = spreeItems[0];
          
          // Extract images
          let imgList = ["/diamond_necklace_luxury.png", "/hero-gold.png", "/gold_bangle_luxury.png"];
          const imgRelations = p.relationships?.images?.data || [];
          if (imgRelations.length > 0) {
            const foundImgs = imgRelations.map((rel: any) => {
              const imgObj = included.find((inc: any) => inc.type === 'image' && inc.id === rel.id);
              if (imgObj && imgObj.attributes?.original_url) {
                return imgObj.attributes.original_url.startsWith('/') ? SPREE_API + imgObj.attributes.original_url : imgObj.attributes.original_url;
              }
              return null;
            }).filter(Boolean);
            if (foundImgs.length > 0) imgList = foundImgs;
          }

          setProduct({
            ...fallbackProduct,
            id: p.id,
            title: p.attributes?.name || fallbackProduct.title,
            description: p.attributes?.description || fallbackProduct.description,
            images: imgList,
            baseWeight: parseFloat(p.attributes?.weight || "41.0")
          });
          setSelectedImage(imgList[0]);
        } else {
          setProduct(fallbackProduct);
          setSelectedImage(fallbackProduct.images[0]);
        }
      } catch (error) {
        setProduct(fallbackProduct);
        setSelectedImage(fallbackProduct.images[0]);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetail();
  }, []);

  // Dynamic Pricing Engine
  const calculateLivePrice = () => {
    if (!product) return { weight: "0", goldRate: 0, rawGoldValue: 0, making: 0, subtotal: 0, gst: 0, grandTotal: 0 };

    const currentSizeObj = product.sizes.find((s: any) => s.label === selectedSize) || product.sizes[0];
    const calcWeight = product.baseWeight * currentSizeObj.weightMultiplier;
    const goldRate = selectedPurity === "22K Gold" ? product.goldRate22K : product.goldRate24K;
    
    const rawGoldValue = calcWeight * goldRate;
    const making = product.baseMakingCharges * currentSizeObj.weightMultiplier;
    const subtotal = rawGoldValue + making;
    const gst = Math.round(subtotal * 0.03);
    const grandTotal = subtotal + gst;

    return {
      weight: calcWeight.toFixed(2),
      goldRate,
      rawGoldValue: Math.round(rawGoldValue),
      making: Math.round(making),
      subtotal: Math.round(subtotal),
      gst,
      grandTotal
    };
  };

  const livePrice = calculateLivePrice();

  const handleVerifyPincode = () => {
    if (!pincodeInput || pincodeInput.length < 6) {
      setPincodeStatus({ available: false, message: "Please enter a valid 6-digit Indian Postal Pincode." });
      return;
    }

    // Simulate high-fidelity Sequel Pincode verification
    if (["400", "110", "700", "600", "500", "751", "380"].some(prefix => pincodeInput.startsWith(prefix))) {
      setPincodeStatus({
        available: true,
        message: "Armored Van Delivery Available!",
        partner: "Sequel Secure Logistics",
        timeframe: "Guaranteed Delivery within 48 Hours",
        insurance: "100% BVC Indemnity Covered"
      });
    } else {
      setPincodeStatus({
        available: true,
        message: "Secure Air Express Delivery Available!",
        partner: "Bluedart Secure Gold Priority",
        timeframe: "Delivery within 3-4 Working Days",
        insurance: "100% Transit Insurance Covered"
      });
    }
  };

  const handleAddToCart = () => {
    alert(`🛒 Successfully added ${product?.title} to your secure shopping bag!\n\nSpecifications:\n• Purity: ${selectedPurity}\n• Size: ${selectedSize}\n• Net Weight: ${livePrice.weight}g\n• Total Valuation: ₹ ${livePrice.grandTotal.toLocaleString('en-IN')}\n\nArmored dispatch assigned to Sequel Secure Logistics.`);
  };

  const handleInstantBuy = () => {
    window.location.href = "/cart";
  };

  if (loading || !product) {
    return (
      <main className="min-h-screen bg-[#060A14] flex flex-col items-center justify-center p-8 font-sans text-white">
        <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-serif text-[#C5A059] tracking-wider font-bold">Synchronizing Sovereign Vault...</h2>
        <p className="text-xs text-gray-400 font-mono mt-1">Connecting to Railway Spree Commerce to fetch live 22K/24K specifications.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060A14] flex flex-col items-center p-0 md:p-8 font-sans text-white pb-32">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Main Wrapper */}
      <div className="relative w-full max-w-[1200px] bg-[#0A1021] rounded-none md:rounded-2xl border-x-0 md:border-x-[3px] border-y-[1px] md:border-y-[3px] border-[#C5A059]/30 md:border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.15)] z-10 flex flex-col overflow-hidden animate-in fade-in duration-500">
        
        {/* Top Live Rates Bar */}
        <div className="bg-[#121A30] text-[#9BA3AF] text-[10px] md:text-xs py-2 px-4 md:px-6 flex overflow-x-auto no-scrollbar whitespace-nowrap justify-start md:justify-center items-center gap-4 md:gap-6 border-b border-[#2A344A]">
          <span className="text-[#C5A059] font-bold tracking-widest uppercase shrink-0">Live Gold Rates</span>
          <span className="opacity-40 shrink-0">|</span>
          <span className="shrink-0">24K: ₹7,138.50/gm <span className="text-green-500">(▲0.8%)</span></span>
          <span className="opacity-40 shrink-0">|</span>
          <span className="shrink-0">22K: ₹6,985.20/gm <span className="text-green-500">(▲0.6%)</span></span>
          <span className="opacity-40 shrink-0">|</span>
          <span className="shrink-0">Updated: 14:32 IST</span>
        </div>

        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-[#0A1021]/95 backdrop-blur-sm px-4 md:px-8 py-4 md:py-6 flex justify-between items-center border-b border-[#2A344A]">
          <div className="absolute bottom-0 inset-x-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_20px_rgba(230,179,74,0.8)] z-20"></div>
          <div className="flex items-center gap-4 md:gap-12">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image src="/sd_logo_final.png" alt="Shyam Dash Logo" fill className="object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.5)] group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-serif text-[#C5A059] tracking-widest font-bold leading-none whitespace-nowrap">Shyam Dash</h1>
                <span className="text-[7px] md:text-[9px] text-[#C5A059]/70 uppercase tracking-widest mt-1 whitespace-nowrap">India's Verified Gold Marketplace.</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <Link href="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
            <Link href="/shop" className="text-[#C5A059] font-bold transition-colors flex items-center gap-1">Shop <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
            <Link href="/auctions" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Auctions <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
            
            <UserDropdown />
            
            <Link href="/cart" className="flex items-center gap-2 text-white ml-2 bg-[#141C33] border border-[#2A344A] px-4 py-2 rounded-full hover:border-[#C5A059] transition-all">
              <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="text-xs font-bold uppercase tracking-widest">Bag</span>
              <span className="bg-[#C5A059] text-[#0A1021] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </Link>
          </nav>
        </header>

        {/* Breadcrumb Bar */}
        <div className="bg-[#0E1528] px-6 py-3 border-b border-[#2A344A] flex items-center gap-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#C5A059] transition-colors">Vault Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C5A059] transition-colors">Sovereign Catalog</Link>
          <span>/</span>
          <Link href="#" className="hover:text-[#C5A059] transition-colors">{product.vendor}</Link>
          <span>/</span>
          <span className="text-[#C5A059] font-bold">{product.title}</span>
        </div>

        {/* Main Product Showcase Section */}
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Multi-Angle Image Gallery & HUID Verifier */}
          <div className="flex flex-col gap-6 sticky top-28">
            
            {/* Master Image Display */}
            <div className="relative aspect-[4/3] bg-black rounded-2xl border border-[#2A344A] overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20"></div>
              <Image src={selectedImage} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" />
              
              {/* Badges */}
              <span className="absolute top-4 left-4 bg-[#141C33]/90 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg z-20 font-mono">
                <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
                100% BIS Hallmarked
              </span>

              <button className="absolute top-4 right-4 bg-black/50 border border-[#2A344A] text-[#C5A059] hover:text-white p-3 rounded-full backdrop-blur-md transition-colors z-20 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>

              <div className="absolute bottom-4 right-4 bg-black/70 border border-[#C5A059]/40 text-[#C5A059] text-[10px] px-3 py-1.5 rounded-lg backdrop-blur-md font-mono z-20 shadow-lg">
                SKU: {product.sku}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-xl bg-black border overflow-hidden transition-all ${selectedImage === img ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'border-[#2A344A] opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Government BIS HUID Verification Box */}
            <div className="bg-[#0E1528] border border-[#2A344A] p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#2A344A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/40 shadow-inner">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#C5A059] tracking-wider text-base">Government BIS HUID Verified</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Bureau of Indian Standards Authenticity</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-[#141C33] border border-[#C5A059]/40 text-[#C5A059] px-3 py-1.5 rounded-lg shadow">
                  {product.huidCode}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Every masterpiece on Shyam Dash is laser-engraved with a unique 6-digit alphanumeric HUID code. You can verify this code on the official Government BIS Care Mobile App for complete peace of mind.
              </p>
            </div>

          </div>

          {/* Right Column: Customization & Pricing Engine */}
          <div className="flex flex-col gap-8">
            
            {/* Title & Vendor Header */}
            <div className="flex flex-col border-b border-[#2A344A] pb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold font-mono text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">
                  Verified Flagship Jeweler: {product.vendor}
                </span>
                <span className="text-xs text-green-400 font-bold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> In Stock (Ready to Dispatch)
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-serif text-[#C5A059] tracking-wider font-bold leading-tight mb-3">
                {product.title}
              </h1>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-xl mb-4">
                {product.description}
              </p>
              
              {/* Affiliate Tracked Social Share E.g. WhatsApp & Facebook */}
              <div className="pt-2 border-t border-[#2A344A]/40">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block mb-2">Promote & Earn Affiliate Commission:</span>
                <SocialShareButtons productName={product.title} />
              </div>
            </div>

            {/* Customization 1: Gold Purity */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest font-mono">1. Select Gold Purity Index</label>
                <span className="text-[10px] text-gray-400 font-mono">Live Spree Rates</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedPurity("22K Gold")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${selectedPurity === '22K Gold' ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.25)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-white font-mono">22K Hallmarked Gold</span>
                    <span className="w-3 h-3 rounded-full border border-[#C5A059] flex items-center justify-center">
                      {selectedPurity === '22K Gold' && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>}
                    </span>
                  </div>
                  <span className="text-xs text-[#C5A059] font-mono font-bold">₹ {product.goldRate22K.toLocaleString('en-IN')} / gm</span>
                  <span className="text-[10px] text-gray-400 mt-1">91.6% Pure • Best for Durability</span>
                </button>

                <button 
                  onClick={() => setSelectedPurity("24K Pure Gold")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${selectedPurity === '24K Pure Gold' ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.25)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-white font-mono">24K Pure Sovereign Gold</span>
                    <span className="w-3 h-3 rounded-full border border-[#C5A059] flex items-center justify-center">
                      {selectedPurity === '24K Pure Gold' && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>}
                    </span>
                  </div>
                  <span className="text-xs text-[#C5A059] font-mono font-bold">₹ {product.goldRate24K.toLocaleString('en-IN')} / gm</span>
                  <span className="text-[10px] text-gray-400 mt-1">99.9% Pure • Ultimate Investment</span>
                </button>
              </div>
            </div>

            {/* Customization 2: Masterpiece Size / Length */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest font-mono">2. Select Masterpiece Length / Size</label>
                <span className="text-[10px] text-gray-400 font-mono">Adjusts Gold Weight</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {product.sizes.map((sizeObj: any) => (
                  <button 
                    key={sizeObj.label}
                    onClick={() => setSelectedSize(sizeObj.label)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${selectedSize === sizeObj.label ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                  >
                    <span className="text-xs font-bold text-white block mb-1">{sizeObj.label}</span>
                    <span className="text-xs text-[#C5A059] font-mono font-bold">{(product.baseWeight * sizeObj.weightMultiplier).toFixed(2)}g</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5-Step Dynamic Pricing Breakdown Box */}
            <div className="bg-[#0E1528] border border-[#2A344A] p-6 rounded-2xl flex flex-col gap-6 shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-[#2A344A] pb-4 flex items-center justify-between">
                <span>5-Step Sovereign Pricing Matrix</span>
                <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/30">Real-Time Valuation</span>
              </h3>

              <div className="flex flex-col gap-3 font-mono text-xs divide-y divide-[#2A344A]/50 bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner">
                
                {/* Step 1: Raw Gold */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">1. Raw Gold Value ({livePrice.weight}g × ₹{livePrice.goldRate}/g)</span>
                  <span className="text-white font-bold">₹ {livePrice.rawGoldValue.toLocaleString('en-IN')}</span>
                </div>

                {/* Step 2: Making Charges */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">2. Master Artisan Making Charges</span>
                  <span className="text-white font-bold">₹ {livePrice.making.toLocaleString('en-IN')}</span>
                </div>

                {/* Step 3: Subtotal */}
                <div className="flex justify-between items-center pt-2 border-t border-[#2A344A]">
                  <span className="text-gray-300 font-sans font-bold">3. Subtotal Valuation</span>
                  <span className="text-white font-bold">₹ {livePrice.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Step 4: GST */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">4. Mandatory 3% Indian Jewelry GST</span>
                  <span className="text-yellow-500 font-bold">₹ {livePrice.gst.toLocaleString('en-IN')}</span>
                </div>

                {/* Step 5: Grand Total */}
                <div className="flex justify-between items-center pt-4 border-t-2 border-[#C5A059]">
                  <span className="text-[#C5A059] font-serif font-bold text-base">5. Grand Total (INR)</span>
                  <span className="text-[#C5A059] font-bold text-2xl font-mono">₹ {livePrice.grandTotal.toLocaleString('en-IN')}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-xl bg-[#141C33] border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Add Requisition to Bag
                </button>

                <button 
                  onClick={handleInstantBuy}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Instant Sovereign Buy
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                 <span className="flex items-center gap-1">🛡️ 100% BVC Insured</span>
                 <span>•</span>
                 <span className="flex items-center gap-1">🏦 Bank OTP Secured</span>
                 <span>•</span>
                 <span className="flex items-center gap-1">📄 BIS Hallmarked</span>
              </div>
            </div>

            {/* Armored Transit Pincode Estimator */}
            <div className="bg-[#0E1528] border border-[#2A344A] p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 border-b border-[#2A344A] pb-4">
                <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
                Armored Transit Pincode Estimator
              </h3>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6-Digit Indian Pincode (e.g. 400001)..." 
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 flex-1 focus:outline-none focus:border-[#C5A059] font-mono tracking-widest"
                />
                <button 
                  onClick={handleVerifyPincode}
                  className="bg-[#141C33] border border-[#2A344A] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow"
                >
                  Verify Dispatch
                </button>
              </div>

              {pincodeStatus && (
                <div className={`p-4 rounded-xl border flex flex-col gap-1.5 font-mono text-xs animate-in fade-in duration-300 ${pincodeStatus.available ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                  <span className="font-bold font-sans flex items-center gap-1.5">
                    {pincodeStatus.available ? "✓ " : "✗ "} {pincodeStatus.message}
                  </span>
                  {pincodeStatus.available && (
                    <>
                      <span className="text-white">Logistics Partner: <strong className="text-[#C5A059]">{pincodeStatus.partner}</strong></span>
                      <span className="text-gray-300">Transit Speed: <strong>{pincodeStatus.timeframe}</strong></span>
                      <span className="text-green-400 text-[10px]">{pincodeStatus.insurance}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Detailed Tabs Section */}
            <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex border-b border-[#2A344A] bg-[#0A1021] text-xs font-bold uppercase tracking-wider overflow-x-auto whitespace-nowrap divide-x divide-[#2A344A]">
                <button onClick={() => setActiveTab("specifications")} className={`flex-1 py-4 px-6 transition-colors ${activeTab === 'specifications' ? 'bg-[#141C33] text-[#C5A059] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-white'}`}>Specifications</button>
                <button onClick={() => setActiveTab("hallmark")} className={`flex-1 py-4 px-6 transition-colors ${activeTab === 'hallmark' ? 'bg-[#141C33] text-[#C5A059] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-white'}`}>BIS Hallmark</button>
                <button onClick={() => setActiveTab("shipping")} className={`flex-1 py-4 px-6 transition-colors ${activeTab === 'shipping' ? 'bg-[#141C33] text-[#C5A059] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-white'}`}>Armored Transit</button>
                <button onClick={() => setActiveTab("reviews")} className={`flex-1 py-4 px-6 transition-colors ${activeTab === 'reviews' ? 'bg-[#141C33] text-[#C5A059] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-white'}`}>Reviews ({product.reviews.length})</button>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === "specifications" && (
                  <div className="flex flex-col gap-4 font-mono text-xs divide-y divide-[#2A344A]">
                    {product.specifications.map((spec: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center pt-3 first:pt-0">
                        <span className="text-gray-400 font-sans">{spec.label}</span>
                        <span className="text-white font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "hallmark" && (
                  <div className="flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
                    <h4 className="font-serif font-bold text-[#C5A059] text-base">The 3 Pillars of BIS Hallmarking</h4>
                    <p>1. **BIS Standard Mark:** The official triangular logo confirming certification by the Bureau of Indian Standards.</p>
                    <p>2. **Purity Grade:** Laser engraved purity index (e.g. 916 for 22K Gold, 999 for 24K Pure Gold).</p>
                    <p>3. **6-Digit HUID Code:** A unique Alphanumeric code laser engraved on every piece, traceable directly to the manufacturing jeweler and hallmarking center.</p>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
                    <h4 className="font-serif font-bold text-[#C5A059] text-base">Sequel & Bluedart Secure Armored Dispatch</h4>
                    <p>All high-value jewelry requisitions are dispatched exclusively through armored transit vehicles equipped with real-time GPS tracking and armed security personnel.</p>
                    <p>Every shipment is 100% insured by BVC Logistics from the moment it leaves the vault until it is safely delivered into your hands. Delivery requires mandatory government ID and OTP verification.</p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="flex flex-col gap-6 divide-y divide-[#2A344A]">
                    {product.reviews.map((rev: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-2 pt-6 first:pt-0">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold font-sans">{rev.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          {"★".repeat(rev.rating)}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Sticky Mobile/Desktop Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0A1021]/95 backdrop-blur-md border-t border-[#C5A059] p-4 z-50 shadow-[0_-10_30px_rgba(0,0,0,0.8)] flex justify-between items-center gap-4 md:hidden">
        <div className="flex flex-col font-mono">
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-sans">Sovereign Total</span>
          <span className="text-[#C5A059] text-lg font-bold">₹ {livePrice.grandTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <button onClick={handleAddToCart} className="flex-1 py-3 rounded-xl bg-[#141C33] border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest shadow">Bag</button>
          <button onClick={handleInstantBuy} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest shadow">Buy</button>
        </div>
      </div>

    </main>
  );
}
