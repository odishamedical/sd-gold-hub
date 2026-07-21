import React, { useState } from 'react';
import { CheckCircle2, Shield, Zap, Info } from 'lucide-react';

export default function SubscriptionManager() {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    // Simulate Razorpay popup
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      alert("Payment Successful! Mock Razorpay payment completed. Your shop is now active on the global platform.");
    }, 2000);
  };

  if (subscribed) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Active</h2>
          <p className="text-gray-500 mb-6 max-w-md text-center">
            Your shop is verified and actively listed on the Gold Hub marketplace. You have full access to the Global Pricing Engine and Customer Lead Generation.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-700 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200">
            Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001D4A] to-[#003B73] p-8 text-white">
        <h2 className="text-3xl font-serif font-bold mb-2">Platform Subscription</h2>
        <p className="text-blue-100 opacity-90 max-w-xl">
          Upgrade your shop to unlock the Global Pricing Engine, feature your inventory, and receive direct WhatsApp leads from verified buyers.
        </p>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Features */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-lg border-b pb-2">Premium Features</h3>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Live Global Pricing Engine</h4>
                <p className="text-sm text-gray-500 mt-1">Set your exact Making Charges and let our system automatically calculate precise product prices based on real-time MCX metal rates.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Verified Badge & Trust</h4>
                <p className="text-sm text-gray-500 mt-1">Stand out from unregistered vendors. Buyers are 8x more likely to purchase from verified platform members.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Direct WhatsApp Leads</h4>
                <p className="text-sm text-gray-500 mt-1">When a buyer clicks "Contact Shop", they will send a pre-filled WhatsApp message directly to your phone with the exact HUID of the product.</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div>
            <div className="border-2 border-[#C5A059] rounded-2xl p-6 relative bg-orange-50/30">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-[#C5A059] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                Recommended
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Seller</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-gray-900">₹999</span>
                <span className="text-gray-500 font-medium">/ month</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Unlimited Product Listings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Multi-Karat Pricing Matrix</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Priority Search Ranking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Custom Design Catalogs</li>
              </ul>

              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-[#001D4A] hover:bg-[#003B73] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Secure Payment...
                  </>
                ) : (
                  <>
                    Subscribe Now (Razorpay Mock)
                  </>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield className="w-3 h-3" /> Secure 256-bit SSL encryption
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
