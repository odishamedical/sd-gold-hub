import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Diamond, Save, ArrowRight } from 'lucide-react';

import { getShopSettings, updateShopSettings, MetalRate } from '@/lib/firestore/shopSettings';

interface MetalRatesProps {
  onNext: () => void;
}

export default function MetalRates({ onNext }: MetalRatesProps) {
  const [metals, setMetals] = useState<MetalRate[]>([]);
  const [newMetalName, setNewMetalName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  
  const shopId = typeof window !== "undefined" ? localStorage.getItem("sd_current_user_id") || "test_vendor" : "test_vendor";

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getShopSettings(shopId);
        setMetals(settings.metals);
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

  const addMetal = () => {
    if (!newMetalName.trim()) return;
    setMetals([...metals, { id: Date.now().toString(), name: newMetalName, rate: 0 }]);
    setNewMetalName('');
  };
  const removeMetal = (id: string) => setMetals(metals.filter(m => m.id !== id));
  const updateMetalRate = (id: string, newRate: number) => {
    setMetals(metals.map(m => m.id === id ? { ...m, rate: newRate } : m));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateShopSettings(shopId, { metals });
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
            Update your daily gold and silver rates here.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {metals.map(metal => (
          <div key={metal.id} className="border border-gray-200 rounded-xl p-4 flex flex-col bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-800 text-sm">{metal.name}</span>
              {!metal.isDefault && (
                <button onClick={() => removeMetal(metal.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-gray-500 font-medium">₹</span>
              <input 
                type="number" 
                value={metal.rate}
                onChange={e => updateMetalRate(metal.id, Number(e.target.value))}
                className="w-full text-lg font-bold text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 max-w-sm mb-12">
        <input 
          type="text" 
          placeholder="e.g. 9K Gold or 750 Silver" 
          value={newMetalName}
          onChange={e => setNewMetalName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-black bg-white"
        />
        <button onClick={addMetal} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-colors border border-gray-200">
          <Plus className="w-4 h-4" /> Add Metal
        </button>
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
