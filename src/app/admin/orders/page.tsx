"use client";

import React, { useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-4029",
      customer: "Rajesh Sharma",
      email: "rajesh.sharma@gmail.com",
      mobile: "+91 98765 43210",
      address: "702, Sea Breeze Towers, Marine Drive, Mumbai - 400020",
      item: "Celestial Diamond Solitaire Ring",
      amount: "₹ 4,50,000",
      date: "May 17, 2026 - 14:32 IST",
      partner: "Sequel Secure Logistics",
      awb: "SQL-8492019",
      status: "ARMORED_TRANSIT",
      bvcInsured: true
    },
    {
      id: "ORD-4028",
      customer: "Vikram Malhotra",
      email: "vikram@odishamedical.com",
      mobile: "+91 98201 23456",
      address: "14, Heritage Villas, Banjara Hills, Hyderabad - 500034",
      item: "22K Lotus Heritage Necklace",
      amount: "₹ 2,85,000",
      date: "May 16, 2026 - 11:15 IST",
      partner: "Sequel Secure Logistics",
      awb: "SQL-7738291",
      status: "DELIVERED",
      bvcInsured: true
    },
    {
      id: "ORD-4027",
      customer: "Ananya Desai",
      email: "ananya.d@gmail.com",
      mobile: "+91 91234 56789",
      address: "A-401, Pine Crest, Kalyani Nagar, Pune - 411006",
      item: "24K Pure Gold Lakshmi Coin (10g)",
      amount: "₹ 71,385",
      date: "May 15, 2026 - 18:45 IST",
      partner: "Pending Armored Allocation",
      awb: "UNASSIGNED",
      status: "PROCESSING",
      bvcInsured: true
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleDispatchArmored = (orderId: string) => {
    const awbNum = `SQL-${Math.floor(Math.random() * 8000000 + 1000000)}`;
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "ARMORED_TRANSIT", partner: "Sequel Secure Logistics", awb: awbNum } : o));
    setSelectedOrder(null);
    alert(`🚚 Sequel Armored Van Dispatched!\n\nRequisition: ${orderId}\nPartner: Sequel Secure Logistics\nAWB Tracking: ${awbNum}\nInsurance: BVC Indemnity Active\n\nAutomated SMS with Secure Delivery OTP dispatched to customer mobile.`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Orders & Armored Shipments</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Sequel Logistics dispatch, BVC Insurance indemnity & delivery OTP verification.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-mono text-[#C5A059] flex items-center gap-2 shadow">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>BVC Master Indemnity Policy Active</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                <th className="p-5">Requisition ID</th>
                <th className="p-5">Customer Sovereign Identity</th>
                <th className="p-5">Masterpiece / Valuation</th>
                <th className="p-5">Armored Transit AWB</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Dispatch Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A344A] text-xs font-sans">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-5 font-mono">
                    <span className="text-[#C5A059] font-bold block text-sm">{order.id}</span>
                    <span className="text-[10px] text-gray-500">{order.date}</span>
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-gray-900 mb-0.5">{order.customer}</p>
                    <p className="text-[10px] font-mono text-gray-500">{order.email}</p>
                    <p className="text-[10px] font-mono text-[#C5A059]">{order.mobile}</p>
                  </td>
                  <td className="p-5 font-mono">
                    <p className="text-gray-900 font-bold text-sm">{order.item}</p>
                    <p className="text-xs text-[#C5A059] font-bold mt-0.5">{order.amount}</p>
                  </td>
                  <td className="p-5 font-mono">
                    <p className="text-gray-900 font-bold">{order.partner}</p>
                    <p className="text-[10px] text-gray-500">AWB: {order.awb}</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider border ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : order.status === 'ARMORED_TRANSIT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-400' : order.status === 'ARMORED_TRANSIT' ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-mono">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 hover:border-[#C5A059] text-[#C5A059] hover:text-gray-900 rounded-lg transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                    >
                      Inspect / Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Control Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-[#C5A059] rounded-2xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(197,160,89,0.2)] relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-serif text-[#C5A059] font-bold mb-1">Armored Dispatch Requisition</h2>
            <p className="text-xs text-gray-500 mb-6">Allocate secure transit van, assign BVC insurance indemnity & mint customer delivery OTP.</p>

            <div className="space-y-6 font-mono text-xs">
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-[10px]">Requisition Ref</span>
                  <span className="text-[#C5A059] font-bold text-sm">{selectedOrder.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-0.5">Sovereign Customer</span>
                  <p className="text-gray-900 font-bold">{selectedOrder.customer} ({selectedOrder.email})</p>
                  <p className="text-[#C5A059] mt-0.5">Mobile: {selectedOrder.mobile}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-0.5">Insured Armored Destination</span>
                  <p className="text-gray-600 font-sans leading-relaxed">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                <span className="text-gray-900 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                  <span className="text-[#C5A059]">🛡️</span> BVC Master Indemnity Policy
                </span>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                  This shipment is 100% insured against loss, theft, or transit damage by BVC Logistics under Master Policy <strong>#BVC-SD-2026-991</strong>.
                </p>
                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-gray-200">
                  <span>Indemnity Value: {selectedOrder.amount}</span>
                  <span className="text-green-400 font-bold">COVERAGE ACTIVE</span>
                </div>
              </div>

              {selectedOrder.status === "PROCESSING" ? (
                <button 
                  type="button"
                  onClick={() => handleDispatchArmored(selectedOrder.id)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-4 font-sans cursor-pointer"
                >
                  Allocate Sequel Armored Van & Mint OTP
                </button>
              ) : (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center flex flex-col items-center gap-1">
                  <span className="text-blue-400 font-bold text-sm uppercase tracking-widest animate-pulse">Armored Transit Already Active</span>
                  <p className="text-gray-500 text-[11px] font-sans">AWB tracking number {selectedOrder.awb} is currently active on Sequel GPS network.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
