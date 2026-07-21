import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, IndianRupee, Tag } from 'lucide-react';
import { getShopSettings, ShopSettings } from '@/lib/firestore/shopSettings';
import { getShopProducts, deleteProduct } from '@/lib/firestore/products';
import { Product } from '@/types/gold-hub';
import UploadProduct from './products/UploadProduct';

export default function ManageProducts() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  
  const getShopId = () => {
    if (typeof window === "undefined") return "test_vendor";
    return localStorage.getItem("admin_impersonating_shop") || localStorage.getItem("sd_current_user_uid") || "test_vendor";
  };
  const shopId = getShopId();

  const loadData = async () => {
    try {
      setLoading(true);
      const [shopProds, shopSet] = await Promise.all([
        getShopProducts(shopId),
        getShopSettings(shopId)
      ]);
      setProducts(shopProds);
      setSettings(shopSet);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [shopId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
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

  // If showing upload form, render it instead of the list
  if (showAddForm) {
    return (
      <UploadProduct 
        settings={settings} 
        shopId={shopId} 
        onCancel={() => setShowAddForm(false)} 
        onSuccess={() => {
          setShowAddForm(false);
          loadData(); // Refresh the list
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Manage Catalog</h2>
          <p className="text-gray-500 text-sm">Manage your inventory. Prices are dynamically linked to your Global Pricing Engine.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
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
            onClick={() => setShowAddForm(true)}
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
            
            // Re-calculate indicative price for display
            let indicativePrice = 0;
            if (metal && prod.weightGrams) {
              const baseValue = metal.rate * prod.weightGrams;
              let makingValue = 0;
              if (charge?.type === 'percentage') makingValue = baseValue * (charge.value / 100);
              else if (charge?.type === 'per_gram') makingValue = prod.weightGrams * charge.value;
              else if (charge?.type === 'flat') makingValue = charge.value;
              
              const stoneV = prod.stoneDetails?.price || 0;
              const total = baseValue + makingValue + stoneV;
              const gst = total * ((settings?.gstRate || 3) / 100);
              indicativePrice = Math.round(total + gst);
            }
            
            return (
              <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img src={prod.images?.[0] || 'https://placehold.co/400x400?text=No+Image'} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleDelete(prod.id)}
                      className="bg-white/90 text-red-600 p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {prod.stoneDetails?.hasStones && (
                    <div className="absolute bottom-3 left-3 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                      Contains Stones
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-blue-600 mb-1">{prod.categoryId} › {prod.subcategoryId}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 truncate" title={prod.title}>{prod.title}</h3>
                  <div className="flex justify-between items-end mt-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600 flex items-center gap-1.5"><Tag className="w-3 h-3"/> {metal?.name || 'Unknown Metal'}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1.5"><Package className="w-3 h-3"/> {prod.weightGrams}g</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Live Price</div>
                      <div className="text-lg font-bold text-gray-900 flex items-center justify-end">
                        <IndianRupee className="w-4 h-4" /> {indicativePrice > 0 ? indicativePrice.toLocaleString() : "---"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
