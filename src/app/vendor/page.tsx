"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  const myProducts = [
    {
      id: 1,
      title: "22K Lotus Necklace",
      sku: "IRA-NK-001",
      price: "₹ 2,85,000",
      status: "Active",
      stock: 4,
      image: "/diamond_necklace_luxury.png",
    },
    {
      id: 2,
      title: "Gold Lotus Earrings",
      sku: "IRA-ER-002",
      price: "₹ 1,15,000",
      status: "Out of Stock",
      stock: 0,
      image: "/hero-gold.png",
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Jewelry Vault</h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest">Manage your live products on the Shyam Dash Gold Hub.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#996515] to-[#C5A059] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]">
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
                <th className="px-6 py-4 font-medium">Price (INR)</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
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
                  <td className="px-6 py-4 font-bold text-[#C5A059]">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{product.stock} Units</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${product.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {product.status}
                    </span>
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

    </div>
  );
}
