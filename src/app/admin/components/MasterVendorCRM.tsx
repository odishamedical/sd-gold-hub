import React, { useState, useEffect } from 'react';
import { getShops } from '@/lib/firestore/shops';
import { Shop } from '@/types/gold-hub';
import { Search, Shield, Ban, Star, KeyRound, MoreVertical } from 'lucide-react';

export default function MasterVendorCRM() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Fetch all shops for CRM (we might want to update getShops to support an 'all' flag if it doesn't)
      // Assuming getShops() without args or with null fetches all, but let's just fetch all verified and unverified for now.
      // Since our mock getShops in this context might just return a subset, let's use mock data to represent the CRM UI
      // if actual data is sparse.
      
      const realShops = await getShops(true); // Fetch verified
      const unverifiedShops = await getShops(false); // Fetch unverified
      
      const allShops = [...realShops, ...unverifiedShops];
      setShops(allShops);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (shop.phone && shop.phone.includes(searchTerm))
  );

  const handleAction = (action: string, shopName: string) => {
    alert(`Action "${action}" triggered for ${shopName}. (Backend integration pending)`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Master Vendor CRM
          </h2>
          <p className="text-sm text-gray-500 mt-1">Total Registered Shops: {shops.length}</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm w-72 focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 pl-6 w-1/3">Shop Name & Location</th>
                <th className="p-4 w-1/6">Status</th>
                <th className="p-4 w-1/6">Contact</th>
                <th className="p-4 w-1/4">Quick Actions</th>
                <th className="p-4 w-12 text-center">More</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShops.map(shop => (
                <tr key={shop.id} className="hover:bg-gray-50/50 group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {shop.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{shop.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{shop.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {shop.isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-700">{shop.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAction('Suspend/Ban', shop.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors tooltip-trigger"
                        title="Suspend Shop"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction('Upgrade to Elite', shop.name)}
                        className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors tooltip-trigger"
                        title="Upgrade Tier"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction('Force Password Reset', shop.name)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors tooltip-trigger"
                        title="Reset Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredShops.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No shops found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
