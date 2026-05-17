"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";

export default function CartPage() {
  // Cart Items State
  const [cartItems, setCartItems] = useState([
    {
      id: "CART-1",
      title: "22K Lotus Heritage Necklace",
      vendor: "IRA JEWELS",
      purity: "22K Gold",
      weight: 41.0, // grams
      goldRatePerGm: 6950,
      makingCharges: 8500,
      image: "/diamond_necklace_luxury.png",
      sku: "IRA-NK-001"
    },
    {
      id: "CART-2",
      title: "24K Pure Gold Lakshmi Coin (10g)",
      vendor: "IRA JEWELS",
      purity: "24K Pure Gold",
      weight: 10.0, // grams
      goldRatePerGm: 7138,
      makingCharges: 1000,
      image: "/hero-gold.png",
      sku: "IRA-CN-010"
    }
  ]);

  // Interactive Checkout States
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  
  // Shipping & Insurance Options State
  const [shippingMethod, setShippingMethod] = useState("sequel_secure"); // sequel_secure (₹1500) vs bluedart_express (₹1000)
  const [insuranceOption, setInsuranceOption] = useState("full_bvc"); // full_bvc (0.5%) vs standard (₹500)

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("init"); // init -> otp -> success
  const [bankOtp, setBankOtp] = useState("");

  // Calculation Engine (7-Step Indian Jewelry Pricing Matrix)
  const calculateTotals = () => {
    // 1. Raw Gold Value
    const rawGoldValue = cartItems.reduce((acc, item) => acc + (item.weight * item.goldRatePerGm), 0);
    
    // 2. Making Charges
    const totalMakingCharges = cartItems.reduce((acc, item) => acc + item.makingCharges, 0);
    
    // 3. Subtotal before GST
    const subtotal = rawGoldValue + totalMakingCharges;

    // 4. 3% Mandatory Indian Jewelry GST
    const gstAmount = Math.round(subtotal * 0.03);

    // 5. Secure Shipping Charges
    let shippingCharges = shippingMethod === "sequel_secure" ? 1500 : 1000;
    if (subtotal > 200000) {
       shippingCharges = 0; // Free Premium Transit for orders over ₹2 Lakhs
    }

    // 6. Transit Insurance Charges (e.g. 0.5% of Gold Value or flat rate)
    let insuranceCharges = insuranceOption === "full_bvc" ? Math.round(rawGoldValue * 0.005) : 500;
    if (subtotal > 300000) {
       insuranceCharges = 0; // Complimentary BVC Coverage for orders over ₹3 Lakhs
    }

    // 7. Grand Total
    const grandTotal = subtotal + gstAmount + shippingCharges + insuranceCharges - discountAmount;

    return {
      rawGoldValue,
      totalMakingCharges,
      subtotal,
      gstAmount,
      shippingCharges,
      insuranceCharges,
      grandTotal
    };
  };

  const totals = calculateTotals();

  const handleApplyPromo = () => {
    setPromoError("");
    if (promoCode.toUpperCase() === "SDGOLD5000") {
      setDiscountAmount(5000);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === "FESTIVE10") {
      setDiscountAmount(10000);
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promotional voucher code. Try 'SDGOLD5000'.");
      setDiscountAmount(0);
      setPromoApplied(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleStartPayment = () => {
    if (cartItems.length === 0) return;
    setShowPaymentModal(true);
    setPaymentStep("init");
    setTimeout(() => {
      setPaymentStep("otp");
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (bankOtp.length < 4) {
      alert("Please enter a valid 4-digit or 6-digit Bank OTP.");
      return;
    }
    setPaymentStep("success");
  };

  return (
    <main className="min-h-screen bg-[#060A14] flex flex-col items-center p-0 md:p-8 font-sans text-white">
      
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
            <Link href="/shop" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Shop <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
            <Link href="/auctions" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Auctions <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
            
            <UserDropdown />
            
            <div className="flex items-center gap-2 text-white ml-2 bg-[#C5A059] text-[#0A1021] border border-[#C5A059] px-4 py-2 rounded-full shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="text-xs font-bold uppercase tracking-widest">Bag</span>
              <span className="bg-[#0A1021] text-[#C5A059] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cartItems.length}</span>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="p-4 md:p-8 flex flex-col gap-8">
          
          {/* Title Banner */}
          <div className="bg-gradient-to-r from-[#141C33] via-[#0E1528] to-[#141C33] border border-[#C5A059]/40 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(197,160,89,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">Secure Requisition Checkout</span>
              <h1 className="text-2xl md:text-4xl font-serif text-[#C5A059] tracking-wider mt-3 mb-2 font-bold">Sovereign Shopping Bag</h1>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl leading-relaxed">Review your luxury jewelry selections. All requisitions include mandatory BIS Hallmarked Authenticity Certificates, 100% transit insurance, and armored courier dispatch.</p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest">Active Bag Valuation</span>
               <span className="text-xl font-bold text-[#C5A059] font-mono">₹ {totals.grandTotal.toLocaleString('en-IN')}</span>
               <span className="text-[9px] text-green-400 flex items-center gap-1 mt-1">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 100% Insured Transit
               </span>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 border border-[#2A344A] rounded-2xl bg-[#0E1528]/50 backdrop-blur-sm text-center px-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#141C33] flex items-center justify-center text-[#C5A059] border border-[#2A344A]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="text-xl font-serif text-[#C5A059]">Your Secure Shopping Bag is Empty</h3>
              <p className="text-xs text-gray-400 max-w-md">Explore our sovereign catalog of authenticated 22K and 24K gold masterpieces to add items to your requisition bag.</p>
              <Link href="/shop" className="mt-2 bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white transition-colors shadow">
                Explore Sovereign Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Cart Items & Shipping/Insurance Config */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Cart Items List */}
                <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl overflow-hidden shadow-xl divide-y divide-[#2A344A]">
                  <div className="p-6 bg-[#0A1021] flex justify-between items-center">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <span>Requisition Bag Items</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#141C33] text-[#C5A059] border border-[#2A344A]">{cartItems.length}</span>
                    </h2>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Live Spree Commerce Sync</span>
                  </div>

                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-[#141C33]/30 transition-colors">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-20 h-20 rounded-xl bg-black border border-[#2A344A] relative overflow-hidden flex-shrink-0 shadow-lg">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{item.vendor}</span>
                          <h3 className="text-white text-base font-bold mb-1 group-hover:text-[#C5A059] transition-colors">{item.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                            <span>SKU: <strong className="text-white">{item.sku}</strong></span>
                            <span>Weight: <strong className="text-white">{item.weight}g</strong></span>
                            <span className="text-[#C5A059]">{item.purity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#2A344A]">
                        <div className="flex flex-col text-left md:text-right font-mono">
                          <span className="text-sm font-bold text-white">₹ {(item.weight * item.goldRatePerGm + item.makingCharges).toLocaleString('en-IN')}</span>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Gold: ₹{(item.weight * item.goldRatePerGm).toLocaleString('en-IN')} + Making: ₹{item.makingCharges.toLocaleString('en-IN')}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-[#2A344A] transition-colors shadow"
                          title="Remove from Bag"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Secure Shipping & Transit Insurance Options */}
                <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 border-b border-[#2A344A] pb-4">
                    <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
                    Secure Transit & Armored Courier Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Shipping Method */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block">1. Armored Shipping Partner</label>
                      
                      <div 
                        onClick={() => setShippingMethod("sequel_secure")}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${shippingMethod === 'sequel_secure' ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" checked={shippingMethod === 'sequel_secure'} onChange={() => {}} className="accent-[#C5A059]" />
                          <div>
                            <span className="text-xs font-bold text-white block">Sequel Secure Logistics</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Armored Van Transit (1-2 Days)</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#C5A059]">{totals.subtotal > 200000 ? "FREE" : "₹ 1,500"}</span>
                      </div>

                      <div 
                        onClick={() => setShippingMethod("bluedart_express")}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${shippingMethod === 'bluedart_express' ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" checked={shippingMethod === 'bluedart_express'} onChange={() => {}} className="accent-[#C5A059]" />
                          <div>
                            <span className="text-xs font-bold text-white block">Bluedart Secure Gold Express</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Air Express Priority (2-3 Days)</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#C5A059]">{totals.subtotal > 200000 ? "FREE" : "₹ 1,000"}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 italic">💡 Premium shipping is automatically FREE for requisitions over ₹2 Lakhs.</span>
                    </div>

                    {/* Insurance Option */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block">2. Transit Insurance Coverage</label>
                      
                      <div 
                        onClick={() => setInsuranceOption("full_bvc")}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${insuranceOption === 'full_bvc' ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" checked={insuranceOption === 'full_bvc'} onChange={() => {}} className="accent-[#C5A059]" />
                          <div>
                            <span className="text-xs font-bold text-white block">BVC Full Value Protection (0.5%)</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">100% Coverage against Loss or Theft</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#C5A059]">{totals.subtotal > 300000 ? "FREE" : `₹ ${Math.round(totals.rawGoldValue * 0.005).toLocaleString('en-IN')}`}</span>
                      </div>

                      <div 
                        onClick={() => setInsuranceOption("standard")}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${insuranceOption === 'standard' ? 'bg-[#141C33] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#0A1021] border-[#2A344A] hover:border-[#C5A059]/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" checked={insuranceOption === 'standard'} onChange={() => {}} className="accent-[#C5A059]" />
                          <div>
                            <span className="text-xs font-bold text-white block">Standard Courier Indemnity</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Basic Transit Liability Coverage</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#C5A059]">{totals.subtotal > 300000 ? "FREE" : "₹ 500"}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 italic">💡 Full BVC Insurance is automatically FREE for requisitions over ₹3 Lakhs.</span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Right Column: 7-Step Pricing Matrix & Checkout Trigger */}
              <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 flex flex-col gap-6 shadow-2xl sticky top-28">
                
                <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-[#2A344A] pb-4 flex items-center justify-between">
                  <span>7-Step Pricing Matrix</span>
                  <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/30">Live Spree Rates</span>
                </h3>

                {/* Promo Code Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Promotional Voucher / Coupon</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. SDGOLD5000" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-2.5 flex-1 focus:outline-none focus:border-[#C5A059] uppercase font-mono"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="bg-[#141C33] border border-[#2A344A] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && <span className="text-[10px] text-green-400 font-bold mt-1">✓ Voucher applied successfully! (₹{discountAmount.toLocaleString('en-IN')} Off)</span>}
                  {promoError && <span className="text-[10px] text-red-400 font-bold mt-1">{promoError}</span>}
                </div>

                {/* 7-Step Breakdown Table */}
                <div className="flex flex-col gap-3 font-mono text-xs divide-y divide-[#2A344A]/50 bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner">
                  
                  {/* Step 1: Gold Value */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">1. Raw Gold Value</span>
                    <span className="text-white font-bold">₹ {totals.rawGoldValue.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Step 2: Making Charges */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">2. Total Making Charges</span>
                    <span className="text-white font-bold">₹ {totals.totalMakingCharges.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Step 3: Subtotal */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#2A344A]">
                    <span className="text-gray-300 font-sans font-bold">3. Subtotal (Before Tax)</span>
                    <span className="text-white font-bold">₹ {totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Step 4: GST */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">4. Mandatory 3% GST</span>
                    <span className="text-yellow-500 font-bold">₹ {totals.gstAmount.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Step 5: Shipping Charges */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">5. Armored Shipping Charges</span>
                    <span className="text-white font-bold">{totals.shippingCharges === 0 ? <span className="text-green-400 font-bold">FREE</span> : `₹ ${totals.shippingCharges.toLocaleString('en-IN')}`}</span>
                  </div>

                  {/* Step 6: Insurance Charges */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-sans">6. BVC Transit Insurance</span>
                    <span className="text-white font-bold">{totals.insuranceCharges === 0 ? <span className="text-green-400 font-bold">FREE</span> : `₹ ${totals.insuranceCharges.toLocaleString('en-IN')}`}</span>
                  </div>

                  {/* Discount if applied */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center pt-2 text-green-400 font-bold">
                      <span className="font-sans">Promotional Voucher Discount</span>
                      <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Step 7: Grand Total */}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-[#C5A059]">
                    <span className="text-[#C5A059] font-serif font-bold text-sm">7. Grand Total (INR)</span>
                    <span className="text-[#C5A059] font-bold text-lg">₹ {totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                </div>

                {/* Checkout Button */}
                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={handleStartPayment}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
                    Proceed to Secure Payment (Razorpay / Stripe)
                  </button>
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest pt-1">
                     <span className="flex items-center gap-1">🔒 256-Bit SSL</span>
                     <span>•</span>
                     <span className="flex items-center gap-1">🏦 Bank OTP Verified</span>
                     <span>•</span>
                     <span className="flex items-center gap-1">🛡️ BVC Insured</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Payment Gateway OTP ModalOverlay */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0A1021] border border-[#C5A059] rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.25)] w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              
              <div className="p-6 border-b border-[#2A344A] bg-[#0E1528] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
                    <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-serif text-[#C5A059] tracking-wider font-bold">Secure Bank Gateway</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Razorpay / Stripe 256-Bit Encryption</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-white border border-[#2A344A] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="p-8 flex flex-col items-center justify-center gap-6 text-center">
                {paymentStep === "init" ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                    <h4 className="text-white font-bold text-sm">Establishing Secure Bank Handshake...</h4>
                    <p className="text-xs text-gray-400 max-w-xs">Connecting to Razorpay secure servers to initialize 3D Secure OTP authorization.</p>
                  </div>
                ) : paymentStep === "otp" ? (
                  <div className="flex flex-col items-center gap-4 w-full py-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-[#141C33] flex items-center justify-center text-[#C5A059] border border-[#2A344A] shadow-inner mb-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <h4 className="text-white font-bold text-base">Enter Bank Authorization OTP</h4>
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                      We have dispatched a 6-digit One Time Password (OTP) to your registered mobile number for the payment of <strong className="text-[#C5A059]">₹ {totals.grandTotal.toLocaleString('en-IN')}</strong>.
                    </p>
                    <div className="w-full max-w-xs flex flex-col gap-2 mt-2">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="••••••" 
                        value={bankOtp}
                        onChange={(e) => setBankOtp(e.target.value)}
                        className="bg-[#141C33] border border-[#2A344A] text-white text-center text-xl tracking-[1em] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono"
                      />
                      <button 
                        onClick={handleVerifyOtp}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg mt-2"
                      >
                        Authorize & Place Requisition
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-6 animate-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/40 shadow-lg mb-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h4 className="text-white font-serif font-bold text-xl text-[#C5A059]">Requisition Authorized Successfully!</h4>
                    <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                      Your payment of <strong className="text-white">₹ {totals.grandTotal.toLocaleString('en-IN')}</strong> has been securely captured. Your order has been logged into the Railway Spree Commerce engine and dispatched to <strong className="text-[#C5A059]">IRA JEWELS</strong> for fulfillment.
                    </p>
                    <div className="bg-[#141C33] border border-[#2A344A] p-4 rounded-xl w-full flex flex-col gap-1 text-left font-mono text-xs mt-2">
                       <span className="text-gray-400">Order ID: <strong className="text-white">ORD-{Math.floor(Math.random() * 8000 + 1000)}</strong></span>
                       <span className="text-gray-400">Armored Courier: <strong className="text-[#C5A059]">Sequel Secure Logistics</strong></span>
                       <span className="text-gray-400">BIS Certificate: <strong className="text-green-400">Generated (HUID Verified)</strong></span>
                    </div>
                    <Link href="/vendor/orders" className="w-full py-3.5 rounded-xl bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg mt-2 block">
                      Track in Vendor Command Center
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-[#2A344A] bg-[#0E1528] pt-16 pb-8 px-8 lg:px-16 rounded-b-xl mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/sd_logo_final.png" alt="Logo" width={48} height={48} className="object-contain" />
                <div>
                  <h3 className="text-xl font-serif text-[#C5A059] font-bold leading-none whitespace-nowrap">Shyam Dash</h3>
                  <span className="text-[9px] text-[#C5A059]/70 uppercase tracking-widest whitespace-nowrap">India's Verified Gold Marketplace.</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                The premier luxury marketplace for authenticated, hallmarked jewelry. Partnering exclusively with the finest jewelers across India.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-[#C5A059] transition-colors">Our Vendor Network</Link></li>
                <li><Link href="/shop" className="hover:text-[#C5A059] transition-colors">Verified Catalog</Link></li>
                <li><Link href="/auctions" className="hover:text-[#C5A059] transition-colors">Live Auctions</Link></li>
                <li><Link href="/accounts" className="hover:text-[#C5A059] transition-colors">Universal SSO Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Customer Care</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Authentication Guide</Link></li>
                <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Secure Shipping</Link></li>
                <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Return Policy</Link></li>
                <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">Subscribe for daily live rates and exclusive new collections.</p>
              <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-[#141C33] border border-[#2A344A] text-white text-sm rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-[#C5A059] transition-colors" />
                <button className="bg-[#C5A059] text-black text-sm font-bold px-4 py-2 rounded-r-md hover:bg-white transition-colors">JOIN</button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A344A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2026 Shyam Dash Creation. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-[#C5A059] transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#C5A059] transition-colors">Terms of Service</Link>
              <span className="flex items-center gap-1">Powered by <span className="text-[#C5A059] font-bold">SD Digital</span></span>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
