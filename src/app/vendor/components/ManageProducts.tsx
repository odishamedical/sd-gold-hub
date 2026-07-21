import React, { useState, useEffect } from 'react';
import { Package, Plus, Upload, Tag, List, Filter, Trash2, IndianRupee } from 'lucide-react';
import { getShopSettings, ShopSettings } from '@/lib/firestore/shopSettings';
import { getShopProducts, addProduct, deleteProduct } from '@/lib/firestore/products';
import { Product } from '@/types/gold-hub';

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

export default function ManageProducts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  
  const shopId = typeof window !== "undefined" ? localStorage.getItem("sd_current_user_id") || "test_vendor" : "test_vendor";

  // Form State
  const [category, setCategory] = useState("Neck Jewellery");
  const [subCategory, setSubCategory] = useState("Necklace");
  const [customName, setCustomName] = useState("");
  const [metalId, setMetalId] = useState("");
  const [chargeId, setChargeId] = useState("");
  const [weight, setWeight] = useState("");
  const [huid, setHuid] = useState("");
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [shopProds, shopSet] = await Promise.all([
          getShopProducts(shopId),
          getShopSettings(shopId)
        ]);
        setProducts(shopProds);
        setSettings(shopSet);
        if (shopSet.metals.length > 0) setMetalId(shopSet.metals[0].id);
        if (shopSet.makingCharges.length > 0) setChargeId(shopSet.makingCharges[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [shopId]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSubCategory(CATEGORIES[cat][0]);
  };
  
  const handleUpload = async () => {
    if (!metalId || !chargeId || !weight) {
      alert("Please fill all required fields");
      return;
    }
    
    setUploading(true);
    try {
      const designName = subCategory === 'Other' ? customName : subCategory;
      const newProd = {
        shopId,
        categoryId: category,
        subcategoryId: subCategory,
        designName,
        customDesignName: customName,
        metalPurityId: metalId,
        makingChargeId: chargeId,
        image: "https://placehold.co/400x400/f8fafc/94a3b8?text=" + designName.replace(' ', '+'), // placeholder image until cloud storage
        price: 0, // Should be computed dynamically on frontend based on rates, saving 0 for now as 'base price'
        weightGrams: parseFloat(weight),
        status: 'active' as const,
      };
      
      const id = await addProduct(newProd);
      setProducts([...products, { ...newProd, id, createdAt: new Date(), updatedAt: new Date() }]);
      setShowAddModal(false);
      setWeight("");
      setCustomName("");
    } catch (e) {
      console.error(e);
      alert("Failed to upload product");
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      {products.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(prod => {
            const metal = settings?.metals.find(m => m.id === prod.metalPurityId);
            const charge = settings?.makingCharges.find(c => c.id === prod.makingChargeId);
            
            // Calculate indicative price
            let indicativePrice = 0;
            if (metal && prod.weightGrams) {
              const baseValue = metal.rate * prod.weightGrams;
              let makingValue = 0;
              if (charge?.type === 'percentage') makingValue = baseValue * (charge.value / 100);
              else if (charge?.type === 'per_gram') makingValue = prod.weightGrams * charge.value;
              else if (charge?.type === 'flat') makingValue = charge.value;
              
              const total = baseValue + makingValue;
              const gst = total * ((settings?.gstRate || 3) / 100);
              indicativePrice = Math.round(total + gst);
            }
            
            return (
              <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img src={prod.image} alt={prod.designName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleDelete(prod.id)}
                      className="bg-white/90 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-blue-600 mb-1">{prod.categoryId} › {prod.subcategoryId}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">{prod.designName}</h3>
                  <div className="flex justify-between items-end mt-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600 flex items-center gap-1.5"><Tag className="w-3 h-3"/> {metal?.name || 'Unknown Metal'}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1.5"><Package className="w-3 h-3"/> {prod.weightGrams}g</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Live Price</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center justify-end">
                        <IndianRupee className="w-4 h-4" /> {indicativePrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                      value={metalId} 
                      onChange={(e) => setMetalId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      {settings?.metals.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Design Making Category</label>
                    <select 
                      value={chargeId} 
                      onChange={(e) => setChargeId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      {settings?.makingCharges.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-700 font-medium">
                  ✓ Price will auto-calculate based on your Global Engine settings for this metal and design category.
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
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? 'Uploading...' : 'Upload & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
