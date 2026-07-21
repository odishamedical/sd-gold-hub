"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Star, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ClientDirectory({ initialRole = 'all', initialState = 'Odisha', initialDistrict = 'all' }: { initialRole?: string, initialState?: string, initialDistrict?: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "India", href: "/directory" },
    ...(initialState && initialState !== 'all' ? [{ label: initialState, href: `/directory/all/${initialState.toLowerCase()}` }] : []),
    ...(initialDistrict && initialDistrict !== 'all' ? [{ label: initialDistrict }] : [])
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Directory Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 capitalize">
            {initialDistrict !== 'all' ? `Best Gold Shops in ${initialDistrict}, ${initialState}` : `Verified Gold Jewelers in ${initialState}`}
          </h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Browse our curated list of hallmarked, transparent, and trusted jewelry stores.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Shop Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    Premium Showrooms
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    Designer Boutiques
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Verification</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    Only Verified Shops
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Directory Grid */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-2 flex items-center shadow-sm mb-8">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Search specific shop names..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 px-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dummy Listing Cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full">
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10"></div>
                  <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                    {i % 2 === 0 ? (
                      <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                        <Star className="w-3 h-3" /> Elite Shop
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {i === 1 ? "Royal Heritage Jewelers" : i === 2 ? "Shree Gold Boutique" : "Modern Ornament Shop"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {initialDistrict !== 'all' ? initialDistrict : 'Bhubaneswar'}, {initialState}
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Live 22K Rate:</span>
                      <span className="font-bold text-gray-900">₹7,250/gm</span>
                    </div>
                    <Link href={`/shop/demo-${i}`} className="w-full py-2 bg-gray-50 text-blue-600 font-semibold text-center text-sm rounded-lg group-hover:bg-blue-50 transition-colors">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
