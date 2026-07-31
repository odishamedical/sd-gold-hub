import React, { useState, useEffect } from 'react';
import { Store, Package, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { getShopProducts } from '@/lib/firestore/products';
import { getShopInquiries } from '@/lib/firestore/inquiries';
import { getShopById } from '@/lib/firestore/shops';
import VendorNotifications from './VendorNotifications';

export default function VendorDashboardOverview({ shopId }: { shopId?: string }) {
  const [stats, setStats] = useState({
    products: 0,
    inquiries: 0,
    followers: 0,
    profileViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!shopId || shopId === 'test_vendor') {
        setStats({ products: 12, inquiries: 4, followers: 89, profileViews: 1240 });
        setLoading(false);
        return;
      }
      try {
        const [products, inquiries, shopData] = await Promise.all([
          getShopProducts(shopId),
          getShopInquiries(shopId),
          getShopById(shopId)
        ]);

        const shop = shopData as any;

        setStats({
          products: products.length,
          inquiries: inquiries.length,
          followers: shop?.followersCount || 0,
          profileViews: shop?.profileViews || 0
        });
      } catch (err) {
        console.error("Failed to load shop stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [shopId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {shopId && shopId !== 'test_vendor' && (
        <VendorNotifications shopId={shopId} />
      )}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Store className="w-6 h-6 text-[#C5A059]" /> Shop Performance
        </h2>
        <p className="text-gray-500 text-sm">Welcome back. Here is an overview of how your shop is performing on Gold Dunia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.products}</h3>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Active Products</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.inquiries}</h3>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Customer Leads</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.followers}</h3>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Followers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats.profileViews}</h3>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Profile Views</p>
        </div>
      </div>
    </div>
  );
}
