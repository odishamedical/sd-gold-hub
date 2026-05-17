"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";

export default function AccountsPage() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>({
    orderId: "ORD-7892",
    status: "IN_TRANSIT",
    courier: "Sequel Secure Logistics",
    trackingNumber: "SQL-8492019",
    estimatedDelivery: "May 20, 2026 - By 18:00 IST",
    currentLocation: "Armored Transit Facility - Mumbai Hub",
    items: [
      { title: "22K Lotus Heritage Necklace", purity: "22K Hallmarked Gold", weight: "41.0 g", price: "₹ 2,85,000" }
    ],
    bisCertificateGenerated: true,
    bvcInsured: true
  });
  const [searched, setSearched] = useState(true);

  // User Profile Form State (Persistent Gmail Session)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [pushNotifications, setPushNotifications] = useState(true);

  const checkAccountAuth = () => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("sd_current_user_email");
      const storedName = localStorage.getItem("sd_current_user_name");
      const storedAvatar = localStorage.getItem("sd_current_user_avatar");
      const storedMobile = localStorage.getItem("sd_current_user_mobile") || "";
      const storedAddress = localStorage.getItem("sd_current_user_address") || "";

      if (storedEmail) {
        setCurrentUserEmail(storedEmail);
        if (storedName) setFullName(storedName);
        if (storedAvatar) setCurrentUserAvatar(storedAvatar);
        setMobileNumber(storedMobile);
        setShippingAddress(storedAddress);
      } else {
        setCurrentUserEmail(null);
        setCurrentUserAvatar(null);
        setFullName("");
        setMobileNumber("");
        setShippingAddress("");
      }
    }
  };

  useEffect(() => {
    checkAccountAuth();
    window.addEventListener("sd_auth_change", checkAccountAuth);
    return () => {
      window.removeEventListener("sd_auth_change", checkAccountAuth);
    };
  }, []);

  const handleTrackOrder = () => {
    setSearched(true);
    if (!orderIdInput) {
      setTrackingResult(null);
      return;
    }

    if (orderIdInput.toUpperCase().startsWith("ORD-")) {
      setTrackingResult({
        orderId: orderIdInput.toUpperCase(),
        status: "IN_TRANSIT",
        courier: "Sequel Secure Logistics",
        trackingNumber: `SQL-${Math.floor(Math.random() * 8000000 + 1000000)}`,
        estimatedDelivery: "May 22, 2026 - By 17:00 IST",
        currentLocation: "Armored Transit Checkpoint - Regional Vault",
        items: [
          { title: "24K Pure Gold Lakshmi Coin (10g)", purity: "24K Pure Gold", weight: "10.0 g", price: "₹ 71,385" }
        ],
        bisCertificateGenerated: true,
        bvcInsured: true
      });
    } else {
      setTrackingResult(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) {
      alert("⚠️ Please Sign In with Gmail first before saving your profile preferences.");
      return;
    }
    localStorage.setItem("sd_current_user_name", fullName);
    localStorage.setItem("sd_current_user_mobile", mobileNumber);
    localStorage.setItem("sd_current_user_address", shippingAddress);
    window.dispatchEvent(new Event("sd_auth_change"));
    alert(`👤 Sovereign Profile Updated Successfully!\n\nName: ${fullName}\nMobile: ${mobileNumber}\nAddress: ${shippingAddress}\nPush Notifications: ${pushNotifications ? 'ACTIVE' : 'MUTED'}\n\nYour profile changes have been synchronized with your persistent Gmail session (${currentUserEmail}).`);
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
            
            <Link href="/cart" className="flex items-center gap-2 text-white ml-2 bg-[#141C33] border border-[#2A344A] px-4 py-2 rounded-full hover:border-[#C5A059] transition-all">
              <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="text-xs font-bold uppercase tracking-widest">Bag</span>
              <span className="bg-[#C5A059] text-[#0A1021] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </Link>
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="p-4 md:p-8 flex flex-col gap-12">
          
          {/* Title Banner */}
          <div className="bg-gradient-to-r from-[#141C33] via-[#0E1528] to-[#141C33] border border-[#C5A059]/40 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(197,160,89,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">Persistent Gmail Session & Armored Ledger</span>
              <h1 className="text-2xl md:text-4xl font-serif text-[#C5A059] tracking-wider mt-3 mb-2 font-bold">Sovereign User Profile & History</h1>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl leading-relaxed">Manage your persistent Google Gmail authentication session, track Sequel Armored transit requisitions, and configure live push notification preferences.</p>
            </div>
            <div className="flex items-center gap-4 bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner w-full md:w-auto font-sans">
               {currentUserAvatar ? (
                 <img src={currentUserAvatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)] shrink-0" />
               ) : (
                 <div className="w-12 h-12 rounded-full bg-[#141C33] border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-bold text-lg font-mono shrink-0">
                   {currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : "G"}
                 </div>
               )}
               <div className="flex flex-col gap-0.5 overflow-hidden">
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Google OAuth Handshake</span>
                 <span className={`text-base font-bold flex items-center gap-2 ${currentUserEmail ? 'text-green-400' : 'text-yellow-400'}`}>
                   <span className={`w-2 h-2 rounded-full animate-pulse ${currentUserEmail ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                   {currentUserEmail ? fullName : 'Guest Mode'}
                 </span>
                 <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                   {currentUserEmail || 'Please Sign In with Google'}
                 </span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Customer Order Tracking Engine & History */}
            <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group hover:border-[#C5A059]/50 transition-colors">
              <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <h2 className="text-xl font-serif text-[#C5A059] font-bold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
                  Requisition Tracking & Active Ledger
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Verify live Armored Van GPS tracking, BVC Insurance indemnity, and download official BIS Hallmarking documentation for your active orders.
                </p>
              </div>

              {/* Lookup Form */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Order ID (e.g. ORD-7892)..." 
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="bg-[#141C33] border border-[#2A344A] text-white text-sm rounded-xl px-4 py-3 flex-1 focus:outline-none focus:border-[#C5A059] font-mono tracking-wider uppercase"
                  />
                  <button 
                    onClick={handleTrackOrder}
                    className="bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg"
                  >
                    Verify Status
                  </button>
                </div>
              </div>

              {/* Tracking Results Display */}
              {searched && (
                <div className="animate-in fade-in duration-300 border-t border-[#2A344A] pt-6">
                  {trackingResult ? (
                    <div className="bg-[#0A1021] border border-[#2A344A] rounded-xl p-6 flex flex-col gap-6 shadow-inner">
                      
                      {/* Status Header */}
                      <div className="flex justify-between items-center border-b border-[#2A344A] pb-4">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-0.5 font-mono">Requisition Reference</span>
                          <span className="text-white font-mono font-bold text-base">{trackingResult.orderId}</span>
                        </div>
                        <span className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full font-mono flex items-center gap-1.5 animate-pulse">
                          <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                          Armored Transit
                        </span>
                      </div>

                      {/* Logistics Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="bg-[#141C33] border border-[#2A344A] p-3 rounded-lg flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Armored Partner</span>
                          <span className="text-white font-bold">{trackingResult.courier}</span>
                          <span className="text-[#C5A059] text-[10px]">AWB: {trackingResult.trackingNumber}</span>
                        </div>
                        <div className="bg-[#141C33] border border-[#2A344A] p-3 rounded-lg flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Est. Armored Delivery</span>
                          <span className="text-white font-bold">{trackingResult.estimatedDelivery}</span>
                          <span className="text-green-400 text-[10px]">Mandatory OTP Required</span>
                        </div>
                      </div>

                      {/* GPS & Documents */}
                      <div className="flex flex-col gap-3 text-xs">
                        <div className="flex items-center gap-2 bg-[#141C33] border border-[#2A344A] p-3 rounded-lg">
                          <span className="text-blue-400 animate-ping">📍</span>
                          <span className="text-gray-300 font-mono">Current Checkpoint: <strong className="text-white">{trackingResult.currentLocation}</strong></span>
                        </div>

                        <div className="flex justify-between items-center bg-[#141C33] border border-[#2A344A] p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                             <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="text-gray-300 font-mono">BIS Hallmarking Certificate</span>
                          </div>
                          <button 
                            onClick={() => alert(`📄 Downloading Official Government BIS Hallmarking Certificate for ${trackingResult.orderId}...\n\nHUID Authenticated. Verified by Shyam Dash Master Registry.`)}
                            className="text-[#C5A059] hover:text-white font-bold font-mono underline text-[10px] uppercase tracking-widest"
                          >
                            Download PDF
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-[#141C33] border border-[#2A344A] rounded-xl p-6 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/30 mb-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      </div>
                      <h3 className="text-white font-bold text-sm">Requisition Reference Not Found</h3>
                      <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                        We could not locate an active requisition matching <strong className="text-[#C5A059]">{orderIdInput}</strong>. Please ensure you entered the exact 10-character Order ID (e.g. ORD-7892).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Order History Summary List */}
              <div className="border-t border-[#2A344A] pt-6 flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Archived Requisitions</h3>
                <div className="bg-[#141C33] border border-[#2A344A] p-4 rounded-xl flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-[#C5A059] font-bold block">ORD-6541</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">24K Pure Gold Bullion Coin (50g)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-bold block">DELIVERED</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">April 12, 2026</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Sovereign Gmail Authentication & Profile Details */}
            <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group hover:border-[#C5A059]/50 transition-colors">
              <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <h2 className="text-xl font-serif text-[#C5A059] font-bold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Sovereign Profile & Notification Center
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your identity is permanently verified via your secure Google Gmail session. <strong className="text-[#C5A059]">Please fill up your 10-digit mobile number and complete insured shipping address below</strong> to enable Sequel Armored Transit OTP verification and secure delivery.
                </p>
              </div>

              {/* Profile Management Form */}
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 font-mono text-xs">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 uppercase tracking-widest text-[10px]">Google Gmail ID (Non-Editable)</label>
                  <input 
                    type="text" 
                    disabled
                    value={currentUserEmail || "Guest Mode - Not Signed In"} 
                    className="bg-[#141C33]/50 border border-[#2A344A] text-gray-500 text-xs rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed font-bold tracking-wider"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 uppercase tracking-widest text-[10px]">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Please enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] tracking-wider"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 uppercase tracking-widest text-[10px]">Mobile Number (For Sequel Armored OTP)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. +91 98765 43210 (Please enter your 10-digit mobile number)"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] tracking-wider placeholder:text-gray-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 uppercase tracking-widest text-[10px]">Primary Armored Shipping Address</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="e.g. 702, Sea Breeze Towers, Marine Drive, Mumbai - 400020 (Please enter your complete street address, landmark, city, and PIN code)"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl p-4 focus:outline-none focus:border-[#C5A059] tracking-wider leading-relaxed placeholder:text-gray-600"
                  />
                </div>

                {/* Push Notification Toggle */}
                <div className="bg-[#141C33] border border-[#2A344A] p-4 rounded-xl flex items-center justify-between mt-2 shadow-inner">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="text-[#C5A059]">🔔</span> Live Push Notifications
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans">Receive instant alerts for gold rate drops & new artisan curations.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${pushNotifications ? 'bg-[#C5A059]' : 'bg-gray-600'}`}
                  >
                    <div className={`bg-[#0A1021] w-4 h-4 rounded-full shadow-md transform transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-4 font-sans cursor-pointer"
                >
                  Save Profile & Notification Preferences
                </button>
              </form>

              {/* Benefits Ledger */}
              <div className="bg-[#141C33] border border-[#2A344A] p-5 rounded-xl flex flex-col gap-3 shadow-inner mt-2 font-sans">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#C5A059]">🛡️</span> Sovereign Member Privileges
                </h4>
                <div className="flex flex-col gap-2 text-[11px] text-gray-400 leading-relaxed divide-y divide-[#2A344A]">
                  <p className="pt-1 first:pt-0"><strong>1. Express Armored Checkout:</strong> Auto-fill saved addresses for Sequel Logistics transit.</p>
                  <p className="pt-2"><strong>2. Digital Vault Archive:</strong> Permanent cloud storage of all your BIS HUID certificates and BVC Insurance invoices.</p>
                  <p className="pt-2"><strong>3. Priority Allocation:</strong> Advance 48-hour access to exclusive master artisan collections and live heritage auctions.</p>
                </div>
              </div>

              {/* Discreet / Invisible Admin Gateway Anchor */}
              <div className="pt-2 flex justify-end">
                <Link 
                  href="https://sd-auth-center.vercel.app/launcher" 
                  className="text-[9px] text-[#0E1528] hover:text-gray-600 transition-colors tracking-widest font-mono"
                  title="Internal Ecosystem Gateway"
                >
                  π
                </Link>
              </div>

            </div>

          </div>

        </div>

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
