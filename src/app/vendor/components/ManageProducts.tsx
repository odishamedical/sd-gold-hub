import React, { useState } from 'react';
import { Package, Plus, Upload, Tag, List, Filter } from 'lucide-react';

// Taxonomy Data
const CATEGORIES: Record<string, string[]> = {
  "Neck Jewellery": ["Necklace", "Short Necklace", "Long Necklace", "Choker", "Mangalsutra", "Locket", "Ranihaar", "Sita Haar", "Other"],
  "Hand Jewellery": ["Bangles", "Bracelets", "Kadas", "Armlet (Bajuband)", "Other"],
  "Ear Jewellery": ["Earrings", "Jhumkas", "Studs", "Hoops", "Drops", "Kan Chain", "Other"],
  "Head & Hair": ["Maang Tikka", "Matha Patti", "Hair Pin", "Other"],
  "Waist & Foot": ["Kamarbandh", "Anklets (Payal)", "Toe Rings", "Other"],
  "Rings": ["Engagement Ring", "Casual Ring", "Cocktail Ring", "Couple Bands", "Other"],
  "Coins & Bars": ["Gold Coin", "Silver Coin", "Gold Bar", "Silver Bar"],
  "Other": ["Other"]
};

// Mock Global Engine Settings (In real app, fetched from context/db)
const GLOBAL_METALS = ["24K Pure Gold", "22K Standard Gold", "18K Rose/White Gold", "999 Fine Silver", "925 Sterling Silver"];
const GLOBAL_DESIGNS = ["Casting", "Fancy", "Dubai", "Manipuri", "Kataki", "Rajastani"];

export default function ManageProducts() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [category, setCategory] = useState("Neck Jewellery");
  const [subCategory, setSubCategory] = useState("Necklace");
  const [customName, setCustomName] = useState("");
  
  const [metal, setMetal] = useState("22K Standard Gold");
  const [design, setDesign] = useState("Casting");
  
  const [weight, setWeight] = useState("");
  const [huid, setHuid] = useState("");
  
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSubCategory(CATEGORIES[cat][0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Manage Catalog</h2>
          <p className="text-gray-500 text-sm">Upload and manage your jewelry pieces. Prices are auto-calculated.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* Empty State / List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Your Catalog is Empty</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">Start adding products. They will automatically sync with your Global Pricing Engine for making charges and live metal rates.</p>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-bold transition-colors inline-block"
        >
          Upload First Item
        </button>
      </div>

      {/* Add Product Modal (Slide Over or Centered) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" /> Upload New Product
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 space-y-8">
              
              {/* SECTION 1: TAXONOMY */}
              <section className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" /> 1. Category Classification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Primary Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {Object.keys(CATEGORIES).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sub Category</label>
                    <select 
                      value={subCategory} 
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {CATEGORIES[category].map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {subCategory === "Other" && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Custom Item Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pahanchi, Painri, etc."
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                )}
              </section>

              {/* SECTION 2: GLOBAL ENGINE SYNC */}
              <section className="bg-green-50/50 p-5 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" /> 2. Global Pricing Sync
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Metal Type</label>
                    <select 
                      value={metal} 
                      onChange={(e) => setMetal(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      {GLOBAL_METALS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Design Making Category</label>
                    <select 
                      value={design} 
                      onChange={(e) => setDesign(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      {GLOBAL_DESIGNS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-700 font-medium">
                  ✓ Price will auto-calculate based on your Global Engine settings for {metal} and {design} category.
                </div>
              </section>

              {/* SECTION 3: SPECIFICS */}
              <section className="p-5">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" /> 3. Item Specifics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Net Weight (Grams)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="0.000"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <span className="text-gray-500 font-bold bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200">g</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">BIS HUID (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="6-digit Alphanumeric"
                      value={huid}
                      onChange={e => setHuid(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm uppercase focus:ring-2 focus:ring-blue-500 bg-white"
                      maxLength={6}
                    />
                  </div>
                </div>
                
                <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">Upload Product Images</p>
                  <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                </div>
              </section>

            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Product successfully mapped to Global Engine and uploaded!");
                  setShowAddModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-colors shadow-md"
              >
                Upload & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
