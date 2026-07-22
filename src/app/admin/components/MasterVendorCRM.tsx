import React, { useState, useEffect } from 'react';
import { getShops, saveShop } from '@/lib/firestore/shops';
import { Shop } from '@/types/gold-hub';
import { Search, Shield, Ban, Star, KeyRound, MoreVertical, LogIn, Plus, X, Edit2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig, db } from "@/lib/firebase";
import { doc, setDoc } from 'firebase/firestore';

export default function MasterVendorCRM() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    logoUrl: '',
    isVerified: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const realShops = await getShops(true); 
      const unverifiedShops = await getShops(false); 
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

  const openEditModal = (shop: Shop) => {
    setSelectedShop(shop);
    setFormData({
      name: shop.name || '',
      phone: shop.phone || '',
      email: shop.email || '',
      address: shop.address || '',
      logoUrl: shop.logoUrl || '',
      isVerified: shop.isVerified || false
    });
    setShowEditModal(true);
  };

  const handleSaveShop = async () => {
    if (!formData.name.trim()) return alert("Shop name is required.");
    setIsSubmitting(true);
    
    try {
      let docId = selectedShop?.id;
      
      // If adding new shop, handle Firebase Auth creation
      if (!selectedShop) {
        if (!formData.email.trim()) return alert("Email is required for new shops to create login.");
        const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp" + Date.now());
        const secondaryAuth = getAuth(secondaryApp);
        // Create user with default password
        const userCred = await createUserWithEmailAndPassword(secondaryAuth, formData.email, "shop12345");
        docId = userCred.user.uid;
        await signOut(secondaryAuth);
        
        // Also save to generic users collection just in case
        await setDoc(doc(db, "users", docId), {
           name: formData.name,
           email: formData.email,
           role: "vendor",
           createdAt: new Date().toISOString()
        });
      }

      // Save Shop
      await saveShop({
        id: docId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        logoUrl: formData.logoUrl,
        isVerified: formData.isVerified,
        googlePlaceId: docId || Date.now().toString() // fallback
      });

      alert(selectedShop ? "Shop Updated Successfully!" : "Shop Created Successfully! Default password is: shop12345");
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ name: '', phone: '', email: '', address: '', logoUrl: '', isVerified: true });
      fetchShops();

    } catch (e: any) {
      console.error(e);
      alert("Error saving shop: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Master Vendor CRM
          </h2>
          <p className="text-sm text-gray-500 mt-1">Total Registered Shops: {shops.length}</p>
        </div>
        <div className="flex items-center gap-4">
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
          <button 
            onClick={() => { setSelectedShop(null); setFormData({ name: '', phone: '', email: '', address: '', logoUrl: '', isVerified: true }); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
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
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("admin_impersonating_shop", shop.id);
                            window.location.href = "/vendor";
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors tooltip-trigger"
                        title="Login as this Shop"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
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
                    <button onClick={() => openEditModal(shop)} className="text-gray-400 hover:text-blue-600 transition-colors tooltip-trigger" title="Edit Shop">
                      <Edit2 className="w-5 h-5" />
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

      {/* Add / Edit Shop Modal */}
      {(showAddModal || showEditModal) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto overflow-x-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {showAddModal ? <><Plus className="w-5 h-5 text-blue-600"/> Add New Vendor</> : <><Edit2 className="w-5 h-5 text-blue-600"/> Edit Vendor Profile</>}
              </h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Logo Upload Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4">Shop Logo</h4>
                <div className="flex gap-6 items-start">
                  <div className="w-24 h-24 bg-white rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">No Logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <ImageUploader 
                      label="Upload New Logo"
                      aspectRatio="square"
                      value={formData.logoUrl}
                      onChange={(url) => setFormData({...formData, logoUrl: url})}
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Shop Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Dwarika Jewellers" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email (Login ID) *</label>
                  <input type="email" disabled={showEditModal} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none ${showEditModal ? 'bg-gray-100 text-gray-500' : 'focus:ring-2 focus:ring-blue-500'}`} placeholder="admin@shop.com" />
                  {showEditModal && <span className="text-[10px] text-gray-400 mt-1">Email cannot be changed after creation.</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 99999..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Verification Status</label>
                  <select value={formData.isVerified ? 'true' : 'false'} onChange={e => setFormData({...formData, isVerified: e.target.value === 'true'})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="true">Verified (Active)</option>
                    <option value="false">Pending (Hidden)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Address / Location</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full address string" />
                </div>
              </div>
              
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 flex justify-end gap-3 z-10">
              <button disabled={isSubmitting} onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-5 py-2.5 text-gray-700 font-bold hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button disabled={isSubmitting} onClick={handleSaveShop} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                ) : (
                  'Save Shop Profile'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
