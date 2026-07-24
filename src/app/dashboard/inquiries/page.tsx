"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/context/CustomerContext';
import { Inquiry, getCustomerInquiries } from '@/lib/firestore/inquiries';
import { Mail, Clock, CheckCircle, Store, MessageSquare } from 'lucide-react';

export default function MyInquiriesPage() {
  const { profile, loading: profileLoading } = useCustomer();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInquiries() {
      if (!profile) return;
      setLoading(true);
      const data = await getCustomerInquiries(profile.id);
      setInquiries(data);
      setLoading(false);
    }
    
    if (!profileLoading) {
      fetchInquiries();
    }
  }, [profile, profileLoading]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#0066CC]" /> My Inquiries
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track the status of leads and requests sent to jewelers.</p>
        </div>
      </div>

      {loading || profileLoading ? (
        <div className="p-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-blue-50 text-[#0066CC] rounded-full flex items-center justify-center mb-6 shadow-inner">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Inquiries</h3>
          <p className="text-gray-500 max-w-md mb-8">
            You haven't contacted any shops yet. When you request a product or send a message to a vendor, it will appear here.
          </p>
          <Link 
            href="/" 
            className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="p-6">
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" /> Shop ID: {inquiry.shopId}
                    </h3>
                    {inquiry.productName && (
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Product: {inquiry.productName}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </span>
                      <span className="uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        via {inquiry.source}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {inquiry.status === 'new' && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-4 py-2 rounded-full border border-amber-200 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div> Pending Response
                      </span>
                    )}
                    {inquiry.status === 'contacted' && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-4 py-2 rounded-full border border-blue-200">
                        In Progress
                      </span>
                    )}
                    {inquiry.status === 'resolved' && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-4 py-2 rounded-full border border-green-200 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
