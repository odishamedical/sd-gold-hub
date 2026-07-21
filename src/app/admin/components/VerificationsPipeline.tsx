import React, { useState, useEffect } from 'react';
import { getShops, updateShopVerification } from '@/lib/firestore/shops';
import { Shop } from '@/types/gold-hub';

export default function VerificationsPipeline() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Fetch only unverified shops for the pipeline
      const data = await getShops(false);
      setShops(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId: string) => {
    if (!confirm('Are you sure you want to verify this shop?')) return;
    
    setActionLoading(shopId);
    try {
      await updateShopVerification(shopId, true);
      setShops(shops.filter(s => s.id !== shopId));
      alert('Shop verified successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to verify shop');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KYC Verifications Pipeline</h2>
          <p className="text-gray-500">Review trade licenses, track telephonic/video calls, and approve shops.</p>
        </div>
        <button onClick={fetchShops} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
          Refresh List
        </button>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No pending verifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map(shop => (
            <div key={shop.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    {shop.coverImages?.[0] ? (
                      <img src={shop.coverImages[0]} alt={shop.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{shop.name}</h3>
                    <p className="text-sm text-gray-500 max-w-lg truncate">{shop.address}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-600">📞 {shop.phone || 'No phone'}</span>
                      <span className="text-gray-600">ID: {shop.id.substring(0,8)}...</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    Telephonic Done
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    Video Call Done
                  </label>
                  <button 
                    onClick={() => handleApprove(shop.id)}
                    disabled={actionLoading === shop.id}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    {actionLoading === shop.id ? 'Approving...' : 'Approve to Verified'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
