"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuctionsPage() {
  const [filterTab, setFilterTab] = useState("active"); // active vs upcoming vs closed
  const [selectedAuction, setSelectedAuction] = useState<any | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [bidderPhone, setBidderPhone] = useState("");

  // Live Auctions State
  const [auctionsList, setAuctionsList] = useState([
    {
      id: "AUC-101",
      title: "Antique Chola Dynasty Temple Choker",
      vendor: "IRA JEWELS",
      purity: "22K Hallmarked Gold",
      weight: "142.5 g",
      estValue: "₹ 15,00,000",
      currentBid: 1180000,
      displayCurrentBid: "₹ 11,80,000",
      totalBids: 18,
      timeLeft: "01:22:45",
      minIncrement: 10000,
      image: "/diamond_necklace_luxury.png",
      status: "active",
      history: [
        { name: "Rajesh S.", amount: "₹ 11,80,000", time: "10 mins ago" },
        { name: "Vikram R.", amount: "₹ 11,50,000", time: "25 mins ago" },
        { name: "Anjali M.", amount: "₹ 11,20,000", time: "1 hour ago" }
      ]
    },
    {
      id: "AUC-102",
      title: "Nizam Heritage Royal Diamond Brooch",
      vendor: "JEWELLERY WORLD",
      purity: "18K Gold + Uncut Diamonds",
      weight: "78.0 g",
      estValue: "₹ 22,50,000",
      currentBid: 1850000,
      displayCurrentBid: "₹ 18,50,000",
      totalBids: 32,
      timeLeft: "03:45:10",
      minIncrement: 25000,
      image: "/hero-gold.png",
      status: "active",
      history: [
        { name: "Priya D.", amount: "₹ 18,50,000", time: "3 mins ago" },
        { name: "Amitabh K.", amount: "₹ 18,00,000", time: "42 mins ago" }
      ]
    },
    {
      id: "AUC-103",
      title: "24K Solid Gold Sovereign Brick (100g)",
      vendor: "DWARIKA JEWELLERS",
      purity: "24K Pure Gold (999.9)",
      weight: "100.0 g",
      estValue: "₹ 7,50,000",
      currentBid: 725000,
      displayCurrentBid: "₹ 7,25,000",
      totalBids: 45,
      timeLeft: "00:15:30",
      minIncrement: 5000,
      image: "/gold_bangle_luxury.png",
      status: "active",
      history: [
        { name: "Suresh P.", amount: "₹ 7,25,000", time: "1 min ago" },
        { name: "Manoj V.", amount: "₹ 7,20,000", time: "5 mins ago" }
      ]
    },
    {
      id: "AUC-104",
      title: "Royal Rajputana Jadau Bangle Pair",
      vendor: "NEW JEWELLERY WORLD",
      purity: "22K Gold + Emeralds",
      weight: "95.4 g",
      estValue: "₹ 9,80,000",
      currentBid: 850000,
      displayCurrentBid: "₹ 8,50,000",
      totalBids: 12,
      timeLeft: "Starts in 2 Days",
      minIncrement: 10000,
      image: "/gold_bangle_luxury.png",
      status: "upcoming",
      history: []
    },
    {
      id: "AUC-105",
      title: "Maharaja Diamond Crest Ear Cuff",
      vendor: "IRA JEWELS",
      purity: "18K White Gold + Diamonds",
      weight: "34.2 g",
      estValue: "₹ 6,50,000",
      currentBid: 710000,
      displayCurrentBid: "₹ 7,10,000",
      totalBids: 28,
      timeLeft: "Auction Closed",
      minIncrement: 5000,
      image: "/diamond_necklace_luxury.png",
      status: "closed",
      history: [
        { name: "Kareena K.", amount: "₹ 7,10,000", time: "Closed (Winner)" }
      ]
    }
  ]);

  const filteredAuctions = auctionsList.filter(auc => auc.status === filterTab);

  const handleOpenBidModal = (auction: any) => {
    setSelectedAuction(auction);
    setBidAmount((auction.currentBid + auction.minIncrement).toString());
    setBidderName("");
    setBidderPhone("");
  };

  const handlePlaceBid = () => {
    const numBid = parseFloat(bidAmount);
    if (isNaN(numBid) || numBid < (selectedAuction.currentBid + selectedAuction.minIncrement)) {
      alert(`Minimum bid increment is ₹ ${selectedAuction.minIncrement.toLocaleString('en-IN')}.\nPlease place a bid of at least ₹ ${(selectedAuction.currentBid + selectedAuction.minIncrement).toLocaleString('en-IN')}.`);
      return;
    }
    if (!bidderName || !bidderPhone) {
      alert("Please enter your Name and Mobile Number to authorize your bid.");
      return;
    }

    // Update live state
    const updated = auctionsList.map(auc => {
      if (auc.id === selectedAuction.id) {
        return {
          ...auc,
          currentBid: numBid,
          displayCurrentBid: `₹ ${numBid.toLocaleString('en-IN')}`,
          totalBids: auc.totalBids + 1,
          history: [
            { name: bidderName, amount: `₹ ${numBid.toLocaleString('en-IN')}`, time: "Just now" },
            ...auc.history
          ]
        };
      }
      return auc;
    });

    setAuctionsList(updated);
    alert(`🎉 Bid of ₹ ${numBid.toLocaleString('en-IN')} placed successfully on ${selectedAuction.title}!\n\nWe have dispatched an SMS confirmation to ${bidderPhone}. You are currently the highest bidder!`);
    setSelectedAuction(null);
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
            <Link href="/auctions" className="text-[#C5A059] font-bold transition-colors flex items-center gap-1">Auctions <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
            <Link href="/accounts" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Accounts <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></Link>
            
            <Link href="/cart" className="flex items-center gap-2 text-white ml-4 bg-[#141C33] border border-[#2A344A] px-4 py-2 rounded-full hover:border-[#C5A059] transition-all">
              <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.6(Math.random() * 200) + 10"></path></svg>
              <span className="text-xs font-bold uppercase tracking-widest">Bag</span>
              <span className="bg-[#C5A059] text-[#0A1021] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </Link>
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="p-4 md:p-8 flex flex-col gap-8">
          
          {/* Title Banner */}
          <div className="bg-gradient-to-r from-[#141C33] via-[#0E1528] to-[#141C33] border border-[#C5A059]/40 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(197,160,89,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/30">High-Society Heritage Bidding</span>
              <h1 className="text-2xl md:text-4xl font-serif text-[#C5A059] tracking-wider mt-3 mb-2 font-bold">Sovereign Live Auctions</h1>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl leading-relaxed">Acquire rare Indian heritage masterpieces, antique temple jewelry, and sovereign gold bullion through our secure, real-time encrypted bidding engine.</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto bg-[#0A1021] border border-[#2A344A] p-1.5 rounded-xl shadow-inner">
               <button 
                 onClick={() => setFilterTab("active")}
                 className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterTab === 'active' ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
               >
                 Active Bidding (3)
               </button>
               <button 
                 onClick={() => setFilterTab("upcoming")}
                 className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterTab === 'upcoming' ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
               >
                 Upcoming (1)
               </button>
               <button 
                 onClick={() => setFilterTab("closed")}
                 className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterTab === 'closed' ? 'bg-[#C5A059] text-[#0A1021] shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'text-gray-400 hover:text-white hover:bg-[#141C33]'}`}
               >
                 Closed Curations (1)
               </button>
            </div>
          </div>

          {/* Auctions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Columns: Auction Cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {filteredAuctions.length === 0 ? (
                <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-[#141C33] flex items-center justify-center text-[#C5A059] border border-[#2A344A]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-serif text-[#C5A059]">No {filterTab} Auctions Currently</h3>
                  <p className="text-xs text-gray-400 max-w-md">There are no heritage curations matching this status at the moment. Please check back soon or explore our active bidding vault.</p>
                </div>
              ) : (
                filteredAuctions.map((auction) => (
                  <div key={auction.id} className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl group hover:border-[#C5A059] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Image & Basic Specs */}
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-black border border-[#2A344A] relative overflow-hidden flex-shrink-0 shadow-2xl">
                        <Image src={auction.image} alt={auction.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                        <span className="absolute top-2 left-2 bg-[#141C33]/90 border border-[#C5A059]/40 text-[#C5A059] text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-md font-mono">
                          {auction.id}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">{auction.vendor}</span>
                        <h3 className="text-white text-lg font-bold mb-2 group-hover:text-[#C5A059] transition-colors leading-snug">{auction.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mb-3">
                          <span>Weight: <strong className="text-white">{auction.weight}</strong></span>
                          <span>•</span>
                          <span className="text-[#C5A059]">{auction.purity}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Est. Valuation: {auction.estValue}</span>
                      </div>
                    </div>

                    {/* Bidding Controls & Timer */}
                    <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-[#2A344A]">
                      <div className="bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl text-left md:text-right w-full md:w-auto shadow-inner">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Current Highest Bid</span>
                        <span className="text-[#C5A059] text-2xl font-bold font-mono block">{auction.displayCurrentBid}</span>
                        <span className="text-[10px] text-gray-400 block mt-1 font-mono">{auction.totalBids} Bids Placed</span>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-1.5 text-xs font-mono bg-[#141C33] border border-[#2A344A] px-3 py-2 rounded-xl text-yellow-400 shadow">
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span>{auction.timeLeft}</span>
                        </div>

                        {auction.status === "active" && (
                          <button 
                            onClick={() => handleOpenBidModal(auction)}
                            className="bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center gap-1"
                          >
                            <span>Place Instant Bid</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </button>
                        )}
                        {auction.status === "upcoming" && (
                          <button disabled className="bg-[#141C33] text-gray-500 border border-[#2A344A] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl cursor-not-allowed">
                            Bidding Opens Soon
                          </button>
                        )}
                        {auction.status === "closed" && (
                          <button disabled className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl cursor-not-allowed">
                            Auction Closed
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Right Column: Live Bidding History & Rules */}
            <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 flex flex-col gap-6 shadow-2xl sticky top-28">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-[#2A344A] pb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Live Bidding Ledger
              </h3>

              <div className="flex flex-col gap-4 font-mono text-xs divide-y divide-[#2A344A]/50 bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
                {auctionsList[0].history.map((hist, hIdx) => (
                  <div key={hIdx} className="flex justify-between items-center pt-3 first:pt-0">
                    <div className="flex flex-col">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                        {hist.name}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-0.5">{hist.time}</span>
                    </div>
                    <span className="text-[#C5A059] font-bold text-sm">{hist.amount}</span>
                  </div>
                ))}
              </div>

              {/* Auction Rules */}
              <div className="bg-[#141C33] border border-[#2A344A] p-5 rounded-xl flex flex-col gap-3 text-xs leading-relaxed text-gray-300">
                 <h4 className="font-bold text-[#C5A059] uppercase tracking-widest text-[10px] flex items-center gap-1">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   Sovereign Auction Terms
                 </h4>
                 <p>1. All bids are legally binding requisitions under Indian E-Commerce Jurisdiction.</p>
                 <p>2. Each bid must exceed the previous highest bid by the mandatory minimum increment.</p>
                 <p>3. Winning bidders receive an immediate payment link with 100% BVC Insured Courier dispatch upon settlement.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Place Bid ModalOverlay */}
        {selectedAuction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0A1021] border border-[#C5A059] rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.25)] w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              
              <div className="p-6 border-b border-[#2A344A] bg-[#0E1528] flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-serif text-[#C5A059] tracking-wider font-bold">Authorize Sovereign Bid</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{selectedAuction.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedAuction(null)}
                  className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-white border border-[#2A344A] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="p-8 flex flex-col gap-6">
                
                {/* Current Bid Summary */}
                <div className="bg-[#0E1528] border border-[#2A344A] p-4 rounded-xl flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Current Highest Bid</span>
                    <span className="text-white text-lg font-bold">{selectedAuction.displayCurrentBid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Min. Increment</span>
                    <span className="text-[#C5A059] text-sm font-bold">₹ {selectedAuction.minIncrement.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block mb-2 font-mono">Your Bid Amount (INR)</label>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min ₹ ${(selectedAuction.currentBid + selectedAuction.minIncrement).toLocaleString('en-IN')}`} 
                      className="w-full bg-[#141C33] border border-[#2A344A] text-[#C5A059] text-lg rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block mb-2 font-mono">Full Name</label>
                      <input 
                        type="text" 
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        placeholder="e.g. Vikramaditya Roy" 
                        className="w-full bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block mb-2 font-mono">Mobile Number (For SMS OTP)</label>
                      <input 
                        type="text" 
                        value={bidderPhone}
                        onChange={(e) => setBidderPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210" 
                        className="w-full bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 italic leading-relaxed text-center">
                  By clicking authorize, you agree to place a legally binding bid. If your bid is successful, you will receive an immediate SMS authorization link.
                </p>

                <button 
                  onClick={handlePlaceBid}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl"
                >
                  Authorize & Submit Sovereign Bid
                </button>

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
