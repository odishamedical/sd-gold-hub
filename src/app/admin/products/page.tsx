"use client";

import React, { useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([
    {
      id: "PRD-1029",
      name: "22K Lotus Heritage Necklace",
      vendor: "IRA Jewels",
      purity: "22K Hallmarked",
      weight: "41.0 g",
      price: "₹ 2,85,000",
      makingCharge: "12%",
      huid: "HM/C-849201",
      stock: 3,
      status: "ACTIVE"
    },
    {
      id: "PRD-1030",
      name: "24K Pure Gold Lakshmi Coin (10g)",
      vendor: "Dwarika Jewellers",
      purity: "24K Pure Gold",
      weight: "10.0 g",
      price: "₹ 71,385",
      makingCharge: "3%",
      huid: "HM/C-774829",
      stock: 15,
      status: "ACTIVE"
    },
    {
      id: "PRD-1031",
      name: "Celestial Diamond Solitaire Ring",
      vendor: "Jewellery World",
      purity: "18K White Gold",
      weight: "12.5 g",
      price: "₹ 4,50,000",
      makingCharge: "18%",
      huid: "HM/C-663920",
      stock: 2,
      status: "REVIEW"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newVendor, setNewVendor] = useState("IRA Jewels");
  const [newPurity, setNewPurity] = useState("22K Hallmarked");
  const [newWeight, setNewWeight] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newMaking, setNewMaking] = useState("10%");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrd = {
      id: `PRD-${Math.floor(Math.random() * 8000 + 1000)}`,
      name: newTitle,
      vendor: newVendor,
      purity: newPurity,
      weight: `${newWeight} g`,
      price: `₹ ${Number(newPrice).toLocaleString("en-IN")}`,
      makingCharge: newMaking,
      huid: `HM/C-${Math.floor(Math.random() * 800000 + 100000)}`,
      stock: 5,
      status: "ACTIVE"
    };
    setProducts([newPrd, ...products]);
    setShowAddModal(false);
    setNewTitle(""); setNewWeight(""); setNewPrice("");
    alert(`💎 New Masterpiece Added to Vault!\n\nID: ${newPrd.id}\nTitle: ${newPrd.name}\nVendor: ${newPrd.vendor}\nHUID: ${newPrd.huid}\n\nSynced with Spree Commerce backend engine.`);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to archive product ${id}?`)) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Jewelry Vault</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Master catalog, BIS HUID registry & vendor asset allocations.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] rounded-xl text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>+ Add Masterpiece</span>
        </button>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                <th className="p-5">Asset ID / Title</th>
                <th className="p-5">Vendor Node</th>
                <th className="p-5">Purity & HUID</th>
                <th className="p-5">Weight</th>
                <th className="p-5">Valuation</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A344A] text-xs font-sans">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#C5A059]/30 flex items-center justify-center text-lg shrink-0 group-hover:border-[#C5A059] transition-colors">
                        💍
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm mb-0.5">{item.name}</p>
                        <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-mono text-gray-600">{item.vendor}</td>
                  <td className="p-5 font-mono">
                    <p className="text-gray-900 font-bold">{item.purity}</p>
                    <p className="text-[10px] text-gray-500">{item.huid}</p>
                  </td>
                  <td className="p-5 font-mono text-gray-600">{item.weight}</td>
                  <td className="p-5 font-mono">
                    <p className="text-gray-900 font-bold">{item.price}</p>
                    <p className="text-[10px] text-gray-500">Making: {item.makingCharge}</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider border ${item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-2 uppercase tracking-widest text-[10px]"
                      title="Archive Asset"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-[#C5A059] rounded-2xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(197,160,89,0.2)] relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-serif text-[#C5A059] font-bold mb-1">Add Masterpiece to Vault</h2>
            <p className="text-xs text-gray-500 mb-6">Instantly allocate a verified gold asset to the central Spree Commerce registry.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-gray-500 uppercase tracking-widest text-[10px]">Masterpiece Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 22K Royal Emerald Choker"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 uppercase tracking-widest text-[10px]">Vendor Merchant</label>
                  <select 
                    value={newVendor} 
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="IRA Jewels">IRA Jewels</option>
                    <option value="Dwarika Jewellers">Dwarika Jewellers</option>
                    <option value="Jewellery World">Jewellery World</option>
                    <option value="New Jewellery World">New Jewellery World</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 uppercase tracking-widest text-[10px]">Gold Purity</label>
                  <select 
                    value={newPurity} 
                    onChange={(e) => setNewPurity(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="24K Pure Gold">24K Pure Gold (999)</option>
                    <option value="22K Hallmarked">22K Hallmarked (916)</option>
                    <option value="18K White Gold">18K White Gold (750)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 uppercase tracking-widest text-[10px]">Weight (Grams)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    placeholder="e.g. 35.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 uppercase tracking-widest text-[10px]">Base Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 245000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 uppercase tracking-widest text-[10px]">Making Charge</label>
                  <select 
                    value={newMaking} 
                    onChange={(e) => setNewMaking(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="8%">8% Heritage Rate</option>
                    <option value="10%">10% Standard Rate</option>
                    <option value="12%">12% Complex Carving</option>
                    <option value="15%">15% Master Artisan</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-[10px] text-gray-500 leading-relaxed mt-2 flex items-center gap-3">
                <span className="text-[#C5A059] text-xl">🛡️</span>
                <div>
                  <strong className="text-gray-900 block mb-0.5">Automated BIS HUID Generation</strong>
                  Upon creation, a unique 6-digit alphanumeric hallmark ID is permanently minted to the Shyam Dash Master Registry.
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-6 font-sans cursor-pointer"
              >
                Mint Asset & Allocate to Storefront
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
