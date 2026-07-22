"use client";

import React, { useState, useEffect } from "react";
import { Auction } from "@/types/gold-hub";
import { createAuction, getAuctions } from "@/lib/firestore/auctions";

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Auction Form State
  const [title, setTitle] = useState("");
  const [purity, setPurity] = useState("22K Hallmarked Gold");
  const [weight, setWeight] = useState("");
  const [estValue, setEstValue] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [minIncrement, setMinIncrement] = useState("");
  const [durationHours, setDurationHours] = useState("24");

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    setLoading(true);
    // In reality, this should fetch ONLY this vendor's auctions.
    // For demo purposes, we fetch all or filter client-side.
    const allAuctions = await getAuctions();
    setAuctions(allAuctions);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const shopId = localStorage.getItem("admin_impersonating_shop") || "shop-1";
      const now = Date.now();
      const endTime = now + parseInt(durationHours) * 60 * 60 * 1000;

      await createAuction({
        productId: `custom-${Date.now()}`,
        shopId,
        vendorName: shopId === "shop-1" ? "Dwarika Jewellers" : "Impersonated Shop",
        title,
        image: "/images/products-grid.png", // Dummy image for now
        purity,
        weight: `${weight} g`,
        estValue: parseInt(estValue),
        startingBid: parseInt(startingBid),
        currentBid: parseInt(startingBid),
        minIncrement: parseInt(minIncrement),
        totalBids: 0,
        startTime: now,
        endTime,
        status: 'active'
      });
      alert("Live Auction Started Successfully!");
      setIsCreating(false);
      fetchAuctions();
    } catch (err) {
      console.error(err);
      alert("Failed to start auction.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading auctions...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Auctions</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your exclusive sovereign auctions and live bidding events.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isCreating ? 'bg-gray-100 text-gray-700' : 'bg-[#D4AF37] text-white shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:bg-[#C5A059]'}`}
        >
          {isCreating ? "Cancel" : "+ Start New Auction"}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Auction Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Item Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Antique Heritage Choker" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Purity</label>
              <input type="text" required value={purity} onChange={e => setPurity(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Weight (grams)</label>
              <input type="number" required value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Est. Market Value (₹)</label>
              <input type="number" required value={estValue} onChange={e => setEstValue(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Starting Bid (₹)</label>
              <input type="number" required value={startingBid} onChange={e => setStartingBid(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Min. Increment (₹)</label>
              <input type="number" required value={minIncrement} onChange={e => setMinIncrement(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Duration (Hours)</label>
              <select value={durationHours} onChange={e => setDurationHours(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">72 Hours</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-[#D4AF37] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#C5A059] transition-colors shadow-lg">
              Launch Live Auction 🚀
            </button>
          </div>
        </form>
      ) : null}

      <div className="space-y-4">
        {auctions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-4xl block mb-4">🔨</span>
            <h3 className="text-lg font-bold text-gray-900">No active auctions</h3>
            <p className="text-gray-500 text-sm mt-1">Start a live bidding event to attract premium buyers.</p>
          </div>
        ) : (
          auctions.map(auc => (
            <div key={auc.id} className="border border-gray-200 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#D4AF37]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                  <img src={auc.image} alt="Auction item" className="w-full h-full object-cover opacity-80" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${auc.status === 'active' ? 'bg-green-100 text-green-700' : auc.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                      {auc.status}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{auc.id}</span>
                  </div>
                  <h4 className="font-bold text-gray-900">{auc.title}</h4>
                  <p className="text-xs text-gray-500">{auc.totalBids} Bids Placed</p>
                </div>
              </div>
              <div className="text-right w-full md:w-auto bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Current Highest Bid</span>
                <span className="text-lg font-bold text-[#D4AF37] font-mono">₹ {auc.currentBid.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
