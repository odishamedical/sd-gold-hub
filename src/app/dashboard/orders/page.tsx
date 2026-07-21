"use client";

import React from 'react';
import Link from 'next/link';

export default function MyOrdersPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage your past purchases.</p>
        </div>
      </div>

      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-50 text-[#0066CC] rounded-full flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Orders</h3>
        <p className="text-gray-500 max-w-md mb-8">
          You haven't placed any orders yet. Since we currently operate on a WhatsApp-first lead generation model, your inquiries are sent directly to the jewelers.
        </p>
        <Link 
          href="/" 
          className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
        >
          Explore Marketplace
        </Link>
      </div>
    </div>
  );
}
