'use client';

import React, { useEffect, useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { getShopById } from '@/lib/firestore/products';
import { Shop } from '@/types/gold-hub';
import Link from 'next/link';

export default function FollowedShopsPage() {
  const { profile, loading } = useCustomer();
  const [shops, setShops] = useState<Shop[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function loadShops() {
      if (!profile || profile.followedShops.length === 0) {
        setShops([]);
        return;
      }
      
      setFetching(true);
      try {
        const fetched = await Promise.all(
          profile.followedShops.map(id => getShopById(id))
        );
        setShops(fetched.filter(s => s !== null) as Shop[]);
      } catch (err) {
        console.error("Failed to load followed shops", err);
      } finally {
        setFetching(false);
      }
    }
    
    if (!loading) {
      loadShops();
    }
  }, [profile, loading]);

  if (loading) return null;

  if (!profile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
        <p className="text-gray-500">Please sign in to view your followed shops.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Followed Shops</h1>
          <p className="text-gray-500 text-sm mt-1">{shops.length} trusted jewelers</p>
        </div>
      </div>

      {fetching ? (
        <div className="py-12 text-center text-gray-500 font-mono">Loading shops...</div>
      ) : shops.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
           <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
           </div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">No shops followed yet</h2>
           <p className="text-sm text-gray-500 max-w-sm mx-auto">Explore the directory to find verified jewelers in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {shops.map(shop => (
            <Link key={shop.id} href={`/shop/${shop.id}`} className="block group">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm group-hover:shadow-md group-hover:border-[#C5A059] transition-all flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-32 aspect-square rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0">
                  <img src={shop.coverImages?.[0] || '/images/showrooms.png'} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 w-full text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">{shop.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{shop.address}</p>
                    </div>
                    {shop.isVerified && (
                      <span className="bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold px-2 py-1 rounded border border-[#C5A059]/30 uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-3 text-xs uppercase tracking-widest text-gray-500">
                    <span>★ {shop.rating || '4.8'} Rating</span>
                    <span>•</span>
                    <span className="text-[#C5A059]">View Live Rates →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
