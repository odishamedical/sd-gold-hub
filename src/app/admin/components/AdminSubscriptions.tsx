import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AlertTriangle, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function AdminSubscriptions() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      // Get all shops where subscription.tier is NOT free
      const q = query(
        collection(db, "shops"),
        where("subscription.tier", "in", ["pro", "advance"])
      );
      const snapshot = await getDocs(q);
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShops(subs);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 min-h-[400px] flex items-center justify-center shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
      
      <div className="p-8 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Premium Subscriptions
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Monitor vendors who have been upgraded to the Pro or Advance tier. To modify a subscription, use the Master Vendor CRM.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {shops.length} Premium Vendors
        </div>
      </div>

      <div className="p-8">
        {shops.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No premium subscriptions found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Shop Name / ID</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Subscription Tier</th>
                  <th className="px-6 py-4">Expires At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{shop.name || 'Unknown Shop'}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">UID: {shop.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-700">{shop.email || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{shop.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${shop.subscription?.tier === 'advance' ? 'bg-indigo-100 text-indigo-700' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                        {shop.subscription?.tier || 'Pro'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {shop.subscription?.expiresAt ? (
                        <div className="flex items-center gap-1.5 font-medium">
                          {new Date(shop.subscription.expiresAt.seconds * 1000 || shop.subscription.expiresAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic font-medium">No Expiration Set</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
