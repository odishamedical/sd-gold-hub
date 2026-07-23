import React, { useState, useEffect } from 'react';
import { Store, Package } from 'lucide-react';
import { Shop } from '@/types/gold-hub';
import { getShops } from '@/lib/firestore/shops';
import { getShopSettings, ShopSettings } from '@/lib/firestore/shopSettings';
import UploadProduct from '@/app/vendor/components/products/UploadProduct';

export default function AdminProductAdd() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    getShops(true).then(s => {
      setShops(s);
      setLoading(false);
    });
  }, []);

  const handleStartUpload = async () => {
    if (!selectedShopId) return alert("Select a shop first");
    setLoading(true);
    let s: ShopSettings;
    if (selectedShopId === 'PLATFORM') {
      s = {
        metals: [
          { id: 'm1', name: '24K Pure Gold', rate: 7850, isDefault: true },
          { id: 'm2', name: '22K Standard Gold', rate: 7250, isDefault: true },
        ],
        makingCharges: [
          { id: 'c1', name: 'Standard Making', type: 'percentage', value: 15, isDefault: true }
        ],
        gstRate: 3,
        huidFee: 0
      };
    } else {
      s = await getShopSettings(selectedShopId);
    }
    setSettings(s);
    setFormReady(true);
    setLoading(false);
  };

  if (formReady) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <UploadProduct 
          settings={settings} 
          shopId={selectedShopId} 
          isAdmin={true} 
          onCancel={() => setFormReady(false)} 
          onSuccess={() => {
            alert("Product successfully uploaded as Admin!");
            setFormReady(false);
            setSelectedShopId('');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Map New Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">Upload a product and assign it to a specific vendor.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50/50 p-6 custom-scrollbar">
        <div className="p-8 max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Map Product to a Shop</h3>
            <p className="text-sm text-gray-500 mt-2">Select which vendor this product belongs to. The form will inherit their live gold rates and making charges.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Vendor / Shop</label>
              <select value={selectedShopId} onChange={e => setSelectedShopId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">-- Select a Shop --</option>
                <option value="PLATFORM" className="font-bold text-blue-600">⭐ Gold Dunia Official (In-House)</option>
                {shops.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.location?.district || 'Unknown location'})</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleStartUpload}
              disabled={!selectedShopId || loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? 'Loading Engine...' : 'Continue to Upload Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
