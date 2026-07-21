import React, { useState, useEffect } from 'react';
import { Save, FileText, CheckCircle, Receipt, Percent } from 'lucide-react';
import { getShopSettings, updateShopSettings } from '@/lib/firestore/shopSettings';

export default function Taxes() {
  const [gstRate, setGstRate] = useState<number>(3);
  const [huidFee, setHuidFee] = useState<number>(45);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');

  const shopId = typeof window !== "undefined" ? localStorage.getItem("sd_current_user_id") || "test_vendor" : "test_vendor";

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getShopSettings(shopId);
        setGstRate(settings.gstRate);
        setHuidFee(settings.huidFee);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateShopSettings(shopId, { gstRate, huidFee });
      setLastUpdated(new Date().toLocaleTimeString());
      alert('Taxes & Fees updated successfully!');
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
            <FileText className="w-6 h-6 text-gray-600" /> Taxes & Certifications
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Configure standard taxes and hallmark fees applied to your products.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <label className="block text-base font-bold text-gray-900 mb-2">GST (Goods & Services Tax)</label>
          <p className="text-sm text-gray-500 mb-4">Standard government tax applied to the final subtotal. Usually 3% for Gold and Silver in India.</p>
          <div className="flex items-center gap-2">
            <input type="number" value={gstRate} onChange={e => setGstRate(Number(e.target.value))} className="w-24 text-lg font-bold border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            <span className="font-bold text-gray-600 text-lg">%</span>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <label className="block text-base font-bold text-gray-900 mb-2">BIS HUID / Hallmark Fee</label>
          <p className="text-sm text-gray-500 mb-4">Flat rate fee added to each certified piece to cover Hallmark center costs.</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-600 text-lg">₹</span>
            <input type="number" value={huidFee} onChange={e => setHuidFee(Number(e.target.value))} className="w-32 text-lg font-bold border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            <span className="text-sm text-gray-500 font-medium ml-2">per item</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md disabled:opacity-70 flex items-center gap-2 text-lg"
        >
          {saving ? <Save className="w-5 h-5 animate-pulse" /> : <CheckCircle className="w-5 h-5" />}
          {saving ? 'Syncing...' : 'Save & Finish Configuration'}
        </button>
      </div>
    </div>
  );
}
