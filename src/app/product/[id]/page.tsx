"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SocialShareButtons from "@/components/SocialShareButtons";
import { getProductById, getShopLiveRates, getShopById } from "@/lib/firestore/products";
import WhatsAppContactButton from "@/components/WhatsAppContactButton";
import { Product, LiveGoldRate, Shop } from "@/types/gold-hub";
import { ShieldCheck } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [liveRates, setLiveRates] = useState<LiveGoldRate | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Product States
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedPurity, setSelectedPurity] = useState("22K Gold"); 
  const [selectedSize, setSelectedSize] = useState("Standard (16 Inch)");
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("specifications");

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        const productId = resolvedParams.id;
        
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setSelectedImage(fetchedProduct.images?.[0] || "");
          setSelectedPurity(fetchedProduct.metalPurityId === 'm1' ? "24K Pure Gold" : "22K Gold");
          
          const [fetchedShop, fetchedRates] = await Promise.all([
            getShopById(fetchedProduct.shopId),
            getShopLiveRates(fetchedProduct.shopId)
          ]);
          setShop(fetchedShop);
          setLiveRates(fetchedRates);
        }
      } catch (error) {
        console.error("Failed to load product details", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const calculateLivePrice = () => {
    if (!product || !liveRates) return { weight: 0, goldRate: 0, rawGoldValue: 0, making: 0, subtotal: 0, gst: 0, grandTotal: 0 };

    const calcWeight = product.weightGrams || 0; // Assuming no size multiplier for simplicity right now
    const goldRate = selectedPurity === "22K Gold" ? liveRates.rate22K : liveRates.rate24K;
    
    const rawGoldValue = calcWeight * goldRate;
    
    let making = 0;
    // mock making charges for now, real app would fetch MakingCharge by ID
    making = rawGoldValue * 0.15; // 15%

    const subtotal = rawGoldValue + making;
    const gst = Math.round(subtotal * 0.03);
    const grandTotal = subtotal + gst;

    return {
      weight: calcWeight,
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

  if (loading || !product || !shop) {
    return (
      <main className="min-h-screen bg-[#060A14] flex flex-col items-center justify-center p-8 font-sans text-white">
        <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-serif text-[#C5A059] tracking-wider font-bold">Synchronizing Sovereign Vault...</h2>
        <p className="text-xs text-gray-400 font-mono mt-1">Connecting to Firestore to fetch live {product?.metalPurityId || '22K/24K'} specifications.</p>
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

      <div className="relative w-full max-w-[1200px] bg-[#0A1021] rounded-none md:rounded-2xl border-x-0 md:border-x-[3px] border-y-[1px] md:border-y-[3px] border-[#C5A059]/30 md:border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.15)] z-10 flex flex-col overflow-hidden animate-in fade-in duration-500">
        
        <Header />

        {/* Breadcrumb Bar */}
        <div className="bg-[#0E1528] px-6 py-3 border-b border-[#2A344A] flex items-center gap-2 text-xs text-gray-400 font-mono overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#C5A059] transition-colors">Vault Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C5A059] transition-colors">Directory</Link>
          <span>/</span>
          <Link href={`/shop/${shop.id}`} className="hover:text-[#C5A059] transition-colors">{shop.name}</Link>
          <span>/</span>
          <span className="text-[#C5A059] font-bold">{product.designName}</span>
        </div>

        {/* Main Product Showcase Section */}
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Image Gallery & HUID Verifier */}
          <div className="flex flex-col gap-6 sticky top-28">
            <div className="relative aspect-[4/3] bg-black rounded-2xl border border-[#2A344A] overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20"></div>
              {selectedImage ? (
                <img src={selectedImage} alt={product.designName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" />
              ) : (
                <div className="text-gray-600">No Image Available</div>
              )}
              
              <span className="absolute top-4 left-4 bg-[#141C33]/90 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg z-20 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                100% BIS Hallmarked
              </span>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((imgUrl, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative aspect-square rounded-xl bg-black border overflow-hidden transition-all ${selectedImage === imgUrl ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'border-[#2A344A] opacity-60 hover:opacity-100'}`}
                >
                  <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Government BIS HUID Verification Box */}
            <div className="bg-[#0E1528] border border-[#2A344A] p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#2A344A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/40 shadow-inner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#C5A059] tracking-wider text-base">Government BIS HUID Verified</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Bureau of Indian Standards</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-[#141C33] border border-[#C5A059]/40 text-[#C5A059] px-3 py-1.5 rounded-lg shadow">
                  A1B2C3
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Every masterpiece on Shyam Dash is laser-engraved with a unique 6-digit alphanumeric HUID code. You can verify this code on the official Government BIS Care Mobile App for complete peace of mind.
              </p>
            </div>

          </div>

          {/* Right Column: Customization & Pricing Engine */}
          <div className="flex flex-col gap-8">
            
            <div className="flex flex-col border-b border-[#2A344A] pb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold font-mono text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">
                  Verified Jeweler: {shop.name}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-serif text-[#C5A059] tracking-wider font-bold leading-tight mb-3">
                {product.designName}
              </h1>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-xl mb-4">
                Premium {product.categoryId} crafted with authentic hallmarked gold.
              </p>
              
              <div className="pt-2 border-t border-[#2A344A]/40">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block mb-2">Promote & Earn Affiliate Commission:</span>
                <SocialShareButtons productName={product.designName} />
              </div>
            </div>

            {/* Customization 1: Gold Purity */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest font-mono">1. Select Gold Purity Index</label>
                <span className="text-[10px] text-gray-400 font-mono">Live Showroom Rates</span>
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
                  <span className="text-xs text-[#C5A059] font-mono font-bold">₹ {liveRates?.rate22K.toLocaleString('en-IN')} / gm</span>
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
                  <span className="text-xs text-[#C5A059] font-mono font-bold">₹ {liveRates?.rate24K.toLocaleString('en-IN')} / gm</span>
                  <span className="text-[10px] text-gray-400 mt-1">99.9% Pure • Ultimate Investment</span>
                </button>
              </div>
            </div>

            {/* 5-Step Dynamic Pricing Breakdown Box */}
            <div className="bg-[#0E1528] border border-[#2A344A] p-6 rounded-2xl flex flex-col gap-6 shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-[#2A344A] pb-4 flex items-center justify-between">
                <span>Dynamic Pricing Matrix</span>
                <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/30">Real-Time Valuation</span>
              </h3>

              <div className="flex flex-col gap-3 font-mono text-xs divide-y divide-[#2A344A]/50 bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner">
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">1. Raw Gold Value ({livePrice.weight}g × ₹{livePrice.goldRate}/g)</span>
                  <span className="text-white font-bold">₹ {livePrice.rawGoldValue.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">2. Making Charges</span>
                  <span className="text-white font-bold">₹ {livePrice.making.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#2A344A]">
                  <span className="text-gray-300 font-sans font-bold">3. Subtotal Valuation</span>
                  <span className="text-white font-bold">₹ {livePrice.subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">4. Mandatory 3% GST</span>
                  <span className="text-yellow-500 font-bold">₹ {livePrice.gst.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2 border-[#C5A059]">
                  <span className="text-[#C5A059] font-serif font-bold text-base">5. Grand Total (INR)</span>
                  <span className="text-[#C5A059] font-bold text-2xl font-mono">₹ {livePrice.grandTotal.toLocaleString('en-IN')}</span>
                </div>

              </div>

              <div className="pt-2">
                <WhatsAppContactButton shop={shop} product={product} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
