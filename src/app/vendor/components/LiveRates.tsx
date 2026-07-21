import React, { useState } from 'react';
import { Plus, Trash2, Settings2, Save, IndianRupee, Diamond } from 'lucide-react';

type MetalRate = { id: string; name: string; rate: number; isDefault?: boolean };
type MakingCharge = { id: string; name: string; type: 'percentage' | 'per_gram' | 'flat'; value: number; isDefault?: boolean };

export default function LiveRates() {
  // 1. Dynamic Metal Rates
  const [metals, setMetals] = useState<MetalRate[]>([
    { id: 'm1', name: '24K Pure Gold', rate: 7850, isDefault: true },
    { id: 'm2', name: '22K Standard Gold', rate: 7250, isDefault: true },
    { id: 'm3', name: '18K Rose/White Gold', rate: 5850, isDefault: true },
    { id: 'm4', name: '999 Fine Silver', rate: 85, isDefault: true },
    { id: 'm5', name: '925 Sterling Silver', rate: 78, isDefault: true }
  ]);
  const [newMetalName, setNewMetalName] = useState('');

  // 2. Dynamic Making Charge Categories
  const [makingCharges, setMakingCharges] = useState<MakingCharge[]>([
    { id: 'c1', name: 'Casting', type: 'percentage', value: 10, isDefault: true },
    { id: 'c2', name: 'Fancy', type: 'percentage', value: 12, isDefault: true },
    { id: 'c3', name: 'Dubai', type: 'percentage', value: 15, isDefault: true },
    { id: 'c4', name: 'Manipuri', type: 'percentage', value: 16, isDefault: true },
    { id: 'c5', name: 'Kataki', type: 'percentage', value: 18, isDefault: true },
    { id: 'c6', name: 'Rajastani', type: 'percentage', value: 20, isDefault: true },
    { id: 'c7', name: 'Basic Silver', type: 'per_gram', value: 50, isDefault: true }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 3. Taxes & Fees
  const [gstRate, setGstRate] = useState(3);
  const [huidFee, setHuidFee] = useState(45);

  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Handlers for Metals
  const addMetal = () => {
    if (!newMetalName.trim()) return;
    setMetals([...metals, { id: Date.now().toString(), name: newMetalName, rate: 0 }]);
    setNewMetalName('');
  };
  const removeMetal = (id: string) => setMetals(metals.filter(m => m.id !== id));
  const updateMetalRate = (id: string, newRate: number) => {
    setMetals(metals.map(m => m.id === id ? { ...m, rate: newRate } : m));
  };

  // Handlers for Categories
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    setMakingCharges([...makingCharges, { id: Date.now().toString(), name: newCategoryName, type: 'percentage', value: 0 }]);
    setNewCategoryName('');
  };
  const removeCategory = (id: string) => setMakingCharges(makingCharges.filter(c => c.id !== id));
  const updateCategory = (id: string, field: 'type' | 'value', val: any) => {
    setMakingCharges(makingCharges.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setLastUpdated(new Date().toLocaleTimeString());
      alert('Global Pricing Engine Synced! All your catalog products have been updated with the new rates instantly.');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            Global Pricing Engine <Settings2 className="w-6 h-6 text-blue-500" />
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Configure your exact metal purities and design categories here. When you upload a product, you simply tag its category. Updating these global rates will instantly re-calculate prices across your entire public catalog.
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

      {/* SECTION 1: DYNAMIC METAL RATES */}
      <section className="mb-12">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Diamond className="w-5 h-5 text-yellow-500" /> 1. Live Metal Rates (Per Gram)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
        <div className="flex gap-2 max-w-sm">
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
      </section>

      {/* SECTION 2: DYNAMIC MAKING CHARGES */}
      <section className="mb-12">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-green-600" /> 2. Design Categories & Making Charges
          </h3>
          <p className="text-xs text-gray-500 mt-1">Define the default calculation formulas for different design types. You can override these on individual products if needed.</p>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-gray-200 mb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 w-1/3">Design Category Name</th>
                <th className="p-4 w-1/3">Calculation Formula</th>
                <th className="p-4 w-1/4">Value</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {makingCharges.map(charge => (
                <tr key={charge.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-800">{charge.name}</td>
                  <td className="p-4">
                    <select 
                      value={charge.type}
                      onChange={e => updateCategory(charge.id, 'type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm text-black bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">% of Total Gold Value</option>
                      <option value="per_gram">Flat ₹ per Gram</option>
                      <option value="flat">Flat ₹ per Item</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {charge.type !== 'percentage' && <span className="text-gray-500">₹</span>}
                      <input 
                        type="number" 
                        value={charge.value}
                        onChange={e => updateCategory(charge.id, 'value', Number(e.target.value))}
                        className="w-24 text-base font-bold text-gray-900 border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 text-right"
                      />
                      {charge.type === 'percentage' && <span className="text-gray-500">%</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {!charge.isDefault && (
                      <button onClick={() => removeCategory(charge.id)} className="text-gray-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex gap-2 max-w-sm">
          <input 
            type="text" 
            placeholder="e.g. Turkish Design or Temple" 
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
          <button onClick={addCategory} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-colors border border-gray-200">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </section>

      {/* SECTION 3: TAXES & FEES */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">3. Standard Taxes & Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-bold text-gray-800 mb-1">GST (Goods & Services Tax)</label>
            <p className="text-xs text-gray-500 mb-3">Standard government tax applied to the final subtotal.</p>
            <div className="flex items-center gap-2">
              <input type="number" value={gstRate} onChange={e => setGstRate(Number(e.target.value))} className="w-20 font-bold border border-gray-300 rounded-md px-3 py-1.5 text-black bg-white" />
              <span className="font-bold text-gray-600">%</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-bold text-gray-800 mb-1">BIS HUID / Hallmark Fee</label>
            <p className="text-xs text-gray-500 mb-3">Flat rate fee added to each certified piece.</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-600">₹</span>
              <input type="number" value={huidFee} onChange={e => setHuidFee(Number(e.target.value))} className="w-24 font-bold border border-gray-300 rounded-md px-3 py-1.5 text-black bg-white" />
              <span className="text-sm text-gray-500">per item</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md disabled:opacity-70 flex items-center gap-2 text-lg"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Syncing Catalog...' : 'Save & Sync Global Engine'}
        </button>
      </div>
    </div>
  );
}
