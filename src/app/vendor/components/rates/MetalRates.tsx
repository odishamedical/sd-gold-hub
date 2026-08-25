import React, { useState, useEffect } from 'react';
import { Save, Diamond, ArrowRight } from 'lucide-react';

import { getShopSettings, updateShopSettings, MetalRate } from '@/lib/firestore/shopSettings';
import { logShopActivity } from '@/lib/activity-logger';
import { auth } from '@/lib/firebase';

interface MetalRatesProps {
  onNext: () => void;
}

const STANDARD_METALS = [
  { id: 'gold_24k', name: 'Gold 24K (99.9% Pure)' },
  { id: 'gold_22k', name: 'Gold 22K (91.6% Standard)' },
  { id: 'gold_18k', name: 'Gold 18K (75.0%)' },
  { id: 'gold_14k', name: 'Gold 14K (58.5%)' },
  { id: 'gold_9k', name: 'Gold 9K (37.5%)' },
  { id: 'silver_999', name: 'Silver 999 (Fine / Pure)' },
  { id: 'silver_925', name: 'Silver 925 (Sterling)' },
  { id: 'silver_800', name: 'Silver 800 (Standard / Payal)' },
  { id: 'silver_700', name: 'Silver 700 (Lower Purity)' }
];

export default function MetalRates({ onNext }: MetalRatesProps) {
  const [metals, setMetals] = useState<MetalRate[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  
  const getShopId = () => {
    if (typeof window === "undefined") return "test_vendor";
    return localStorage.getItem("admin_impersonating_shop") || localStorage.getItem("sd_boss_uid") || localStorage.getItem("sd_current_vendor_shop_id") || "test_vendor";
  };
  const shopId = getShopId();

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getShopSettings(shopId);
        
        // Merge standard metals with any existing saved rates
        const mergedMetals = STANDARD_METALS.map(std => {
          // Match by exact ID or fuzzy name match for legacy compatibility
          const existing = settings.metals?.find(m => {
             const mNormalized = m.name.toUpperCase().replace(/\s+/g, '');
             const stdKey = std.id.split('_')[1].toUpperCase(); // '24K', '999', '925', etc.
             return m.id === std.id || mNormalized.includes(stdKey);
          });
          
          return {
            id: std.id,
            name: std.name,
            rate: existing?.rate || 0,
            isDefault: true
          };
        });
        
        setMetals(mergedMetals);
        
        if (settings.updatedAt) {
          const date = settings.updatedAt.toDate ? settings.updatedAt.toDate() : new Date(settings.updatedAt);
          setLastUpdated(date.toLocaleTimeString());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [shopId]);

  const updateMetalRate = (id: string, newRate: number) => {
    setMetals(metals.map(m => m.id === id ? { ...m, rate: Math.max(0, newRate) } : m));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Only save metals that have a rate > 0 to keep DB clean
      const activeMetals = metals.filter(m => m.rate > 0);
      await updateShopSettings(shopId, { metals: activeMetals });
      
      const rateString = activeMetals.map(m => `${m.name}: ₹${m.rate}/g`).join(', ');
      logShopActivity(
        shopId,
        auth.currentUser?.displayName || 'Unknown Staff',
        auth.currentUser?.email || 'unknown@example.com',
        'Updated Metal Rates',
        `New rates: ${rateString || 'Cleared all rates'}`
      );

      setLastUpdated(new Date().toLocaleTimeString());
      alert('Metal rates updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl mx-auto flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Diamond className="w-6 h-6 text-yellow-500" /> Live Metal Rates
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Update your daily gold and silver rates here. <strong>All rates MUST be entered per 1 Gram (1g).</strong>
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Last Synced</div>
          <div className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 inline-flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Today at {lastUpdated}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-xl">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-amber-800">Important Pricing Rule</h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>Prices will be shown to customers as <strong>Per Gram (/g)</strong>. If the market rate is ₹75,000 for 10 grams, you must enter <strong>7500</strong> here.</p>
              <p className="mt-2 font-bold text-amber-900">Leave the price as 0 for any metal you do not sell. It will be hidden from your shop profile.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {metals.map(metal => (
          <div key={metal.id} className={`border rounded-xl p-4 flex flex-col transition-colors ${metal.rate > 0 ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`font-bold text-sm ${metal.rate > 0 ? 'text-blue-900' : 'text-gray-800'}`}>{metal.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-auto relative">
              <span className={`font-medium ${metal.rate > 0 ? 'text-blue-500' : 'text-gray-400'}`}>₹</span>
              <input 
                type="number" 
                value={metal.rate || ''}
                placeholder="0"
                onChange={e => updateMetalRate(metal.id, Number(e.target.value))}
                className="w-full text-lg font-bold text-gray-900 bg-white border border-gray-300 rounded-md pl-3 pr-12 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
              <span className="absolute right-3 text-gray-400 text-sm font-bold pointer-events-none">/g</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Current Rates'}
        </button>

        <button 
          onClick={() => {
            handleSave();
            setTimeout(onNext, 600);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md flex items-center gap-2 text-lg"
        >
          Next: Design & Making Charges <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
