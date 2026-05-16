"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendorGoldRate22K, setVendorGoldRate22K] = useState(6950);
  
  // Product Form State for Dynamic Calculation
  const [weight, setWeight] = useState("");
  const [makingCharges, setMakingCharges] = useState("");
  
  // Calculate dynamic price based on Indian Market standard
  const calculateEstimatedPrice = () => {
    const w = parseFloat(weight) || 0;
    const mc = parseFloat(makingCharges) || 0;
    const goldValue = w * vendorGoldRate22K;
    const subtotal = goldValue + mc;
    const gst = subtotal * 0.03; // 3% GST standard in India
    return (subtotal + gst).toFixed(2);
  };

  const myProducts = [
    {
      id: 1,
      title: "22K Lotus Necklace",
      sku: "IRA-NK-001",
      weight: "41.0 g",
      price: "₹ 2,98,400",
      status: "Active",
      stock: 4,
      image: "/diamond_necklace_luxury.png",
    },
    {
      id: 2,
      title: "Gold Lotus Earrings",
      sku: "IRA-ER-002",
      weight: "15.5 g",
      price: "₹ 1,18,500",
      status: "Out of Stock",
      stock: 0,
      image: "/hero-gold.png",
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Top Bar: Live Gold Rate Setting */}
      <div className="bg-[#141C33] border border-[#C5A059]/50 rounded-xl p-4 mb-8 flex justify-between items-center shadow-[0_0_20px_rgba(197,160,89,0.15)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">My Store's Live Gold Rate</h3>
            <p className="text-[10px] text-gray-400">All product prices will dynamically update based on this rate.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">22K:</span>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
              <input 
                type="number" 
                value={vendorGoldRate22K} 
                onChange={(e) => setVendorGoldRate22K(Number(e.target.value))}
                className="bg-[#0A1021] border border-[#2A344A] text-white text-sm rounded-lg pl-7 pr-3 py-2 w-32 focus:outline-none focus:border-[#C5A059] transition-colors font-bold"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-[10px] uppercase">/gm</span>
            </div>
          </div>
          <button className="bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-white transition-colors">
            Update Rate
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Jewelry Vault</h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest">Manage your live products on the Shyam Dash Gold Hub.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#996515] to-[#C5A059] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Product
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">💎</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Live Products</p>
          <p className="text-3xl font-bold text-white">24</p>
          <p className="text-xs text-green-500 mt-2">+3 this week</p>
        </div>
        <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🛍️</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-white">₹ 45.2L</p>
          <p className="text-xs text-green-500 mt-2">+12% from last month</p>
        </div>
        <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">⭐</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Store Rating</p>
          <p className="text-3xl font-bold text-white">4.9 / 5.0</p>
          <p className="text-xs text-gray-400 mt-2">Based on 128 reviews</p>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-[#2A344A] flex justify-between items-center bg-[#0A1021]">
          <h2 className="text-lg font-bold text-white tracking-wider">Your Product Inventory</h2>
          <div className="flex gap-4">
             <input 
               type="text" 
               placeholder="Search by SKU or Name..." 
               className="bg-[#141C33] border border-[#2A344A] text-white text-sm rounded-lg py-2 px-4 w-64 focus:outline-none focus:border-[#C5A059] transition-colors"
             />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141C33]/50 text-[10px] text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Weight</th>
                <th className="px-6 py-4 font-medium">Auto Price (INR)</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A344A]">
              {myProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#141C33]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-black overflow-hidden relative border border-[#2A344A]">
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-white">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-white">{product.weight}</td>
                  <td className="px-6 py-4 font-bold text-[#C5A059]">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{product.stock} Units</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-[#C5A059] transition-colors p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2 ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A1021] border border-[#C5A059]/30 rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.15)] w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-[#2A344A] flex justify-between items-center bg-[#0E1528]">
              <div>
                <h3 className="text-xl font-serif text-[#C5A059] tracking-wider">Upload New Product</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Dynamic Pricing System Enabled</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-[#2A344A] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Left Column: Image Upload (Multiple) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Product Images (Up to 5)</label>
                  <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[#C5A059]/30 bg-[#141C33]/50 flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] hover:bg-[#141C33] transition-colors group mb-4">
                    <div className="flex gap-2 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#0A1021] border border-[#2A344A] flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-[#C5A059]/50 shadow-lg z-10">
                        <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#0A1021] border border-[#2A344A] flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-[#C5A059]/50 opacity-50 -ml-4">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white mb-1">Click to Upload Multiple Photos</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Main Angle, Side Angle, Hallmark Zoom-in</span>
                  </div>
                  
                  <div className="bg-[#141C33]/50 border border-[#2A344A] rounded-xl p-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2">Dynamic Price Breakdown</h4>
                     <div className="space-y-2 text-xs text-gray-400">
                        <div className="flex justify-between">
                           <span>Gold Value ({weight || "0"}g × ₹{vendorGoldRate22K})</span>
                           <span>₹ {((parseFloat(weight) || 0) * vendorGoldRate22K).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Making Charges</span>
                           <span>₹ {(parseFloat(makingCharges) || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#2A344A] pb-2">
                           <span>GST (3%)</span>
                           <span>₹ {(((parseFloat(weight) || 0) * vendorGoldRate22K + (parseFloat(makingCharges) || 0)) * 0.03).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between pt-1 text-sm text-white font-bold">
                           <span className="text-[#C5A059]">Auto Final Price</span>
                           <span className="text-[#C5A059]">₹ {parseFloat(calculateEstimatedPrice()).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Form Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Jewelry Name</label>
                    <input type="text" placeholder="e.g. 22K Bridal Antique Necklace" className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Gross Weight</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="10.500" 
                          className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" 
                        />
                        <span className="absolute right-4 top-3 text-gray-500 text-xs">Grams</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Making Charges</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500 text-xs">₹</span>
                        <input 
                          type="number" 
                          value={makingCharges}
                          onChange={(e) => setMakingCharges(e.target.value)}
                          placeholder="8500" 
                          className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Purity Standard</label>
                      <select className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors appearance-none">
                        <option>22K</option>
                        <option>24K</option>
                        <option>18K</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Stock Qty</label>
                      <input type="number" placeholder="1" className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">HUID Code / SKU</label>
                    <input type="text" placeholder="IRA-NK-003 or HUID-XXXXXX" className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Design Description</label>
                    <textarea rows={2} placeholder="Add specific details about the craftsmanship, temple design, etc..." className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors resize-none"></textarea>
                  </div>

                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#2A344A] bg-[#0A1021] flex justify-end gap-4">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-xl border border-[#2A344A] text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-[#141C33] transition-colors"
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#996515] to-[#C5A059] text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                Sync Product
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
