import React, { useState, useEffect } from 'react';
import { Store, Package, MessageSquare, TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [onboarding, setOnboarding] = useState({
    hasProfile: false,
    hasBank: false,
    hasKyc: false,
    hasProduct: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!shopId) {
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

        setOnboarding({
          hasProfile: !!shop?.logoUrl && !!shop?.phone && !!shop?.address,
          hasBank: !!shop?.bankAccount,
          hasKyc: !!shop?.isVerified,
          hasProduct: products.length > 0
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
      {shopId && (
        <VendorNotifications shopId={shopId} />
      )}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Store className="w-6 h-6 text-[#C5A059]" /> Shop Performance
        </h2>
        <p className="text-gray-500 text-sm">Welcome back. Here is an overview of how your shop is performing on Gold Dunia.</p>
      </div>

      {/* Onboarding Progress Bar */}
      {(() => {
        const steps = [
          { key: 'hasProfile', label: 'Complete Profile (Logo & Address)' },
          { key: 'hasBank', label: 'Add Bank Details' },
          { key: 'hasKyc', label: 'Complete KYC Verification' },
          { key: 'hasProduct', label: 'Upload First Product' }
        ];
        
        const completedSteps = steps.filter(s => (onboarding as any)[s.key]).length;
        const progressPercentage = (completedSteps / steps.length) * 100;
        
        if (completedSteps === steps.length) return null; // Hide if 100% complete

        return (
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-gray-800 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#D4AF37]" /> Shop Onboarding
                  </h3>
                  <p className="text-gray-400 text-sm">Complete these final steps to maximize your shop's visibility.</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#D4AF37]">{progressPercentage}%</span>
                  <span className="text-sm font-bold text-gray-500 ml-2 uppercase tracking-widest">Complete</span>
                </div>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3 mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] h-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((step, idx) => {
                  const isDone = (onboarding as any)[step.key];
                  return (
                    <div key={idx} className={`p-4 rounded-xl border ${isDone ? 'bg-green-900/20 border-green-500/30' : 'bg-white/5 border-white/10'} flex flex-col gap-2`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDone ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                        {isDone ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold text-sm">{idx + 1}</span>}
                      </div>
                      <p className={`text-sm font-medium ${isDone ? 'text-green-400/80' : 'text-gray-300'}`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

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
