import React, { useState, useEffect } from 'react';
import { getShops, saveShop } from '@/lib/firestore/shops';
import { Shop } from '@/types/gold-hub';
import { FileText, PhoneCall, CheckCircle, Store, Mail, MapPin } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function AdminNewApplications() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Fetch only pending admin approval shops
      const data = await getShops(false); // They are unverified
      const pendingShops = data.filter(shop => shop.status === 'pending_admin_approval');
      setShops(pendingShops);
    } catch (e) {
      console.error(e);
      alert('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId: string) => {
    if (!confirm('Are you sure you want to approve this application? The shop will become active but will still need KYC verification.')) return;
    
    setActionLoading(shopId);
    try {
      const docRef = doc(db, "shops", shopId);
      await updateDoc(docRef, {
        status: 'active'
      });
      setShops(shops.filter(s => s.id !== shopId));
      alert('Claim/Registration approved successfully! It has been moved to the KYC Pipeline.');
    } catch (e) {
      console.error(e);
      alert('Failed to approve application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (shopId: string) => {
    const reason = prompt('Please enter a reason for declining (this will just delete the application for now, as messaging is not yet implemented):');
    if (reason === null) return;
    
    setActionLoading(shopId);
    try {
      // For now, we will just update the status to rejected so it disappears from the pending list.
      // A more complex feature would be required to show the reason in the vendor's dashboard.
      const docRef = doc(db, "shops", shopId);
      await updateDoc(docRef, {
        status: 'rejected',
        rejectReason: reason
      });
      setShops(shops.filter(s => s.id !== shopId));
      alert('Application declined and removed from pending list.');
    } catch (e) {
      console.error(e);
      alert('Failed to decline application');
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" /> Pending Applications
          </h2>
          <p className="text-gray-500">Review new shop registrations and claims before they enter the system.</p>
        </div>
        <button onClick={fetchShops} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          Refresh List
        </button>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No pending applications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map(shop => (
            <div key={shop.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex gap-4 flex-1">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    {shop.coverImages?.[0] ? (
                      <img src={shop.coverImages[0]} alt={shop.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase bg-gray-50">No Img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{shop.name}</h3>
                    <p className="text-sm text-gray-500 max-w-lg truncate mb-2">{shop.address}</p>
                    
                    {/* Document Previews */}
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" /> {shop.email || 'No email mapped'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneCall className="w-4 h-4 text-gray-400" /> {shop.phone || 'No phone mapped'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 text-gray-400" /> 
                        <span className="truncate">{shop.location?.district ? `${shop.location.district}, ${shop.location.state}` : 'Location mapping pending'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-64 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Action Required</h4>
                  
                  <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                      <PhoneCall className="w-4 h-4 text-gray-400" /> Owner Contacted
                    </label>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <button 
                      onClick={() => handleApprove(shop.id)}
                      disabled={actionLoading === shop.id}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                    >
                      {actionLoading === shop.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Approve Claim
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleDecline(shop.id)}
                      disabled={actionLoading === shop.id}
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                    >
                      {actionLoading === shop.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        'Decline & Remove'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
