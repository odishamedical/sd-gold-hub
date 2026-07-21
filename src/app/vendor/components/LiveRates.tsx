import React, { useState } from 'react';

export default function LiveRates() {
  const [rates, setRates] = useState({
    rate24k: 7850,
    rate22k: 7250,
    rate18k: 5850,
  });

  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setLastUpdated(new Date().toLocaleTimeString());
      alert('Live rates updated successfully!');
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-3xl">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Gold Rates</h2>
          <p className="text-gray-500 text-sm max-w-md">Update your daily gold rates here. These rates are used to dynamically calculate the final price of your products on the public directory.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Last Updated</div>
          <div className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 inline-block">
            Today at {lastUpdated}
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {/* 24K Rate */}
        <div className="bg-gradient-to-r from-[#FFF9E6] to-white border border-[#FDE047]/40 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D4AF37]"></span>
              24K Pure Gold
            </h3>
            <p className="text-sm text-gray-500">Base rate per gram</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-medium text-gray-400">₹</span>
            <input 
              type="number" 
              value={rates.rate24k}
              onChange={e => setRates({...rates, rate24k: Number(e.target.value)})}
              className="w-32 text-2xl font-bold text-gray-900 bg-white border border-[#D4AF37]/50 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-[#D4AF37] outline-none shadow-sm"
            />
          </div>
        </div>

        {/* 22K Rate */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              22K Standard Gold
            </h3>
            <p className="text-sm text-gray-500">Base rate per gram</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-medium text-gray-400">₹</span>
            <input 
              type="number" 
              value={rates.rate22k}
              onChange={e => setRates({...rates, rate22k: Number(e.target.value)})}
              className="w-32 text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* 18K Rate */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-300"></span>
              18K Rose/White Gold
            </h3>
            <p className="text-sm text-gray-500">Base rate per gram (Auto-calculated: 75% of 24K)</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-medium text-gray-400">₹</span>
            <input 
              type="number" 
              value={rates.rate18k}
              onChange={e => setRates({...rates, rate18k: Number(e.target.value)})}
              className="w-32 text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_4px_10px_rgba(212,175,55,0.3)] disabled:opacity-70 flex items-center gap-2"
        >
          {saving ? 'Updating Network...' : 'Broadcast Live Rates'}
        </button>
      </div>
    </div>
  );
}
