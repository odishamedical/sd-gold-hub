"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SocialShareButtons from "@/components/SocialShareButtons";
import { getProductById, getShopLiveRates, getShopById, getShopProducts, getProductsByCategory } from "@/lib/firestore/products";
import { getShopSettings, ShopSettings } from "@/lib/firestore/shopSettings";
import WhatsAppContactButton from "@/components/WhatsAppContactButton";
import { Product, LiveGoldRate, Shop } from "@/types/gold-hub";
import { ShieldCheck, Play, Star, ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [liveRates, setLiveRates] = useState<LiveGoldRate | null>(null);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
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
          
          // Update the browser tab title dynamically
          document.title = `${fetchedProduct.designName} | Gold Dunia`;
          
          const [fetchedShop, fetchedRates, fetchedSettings, shopProds, similarProds] = await Promise.all([
            getShopById(fetchedProduct.shopId),
            getShopLiveRates(fetchedProduct.shopId),
            getShopSettings(fetchedProduct.shopId),
            getShopProducts(fetchedProduct.shopId),
            getProductsByCategory(fetchedProduct.categoryId)
          ]);
          setShop(fetchedShop);
          setLiveRates(fetchedRates);
          setShopSettings(fetchedSettings);
          setShopProducts(shopProds.filter(p => p.id !== productId));
          setSimilarProducts(similarProds.filter(p => p.id !== productId));
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
    if (!product || !liveRates) return { weight: 0, goldRate: 0, rawGoldValue: 0, making: 0, huidFee: 0, subtotal: 0, gst: 0, grandTotal: 0 };

    const calcWeight = product.weightGrams || 0; // Assuming no size multiplier for simplicity right now
    const goldRate = selectedPurity === "22K Gold" ? liveRates.rate22K : liveRates.rate24K;
    
    const rawGoldValue = calcWeight * goldRate;
    
    let making = 0;
    
    if (shopSettings && shopSettings.makingCharges) {
      const charge = shopSettings.makingCharges.find(c => c.id === product.makingChargeId);
      if (charge) {
        if (charge.type === 'percentage') {
          making = rawGoldValue * (charge.value / 100);
        } else if (charge.type === 'per_gram') {
          making = calcWeight * charge.value;
        } else if (charge.type === 'flat') {
          making = charge.value;
        }
      } else {
        making = rawGoldValue * 0.15; // fallback
      }
    } else {
      making = rawGoldValue * 0.15; // fallback 15%
    }
    
    const huidFee = shopSettings?.huidFee || 0;
    
    // Add stone price if available
    const stonePrice = product.stoneDetails?.hasStones ? (product.stoneDetails.price || 0) : 0;

    const subtotal = rawGoldValue + making + huidFee + stonePrice;
    const gstRate = shopSettings?.gstRate ? (shopSettings.gstRate / 100) : 0.03;
    const gst = Math.round(subtotal * gstRate);
    const grandTotal = subtotal + gst;

    return {
      weight: calcWeight,
      goldRate,
      rawGoldValue: Math.round(rawGoldValue),
      making: Math.round(making),
      huidFee,
      stonePrice,
      subtotal: Math.round(subtotal),
      gst,
      grandTotal: Math.round(grandTotal)
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
    <main className="min-h-screen bg-[#060A14] font-sans text-white pb-32 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full z-10 flex flex-col">

        {/* Breadcrumb Bar */}
        <div className="w-full border-b border-[#2A344A] bg-[#0A1021]/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
             <Breadcrumbs items={[{ label: "Gold Jewellery", href: "/gold-jewellery" }, { label: product.designName }]} />
          </div>
        </div>

        {/* Main Product Showcase Section */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start z-10">
          
          {/* Left Column: Image Gallery & HUID Verifier */}
          <div className="flex flex-col gap-2 sticky top-28">
            <div className="relative aspect-square bg-black rounded-2xl border border-[#2A344A] overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20"></div>
              {selectedImage.includes('youtube') || selectedImage.includes('youtu.be') ? (
                <iframe 
                  src={selectedImage.replace('shorts/', 'embed/')} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full object-cover opacity-95"
                ></iframe>
              ) : selectedImage ? (
                <Image src={selectedImage} alt={product.designName} fill priority className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" />
              ) : (
                <div className="text-gray-600">No Image Available</div>
              )}
              
              <span className="absolute top-4 left-4 bg-[#141C33]/90 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg z-20 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                100% BIS Hallmarked
              </span>
            </div>

            {/* Thumbnail Gallery (Perfect 4-Grid matching Hero width) */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 gap-2">
                {product.images?.map((imgUrl, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-full aspect-square rounded-xl bg-black border overflow-hidden transition-all ${selectedImage === imgUrl ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'border-[#2A344A] opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={imgUrl} alt={`Gallery ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {((product.youtubeUrls && product.youtubeUrls.length > 0) || product.youtubeShortUrl) && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {/* Legacy support for single video */}
                  {product.youtubeShortUrl && !product.youtubeUrls && (
                    <button 
                      onClick={() => setSelectedImage(product.youtubeShortUrl!)}
                      className={`relative w-full aspect-square rounded-xl bg-black border overflow-hidden transition-all group ${selectedImage === product.youtubeShortUrl ? 'border-red-500 ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-[#2A344A] opacity-80 hover:opacity-100'}`}
                    >
                      <img loading="lazy" src={`https://img.youtube.com/vi/${product.youtubeShortUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/hqdefault.jpg`} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" onError={(e) => e.currentTarget.src = ''} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-red-500" fill="currentColor" />
                        <span className="text-[8px] md:text-[10px] text-white font-bold font-mono drop-shadow-md">Watch</span>
                      </div>
                    </button>
                  )}
                  
                  {/* Array support for multiple videos */}
                  {product.youtubeUrls && product.youtubeUrls.map((url, i) => {
                    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                    return (
                      <button 
                        key={`vid-${i}`}
                        onClick={() => setSelectedImage(url)}
                        className={`relative w-full aspect-square rounded-xl bg-black border overflow-hidden transition-all group ${selectedImage === url ? 'border-red-500 ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-[#2A344A] opacity-80 hover:opacity-100'}`}
                      >
                        {videoId && <img loading="lazy" src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
                          <Play className="w-6 h-6 md:w-8 md:h-8 text-red-500" fill="currentColor" />
                          <span className="text-[8px] md:text-[10px] text-white font-bold font-mono drop-shadow-md">Watch {i + 1}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Government BIS HUID Verification Box */}
            {product.huid && (
              <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-yellow-500/30 via-[#C5A059] to-yellow-500/30 shadow-[0_0_25px_rgba(197,160,89,0.25)] hover:shadow-[0_0_35px_rgba(197,160,89,0.4)] transition-all duration-500 group overflow-hidden mt-2">
                <div className="relative bg-[#0E1528] rounded-2xl p-6 flex flex-col gap-4 z-10 h-full">
                  <div className="flex justify-between items-center border-b border-[#2A344A] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-40 animate-pulse"></div>
                        <div className="relative w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/50">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[#C5A059] tracking-wider text-sm md:text-base drop-shadow-md">Government BIS HUID</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Verified by Bureau of Indian Standards</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059] to-yellow-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                      <span className="relative text-sm md:text-base font-mono font-bold bg-[#141C33] border border-[#C5A059] text-[#e6b34a] px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-xl uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                        {product.huid}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#141C33] p-4 rounded-xl border-l-4 border-[#C5A059] shadow-inner mt-2">
                    <p className="text-xs text-gray-200 leading-relaxed text-justify">
                      <strong className="text-[#C5A059]">Gold Dunia strictly enforces Bureau of Indian Standards (BIS) hallmarking guidelines.</strong>{' '}
                      Every masterpiece listed by our verified jewelers carries a unique 6-digit alphanumeric HUID code. For complete authenticity and peace of mind, we encourage you to verify this code using the official Government BIS Care App.
                    </p>
                  </div>
                  
                  <div className="flex justify-center items-center gap-4 pt-4 border-t border-[#2A344A]/50 mt-2">
                    <a href="https://play.google.com/store/apps/details?id=com.bis.bisapp" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform drop-shadow-lg">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10 w-auto" />
                    </a>
                    <a href="https://apps.apple.com/in/app/bis-care/id1531633513" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform drop-shadow-lg">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10 w-auto" />
                    </a>
                  </div>
                </div>
              </div>
            )}

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
                <SocialShareButtons 
                  title={product.designName} 
                  description={`Explore the magnificent 22K/24K hallmarked ${product.designName} directly from verified flagship jewelers on Gold Dunia!`} 
                  urlPath={`/product/${product.id}`}
                />
              </div>
            </div>

            {/* Customization 1: Gold Purity */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest font-mono">1. Gold Purity Index</label>
                <span className="text-[10px] text-gray-400 font-mono">Live Showroom Rates</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {selectedPurity === '22K Gold' ? (
                  <div className="p-4 rounded-xl border text-left flex flex-col justify-between transition-all bg-[#141C33] border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.25)]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-white font-mono">22K Hallmarked Gold</span>
                      <span className="w-3 h-3 rounded-full border border-[#C5A059] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                      </span>
                    </div>
                    <span className="text-xs text-[#C5A059] font-mono font-bold">₹ {liveRates?.rate22K.toLocaleString('en-IN')} / gm</span>
                    <span className="text-[10px] text-gray-400 mt-1">91.6% Pure • Best for Durability</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border text-left flex flex-col justify-between transition-all bg-[#141C33] border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.25)]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-white font-mono">24K Pure Sovereign Gold</span>
                      <span className="w-3 h-3 rounded-full border border-[#C5A059] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                      </span>
                    </div>
                    <span className="text-xs text-[#C5A059] font-mono font-bold">₹ {liveRates?.rate24K.toLocaleString('en-IN')} / gm</span>
                    <span className="text-[10px] text-gray-400 mt-1">99.9% Pure • Ultimate Investment</span>
                  </div>
                )}
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

                {(livePrice.huidFee || 0) > 0 && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">3. HUID / Hallmark Charge</span>
                    <span className="text-white font-bold">₹ {livePrice.huidFee?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {(livePrice.stonePrice || 0) > 0 && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">4. Stone / Diamond Value</span>
                    <span className="text-white font-bold">₹ {livePrice.stonePrice?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-[#2A344A]">
                  <span className="text-gray-300 font-sans font-bold">Subtotal Valuation</span>
                  <span className="text-white font-bold">₹ {livePrice.subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 font-sans">Mandatory {shopSettings?.gstRate || 3}% GST</span>
                  <span className="text-yellow-500 font-bold">₹ {livePrice.gst.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2 border-[#C5A059]">
                  <span className="text-[#C5A059] font-serif font-bold text-base">Grand Total (INR)</span>
                  <span className="text-[#C5A059] font-bold text-2xl font-mono">₹ {livePrice.grandTotal.toLocaleString('en-IN')}</span>
                </div>

              </div>

              <div className="pt-2">
                {product.status === 'sold' ? (
                  <div className="bg-[#141C33] border border-red-500/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <span className="text-red-500 font-bold tracking-widest uppercase text-xl font-mono border-b border-red-500/30 pb-2 inline-block">SOLD OUT</span>
                    <p className="text-sm text-gray-400 font-mono leading-relaxed">This specific masterpiece has been claimed. Please keep a close watch, similar items may become available again.</p>
                    <button className="mt-2 w-full py-3 rounded-xl bg-[#2A344A] hover:bg-[#C5A059] hover:text-black text-white font-bold transition-all flex items-center justify-center gap-2 group">
                      <Star className="w-5 h-5 group-hover:fill-black transition-colors" /> Add to Wishlist / Notify Me
                    </button>
                  </div>
                ) : (
                  <WhatsAppContactButton shop={shop} product={product} />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* --- CROSS-SELLING & REVIEWS SECTION --- */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mt-12 border-t border-[#2A344A]">
          {/* Customer Experiences */}
          <div className="mb-16">
            <h3 className="text-2xl font-serif text-[#C5A059] mb-8 flex items-center gap-3">
              <Star className="w-6 h-6 fill-[#C5A059]" /> Customer Experiences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0A1021] p-6 rounded-2xl border border-[#2A344A]">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />)}
                </div>
                <p className="text-sm text-gray-300 italic">"Absolutely breathtaking craftsmanship. The delivery was secure and the HUID was verified perfectly on the app."</p>
                <div className="mt-4 text-xs font-mono text-[#C5A059]">— Verified Buyer</div>
              </div>
              <div className="bg-[#0A1021] p-6 rounded-2xl border border-[#2A344A]">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />)}
                </div>
                <p className="text-sm text-gray-300 italic">"The purity and weight exactly matched the certificate. Very transparent pricing matrix!"</p>
                <div className="mt-4 text-xs font-mono text-[#C5A059]">— Ananya S.</div>
              </div>
              <div className="bg-[#0A1021] p-6 rounded-2xl border border-[#2A344A] flex flex-col justify-center items-center text-center cursor-pointer hover:border-[#C5A059] transition-colors">
                <span className="text-[#C5A059] font-serif">Leave a Review</span>
                <span className="text-xs text-gray-500 mt-2">Purchased from this artisan? Share your experience.</span>
              </div>
            </div>
          </div>

          {/* More from Artisan */}
          {shopProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-2">More from {shop.name}</h3>
                  <p className="text-sm text-gray-400">Discover other masterpieces crafted by this jeweler.</p>
                </div>
                <div className="hidden md:flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-[#2A344A] flex items-center justify-center hover:bg-[#141C33] text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="w-10 h-10 rounded-full border border-[#2A344A] flex items-center justify-center hover:bg-[#141C33] text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 hide-scrollbar">
                {shopProducts.map(p => (
                  <Link href={`/product/${p.id}`} key={p.id} className="snap-start shrink-0 w-[280px] group block">
                    <div className="aspect-square bg-[#0A1021] rounded-2xl overflow-hidden mb-4 border border-[#2A344A] group-hover:border-[#C5A059] transition-colors relative">
                      <Image src={p.images?.[0] || ''} alt={p.designName} fill sizes="280px" className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                    </div>
                    <h4 className="text-white font-serif text-lg group-hover:text-[#C5A059] transition-colors">{p.designName}</h4>
                    <div className="text-sm text-[#C5A059] font-mono mt-1">₹ {p.price?.toLocaleString('en-IN') || '---'}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Similar Masterpieces */}
          {similarProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-serif text-white mb-6">Similar Masterpieces</h3>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 hide-scrollbar">
                {similarProducts.map(p => (
                  <Link href={`/product/${p.id}`} key={p.id} className="snap-start shrink-0 w-[280px] group block">
                    <div className="aspect-square bg-[#0A1021] rounded-2xl overflow-hidden mb-4 border border-[#2A344A] group-hover:border-[#C5A059] transition-colors relative">
                      <Image src={p.images?.[0] || ''} alt={p.designName} fill sizes="280px" className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                    </div>
                    <h4 className="text-white font-serif text-lg group-hover:text-[#C5A059] transition-colors">{p.designName}</h4>
                    <div className="text-sm text-[#C5A059] font-mono mt-1">₹ {p.price?.toLocaleString('en-IN') || '---'}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#0E1528] border-t border-[#C5A059]/30 p-4 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-8">
        <div>
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Grand Total</div>
          <div className="text-[#C5A059] font-bold text-xl font-mono">₹ {livePrice.grandTotal.toLocaleString('en-IN')}</div>
        </div>
        <div className="w-[180px]">
          {product.status === 'sold' ? (
            <button className="w-full py-3 rounded-lg bg-[#2A344A] text-white font-bold text-xs uppercase tracking-widest border border-red-500/30 flex items-center justify-center gap-2">
              <span className="text-red-500">●</span> SOLD OUT
            </button>
          ) : (
            <WhatsAppContactButton shop={shop} product={product} />
          )}
        </div>
      </div>
    </main>
  );
}
