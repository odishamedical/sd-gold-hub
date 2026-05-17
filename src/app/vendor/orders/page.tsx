"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function VendorOrdersDashboard() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Modal Edit State
  const [editPartner, setEditPartner] = useState("");
  const [editTracking, setEditTracking] = useState("");

  // Live Orders State for Vendor (e.g. IRA Jewels)
  const [ordersList, setOrdersList] = useState([
    {
      id: "ORD-7892",
      date: "May 16, 2026 - 14:32",
      customer: {
        name: "Ananya Sharma",
        email: "ananya.s@gmail.com",
        phone: "+91 98765 43210",
        address: "A-402, Sea Breeze Apts, Worli, Mumbai, MH - 400018"
      },
      item: {
        title: "22K Lotus Heritage Necklace",
        sku: "IRA-NK-001",
        weight: "41.0 g",
        purity: "22K Gold",
        image: "/diamond_necklace_luxury.png"
      },
      pricing: {
        metalValue: 284950,
        makingCharges: 8500,
        gst: 8804,
        total: 302254
      },
      shipping: {
        status: "Insured Transit",
        partner: "Bluedart Secure Gold",
        trackingId: "BD-GOLD-9823102",
        insuranceValue: "₹ 3,02,254 (100% Covered)"
      },
      paymentStatus: "Paid (Verified)",
      status: "Processing"
    },
    {
      id: "ORD-7890",
      date: "May 15, 2026 - 11:15",
      customer: {
        name: "Vikramaditya Roy",
        email: "v.roy@royalglobe.com",
        phone: "+91 91234 56789",
        address: "72, Jubilee Hills, Road No. 10, Hyderabad, TS - 500033"
      },
      item: {
        title: "Gold Lotus Temple Earrings",
        sku: "IRA-ER-002",
        weight: "15.5 g",
        purity: "22K Gold",
        image: "/hero-gold.png"
      },
      pricing: {
        metalValue: 107725,
        makingCharges: 5000,
        gst: 3381,
        total: 116106
      },
      shipping: {
        status: "Delivered",
        partner: "Sequel Secure Logistics",
        trackingId: "SQL-88291032",
        insuranceValue: "₹ 1,16,106 (100% Covered)"
      },
      paymentStatus: "Paid (Verified)",
      status: "Delivered"
    },
    {
      id: "ORD-7885",
      date: "May 12, 2026 - 18:45",
      customer: {
        name: "Priyanka Deshmukh",
        email: "priyanka@deshmukh.in",
        phone: "+91 99887 76655",
        address: "14/B, Kalyani Nagar, Pune, MH - 411006"
      },
      item: {
        title: "24K Sovereign Gold Coin (10g)",
        sku: "IRA-CN-010",
        weight: "10.0 g",
        purity: "24K Pure Gold",
        image: "/hero-gold.png"
      },
      pricing: {
        metalValue: 74500,
        makingCharges: 1000,
        gst: 2265,
        total: 77765
      },
      shipping: {
        status: "Pending Dispatch",
        partner: "Bluedart Secure Gold",
        trackingId: "Pending Allocation",
        insuranceValue: "₹ 77,765 (100% Covered)"
      },
      paymentStatus: "Paid (Verified)",
      status: "Pending Dispatch"
    }
  ]);

  const filteredOrders = ordersList.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setEditPartner(order.shipping.partner);
    setEditTracking(order.shipping.trackingId);
  };

  const handleSaveTracking = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = ordersList.map(ord => {
      if (ord.id === selectedOrder.id) {
        return {
          ...ord,
          status: "Processing", // Mark as in transit
          shipping: {
            ...ord.shipping,
            status: "Insured Transit",
            partner: editPartner || ord.shipping.partner,
            trackingId: editTracking || ord.shipping.trackingId
          }
        };
      }
      return ord;
    });

    setOrdersList(updatedOrders);
    alert(`Logistics successfully updated for ${selectedOrder.id}! SMS & Email dispatched to ${selectedOrder.customer.name}.`);
    setSelectedOrder(null);
  };

  const handlePrintCertificate = (order: any) => {
    alert(`Generating Government HUID & BIS Hallmarked Authenticity Certificate for ${order.item.title} (Order ${order.id})...\n\nThis will open a high-res PDF for printing.`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-16">
      
      {/* Top Banner: Insured Shipping Notice */}
      <div className="bg-gradient-to-r from-[#141C33] via-[#0E1528] to-[#141C33] border border-[#C5A059]/40 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(197,160,89,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30 shadow-inner">
            <svg className="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.38-3.016z"></path></svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">100% Insured High-Value Jewelry Transit</h3>
            <p className="text-xs text-gray-400 mt-0.5">All shipments are fully covered by Sequel & Bluedart Secure Logistics with mandatory OTP verification upon delivery.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="bg-[#0A1021] border border-[#2A344A] px-4 py-2 rounded-xl flex flex-col items-end flex-1 md:flex-initial">
             <span className="text-[10px] text-gray-500 uppercase tracking-widest">Active Transit Value</span>
             <span className="text-sm font-bold text-[#C5A059]">₹ 3,80,019</span>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Order Command Center</h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest">Track, Verify, and Dispatch your luxury customer orders.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial md:w-64">
            <span className="absolute left-3 top-2.5 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search Order ID, Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0E1528] border border-[#2A344A] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>

          <div className="flex bg-[#0E1528] border border-[#2A344A] rounded-xl p-1">
            <button 
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterStatus === 'all' ? 'bg-[#C5A059] text-[#0A1021] shadow' : 'text-gray-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus("Processing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterStatus === 'Processing' ? 'bg-[#C5A059] text-[#0A1021] shadow' : 'text-gray-400 hover:text-white'}`}
            >
              In Transit
            </button>
            <button 
              onClick={() => setFilterStatus("Pending Dispatch")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterStatus === 'Pending Dispatch' ? 'bg-[#C5A059] text-[#0A1021] shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus("Delivered")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterStatus === 'Delivered' ? 'bg-[#C5A059] text-[#0A1021] shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2A344A] bg-[#0A1021] flex justify-between items-center">
          <h2 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
            <span>Customer Requisitions</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#141C33] text-[#C5A059] border border-[#2A344A]">
              {filteredOrders.length} Orders
            </span>
          </h2>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Auto-Synced with Spree Engine</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141C33]/50 text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#2A344A]">
                <th className="px-6 py-4 font-medium">Order details</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Item Specifications</th>
                <th className="px-6 py-4 font-medium">Total (INR)</th>
                <th className="px-6 py-4 font-medium">Insured Shipping</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A344A]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#141C33]/30 transition-colors group">
                  
                  {/* Order ID & Date */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-[#C5A059] transition-colors">{order.id}</span>
                      <span className="text-[10px] text-gray-400 mt-1">{order.date}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded w-max border border-green-500/20">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{order.customer.name}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{order.customer.phone}</span>
                      <span className="text-[10px] text-gray-500 mt-1 max-w-[200px] truncate" title={order.customer.address}>
                        {order.customer.address}
                      </span>
                    </div>
                  </td>

                  {/* Item Specs */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0A1021] border border-[#2A344A] relative overflow-hidden flex-shrink-0 shadow">
                        <Image src={order.item.image} alt={order.item.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xs line-clamp-1">{order.item.title}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className="font-mono text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/20">{order.item.sku}</span>
                          <span className="text-gray-400">{order.item.weight}</span>
                          <span className="text-gray-500">• {order.item.purity}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Pricing Breakdown */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">₹ {order.pricing.total.toLocaleString('en-IN')}</span>
                      <div className="flex flex-col text-[10px] text-gray-500 mt-1 space-y-0.5">
                        <span>Gold: ₹{order.pricing.metalValue.toLocaleString('en-IN')}</span>
                        <span>Making: ₹{order.pricing.makingCharges.toLocaleString('en-IN')}</span>
                        <span>GST: ₹{order.pricing.gst.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </td>

                  {/* Shipping & Insurance */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : order.status === 'Processing' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                        <span className="font-bold text-white text-xs">{order.shipping.status}</span>
                      </div>
                      <span className="text-[10px] text-[#C5A059] mt-1 font-medium">{order.shipping.partner}</span>
                      <span className="text-[10px] font-mono text-gray-400 mt-0.5">{order.shipping.trackingId}</span>
                      <span className="text-[9px] text-gray-500 mt-1 italic">{order.shipping.insuranceValue}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handlePrintCertificate(order)}
                        className="p-2 rounded-lg bg-[#141C33] border border-[#2A344A] text-gray-400 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all"
                        title="Print BIS Hallmarked Authenticity Certificate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleOpenModal(order)}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#996515] to-[#C5A059] text-[10px] font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow"
                      >
                        Manage
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Management ModalOverlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A1021] border border-[#C5A059]/40 rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.2)] w-full max-w-3xl overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-[#2A344A] bg-[#0E1528] flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif text-[#C5A059] tracking-wider flex items-center gap-2">
                  <span>Requisition details</span>
                  <span className="text-sm font-mono text-white font-normal">({selectedOrder.id})</span>
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Full Logistics & Authenticity Control</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-[#2A344A] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              
              {/* Customer & Delivery Block */}
              <div className="bg-[#0E1528] border border-[#2A344A] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Customer Identity
                  </h4>
                  <p className="text-sm font-bold text-white">{selectedOrder.customer.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{selectedOrder.customer.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Insured Delivery Address
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{selectedOrder.customer.address}</p>
                  <span className="mt-2 inline-block text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded uppercase tracking-widest">
                    Mandatory Delivery OTP Required
                  </span>
                </div>
              </div>

              {/* Item Summary */}
              <div className="bg-[#141C33]/50 border border-[#2A344A] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-black border border-[#2A344A] relative overflow-hidden flex-shrink-0 shadow-lg">
                    <Image src={selectedOrder.item.image} alt={selectedOrder.item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{selectedOrder.item.title}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="font-mono text-[#C5A059]">{selectedOrder.item.sku}</span>
                      <span>Weight: <strong className="text-white">{selectedOrder.item.weight}</strong></span>
                      <span>Purity: <strong className="text-white">{selectedOrder.item.purity}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0A1021] border border-[#2A344A] p-4 rounded-xl text-right w-full md:w-auto">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Total Authorization</span>
                  <span className="text-xl font-bold text-[#C5A059]">₹ {selectedOrder.pricing.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Tracking Update Action */}
              <div className="bg-[#0E1528] border border-[#2A344A] rounded-xl p-6">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Logistics & Tracking Update
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                       <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Secure Logistics Partner</label>
                       <select 
                         value={editPartner}
                         onChange={(e) => setEditPartner(e.target.value)}
                         className="w-full bg-[#141C33] border border-[#2A344A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                       >
                          <option>Bluedart Secure Gold</option>
                          <option>Sequel Secure Logistics</option>
                          <option>BVC Logistics (Gems & Jewelry)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Secure Tracking ID / Waybill</label>
                       <input 
                         type="text" 
                         value={editTracking}
                         onChange={(e) => setEditTracking(e.target.value)}
                         placeholder="e.g. SQL-88291032" 
                         className="w-full bg-[#141C33] border border-[#2A344A] rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#C5A059]" 
                       />
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-500 italic">Updating tracking automatically triggers SMS & Email updates to customer.</span>
                    <button 
                      onClick={handleSaveTracking}
                      className="bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-white transition-colors shadow"
                    >
                       Save Tracking details
                    </button>
                 </div>
              </div>

            </div>

            <div className="p-6 border-t border-[#2A344A] bg-[#0A1021] flex justify-between items-center">
              <button 
                onClick={() => handlePrintCertificate(selectedOrder)}
                className="flex items-center gap-2 bg-[#141C33] border border-[#2A344A] px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-[#C5A059] transition-all"
              >
                <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print BIS Authenticity Certificate
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#996515] to-[#C5A059] text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
