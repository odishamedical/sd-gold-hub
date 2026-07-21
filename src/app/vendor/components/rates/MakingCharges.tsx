import React, { useState } from 'react';
import { Plus, Trash2, IndianRupee, Save, ArrowRight } from 'lucide-react';

type MakingCharge = { id: string; name: string; type: 'percentage' | 'per_gram' | 'flat'; value: number; isDefault?: boolean };

interface MakingChargesProps {
  onNext: () => void;
}

export default function MakingCharges({ onNext }: MakingChargesProps) {
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
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

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
      alert('Design categories updated successfully!');
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-green-600" /> Design Categories & Making Charges
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Define calculation formulas for different design types.
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

      <div className="overflow-hidden rounded-xl border border-gray-200 mb-6">
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
      
      <div className="flex gap-2 max-w-sm mb-12">
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

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2 text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Charges'}
        </button>

        <button 
          onClick={() => {
            handleSave();
            setTimeout(onNext, 600);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md flex items-center gap-2 text-lg"
        >
          Next: Taxes & Fees <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
