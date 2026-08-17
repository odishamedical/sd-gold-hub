import React, { useState, useEffect } from 'react';
import { getShops, saveShop } from '@/lib/firestore/shops';
import { Shop } from '@/types/gold-hub';
import { Search, Shield, Ban, Star, KeyRound, MoreVertical, LogIn, Plus, X, Edit2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig, db } from "@/lib/firebase";
import { doc, setDoc } from 'firebase/firestore';
import { logAdminActivity } from '@/lib/firestore/admin_activities';

export default function MasterVendorCRM() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    website: '',
    description: '',
    address: '',
    logoUrl: '',
    coverImages: [] as string[],
    establishmentYear: '',
    gstNumber: '',
    hallmarkLicence: '',
    isVerified: true,
    autoApproveProducts: false,
    googlePlaceId: '',
    specialties: '',
    kycType: '',
    kycId: '',
    kycDocumentUrl: '',
    bankHolder: '',
    bankName: '',
    bankAccount: '',
    bankIfsc: '',
    bankUpi: '',
    subscriptionTier: 'free',
    subscriptionExpiresAt: ''
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

  const filteredShops = shops.filter(shop => {
    const shopNameStr = shop.name || (shop as any).shopName || '';
    return shopNameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (shop.phone && shop.phone.includes(searchTerm));
  });

  const handleAction = (action: string, shopName: string) => {
    alert(`Action "${action}" triggered for ${shopName}. (Backend integration pending)`);
  };

  const handleHardDelete = async (shopId: string, shopName: string) => {
    const confirmation = prompt(`Type "DELETE" to permanently remove ${shopName} from the database. This action cannot be undone.`);
    if (confirmation !== 'DELETE') {
      alert('Deletion cancelled.');
      return;
    }
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await deleteDoc(doc(db, "shops", shopId));
      setShops(shops.filter(s => s.id !== shopId));
      alert(`${shopName} has been permanently deleted.`);
    } catch (e) {
      console.error(e);
      alert('Failed to delete shop.');
    }
  };

  const openEditModal = (shop: any) => {
    setSelectedShop(shop);
    setFormData({
      name: shop.name || '',
      phone: shop.phone || '',
      whatsappNumber: shop.whatsappNumber || '',
      email: shop.email || '',
      website: shop.website || '',
      description: shop.description || '',
      address: shop.address || '',
      logoUrl: shop.logoUrl || '',
      coverImages: Array.isArray(shop.coverImages) ? shop.coverImages : [],
      establishmentYear: shop.establishmentYear || '',
      gstNumber: shop.gstNumber || '',
      hallmarkLicence: shop.hallmarkLicence || '',
      isVerified: shop.isVerified || false,
      autoApproveProducts: shop.autoApproveProducts || false,
      googlePlaceId: shop.googlePlaceId || '',
      specialties: Array.isArray(shop.specialties) ? shop.specialties.join(', ') : '',
      kycType: shop.kycType || '',
      kycId: shop.kycId || '',
      kycDocumentUrl: shop.kycDocumentUrl || '',
      bankHolder: shop.bankHolder || '',
      bankName: shop.bankName || '',
      bankAccount: shop.bankAccount || '',
      bankIfsc: shop.bankIfsc || '',
      bankUpi: shop.bankUpi || '',
      subscriptionTier: shop.subscription?.tier || 'free',
      subscriptionExpiresAt: shop.subscription?.expiresAt 
        ? new Date(shop.subscription.expiresAt.toDate ? shop.subscription.expiresAt.toDate() : shop.subscription.expiresAt).toISOString().split('T')[0]
        : ''
    });
    setModalStep(1);
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
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        website: formData.website,
        description: formData.description,
        address: formData.address,
        logoUrl: formData.logoUrl,
        coverImages: formData.coverImages,
        establishmentYear: formData.establishmentYear,
        gstNumber: formData.gstNumber,
        hallmarkLicence: formData.hallmarkLicence,
        isVerified: formData.isVerified,
        autoApproveProducts: formData.autoApproveProducts,
        googlePlaceId: formData.googlePlaceId || docId || Date.now().toString(),
        specialties: formData.specialties ? formData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        kycType: formData.kycType,
        kycId: formData.kycId,
        kycDocumentUrl: formData.kycDocumentUrl,
        bankHolder: formData.bankHolder,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
        bankIfsc: formData.bankIfsc,
        bankUpi: formData.bankUpi,
        subscription: {
          tier: formData.subscriptionTier as any,
          expiresAt: formData.subscriptionExpiresAt ? new Date(formData.subscriptionExpiresAt) : null
        }
      });
      const adminName = localStorage.getItem("sd_current_user_name") || "Admin";
      const adminEmail = localStorage.getItem("sd_current_user_email") || "admin@golddunia.com";
      await logAdminActivity(
        adminName, 
        adminEmail, 
        selectedShop ? "Edited Vendor CRM" : "Added Vendor CRM", 
        `${selectedShop ? 'Updated' : 'Created'} shop: ${formData.name} (${docId})`
      );

      alert(selectedShop ? "Shop Updated Successfully!" : "Shop Created Successfully! Default password is: shop12345");
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ name: '', phone: '', whatsappNumber: '', email: '', website: '', description: '', address: '', logoUrl: '', coverImages: [], establishmentYear: '', gstNumber: '', hallmarkLicence: '', isVerified: true, autoApproveProducts: false, googlePlaceId: '', specialties: '', kycType: '', kycId: '', kycDocumentUrl: '', bankHolder: '', bankName: '', bankAccount: '', bankIfsc: '', bankUpi: '', subscriptionTier: 'free', subscriptionExpiresAt: '' });
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
            onClick={() => { setSelectedShop(null); setFormData({ name: '', phone: '', whatsappNumber: '', email: '', website: '', description: '', address: '', logoUrl: '', coverImages: [], establishmentYear: '', gstNumber: '', hallmarkLicence: '', isVerified: true, autoApproveProducts: false, googlePlaceId: '', specialties: '', kycType: '', kycId: '', kycDocumentUrl: '', bankHolder: '', bankName: '', bankAccount: '', bankIfsc: '', bankUpi: '', subscriptionTier: 'free', subscriptionExpiresAt: '' }); setModalStep(1); setShowAddModal(true); }}
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
                        {(shop.name || (shop as any).shopName || 'U').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{shop.name || (shop as any).shopName || 'Unnamed Shop'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{shop.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {shop.status === "pending_admin_approval" ? (
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                        <Shield className="w-3 h-3" /> New Claim
                      </span>
                    ) : shop.isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-700">{shop.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem("admin_impersonating_shop", shop.id);
                            window.location.href = "/vendor";
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm"
                        title="Login as this Shop"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Login
                      </button>
                      <a 
                        href={`/gold-shop/${shop.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm"
                        title="View Public Storefront"
                      >
                        <Search className="w-3.5 h-3.5" /> View
                      </a>
                      <button 
                        onClick={() => handleAction('Suspend/Ban', shop.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm"
                        title="Suspend Shop"
                      >
                        <Ban className="w-3.5 h-3.5" /> Suspend
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedShop(shop);
                          setFormData({
                            name: shop.name || (shop as any).shopName || '',
                            phone: shop.phone || '',
                            whatsappNumber: shop.whatsappNumber || '',
                            email: shop.email || '',
                            website: shop.website || '',
                            description: shop.description || '',
                            address: shop.address || '',
                            logoUrl: shop.logoUrl || '',
                            coverImages: shop.coverImages || [],
                            establishmentYear: shop.establishmentYear || '',
                            gstNumber: shop.gstNumber || '',
                            hallmarkLicence: shop.hallmarkLicence || '',
                            isVerified: shop.isVerified || false,
                            autoApproveProducts: shop.autoApproveProducts || false,
                            googlePlaceId: shop.googlePlaceId || '',
                            specialties: shop.specialties || '',
                            kycType: shop.kyc?.documentType || '',
                            kycId: shop.kyc?.documentNumber || '',
                            kycDocumentUrl: shop.kyc?.documentUrl || '',
                            bankHolder: shop.bankDetails?.accountHolderName || '',
                            bankName: shop.bankDetails?.bankName || '',
                            bankAccount: shop.bankDetails?.accountNumber || '',
                            bankIfsc: shop.bankDetails?.ifscCode || '',
                            bankUpi: shop.bankDetails?.upiId || '',
                            subscriptionTier: shop.subscription?.tier || 'free',
                            subscriptionExpiresAt: shop.subscription?.expiresAt || '',
                          });
                          setModalStep(4); // God Mode
                          setShowAddModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm"
                        title="Upgrade Tier"
                      >
                        <Star className="w-3.5 h-3.5" /> Upgrade
                      </button>
                      <button 
                        onClick={() => handleAction('Force Password Reset', shop.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm"
                        title="Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Reset
                      </button>
                      <button 
                        onClick={() => handleHardDelete(shop.id, shop.name || 'Unnamed Shop')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm"
                        title="Delete Shop Permanently"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => openEditModal(shop)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm" title="Edit Shop">
                      <Edit2 className="w-3.5 h-3.5" /> Edit Shop
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
              <div className="flex items-center gap-2">
                {showEditModal && selectedShop && (
                  <a 
                    href={`/gold-shop/${selectedShop.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                    title="View Public Storefront"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    View Public Page
                  </a>
                )}
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Tabs Header */}
            <div className="flex border-b border-gray-100 mb-2">
              <button 
                onClick={() => setModalStep(1)} 
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${modalStep === 1 ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                1. Brand & Media
              </button>
              <button 
                onClick={() => setModalStep(2)} 
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${modalStep === 2 ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                2. Store Details & Legal
              </button>
              <button 
                onClick={() => setModalStep(3)} 
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${modalStep === 3 ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                3. KYC & Bank
              </button>
              <button 
                onClick={() => setModalStep(4)} 
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${modalStep === 4 ? 'border-amber-600 text-amber-600 bg-amber-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                4. God Mode
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* STEP 1: Brand & Media */}
              <div className={`space-y-6 ${modalStep === 1 ? 'block' : 'hidden'}`}>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">Store Media</h4>
                      <p className="text-[10px] text-gray-500 mt-1">Upload your shop logo and 5 cover images. (All 1:1 Square Ratio)</p>
                    </div>
                    {formData.logoUrl && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Active Logo:</span>
                        <img src={formData.logoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg flex items-start gap-2 shadow-sm">
                    <span className="text-xl leading-none">⚠️</span>
                    <div className="text-xs font-medium">
                      <strong>Important:</strong> Uploading or cropping an image here only shows a preview. You MUST click the blue <strong>"Save Shop Profile"</strong> button at the bottom of Step 2 to permanently save your images!
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ROW 1: Logo & Hero */}
                    
                    {/* Logo Slot */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-gray-700 uppercase">Dedicated Logo</span>
                      </div>
                      <ImageUploader 
                        label="Upload Shop Logo"
                        aspectRatio="square"
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({...formData, logoUrl: url})}
                      />
                    </div>

                    {/* Hero Slot */}
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col relative">
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl z-10">
                        HERO (MAIN)
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-gray-700 uppercase">Hero Image</span>
                      </div>
                      <ImageUploader 
                        label="Upload Hero Image"
                        aspectRatio="square"
                        value={formData.coverImages[0] || ""}
                        onChange={(url) => {
                          const newCovers = [...formData.coverImages];
                          newCovers[0] = url;
                          setFormData({...formData, coverImages: newCovers});
                        }}
                      />
                      {formData.coverImages[0] && (
                        <button 
                          onClick={() => setFormData({...formData, logoUrl: formData.coverImages[0]})}
                          className={`mt-3 w-full text-xs font-bold py-2 rounded transition-colors ${formData.logoUrl === formData.coverImages[0] ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                          {formData.logoUrl === formData.coverImages[0] ? '✓ Current Logo' : 'Set as Logo'}
                        </button>
                      )}
                    </div>

                    {/* ROW 2 & 3: Grid Images 1 to 4 */}
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-gray-700 uppercase">Grid Image {idx}</span>
                        </div>
                        <ImageUploader 
                          label={`Upload Grid Image ${idx}`}
                          aspectRatio="square"
                          value={formData.coverImages[idx] || ""}
                          onChange={(url) => {
                            const newCovers = [...formData.coverImages];
                            while (newCovers.length <= idx) newCovers.push("");
                            newCovers[idx] = url;
                            setFormData({...formData, coverImages: newCovers});
                          }}
                        />
                        {formData.coverImages[idx] && (
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => {
                                const newCovers = [...formData.coverImages];
                                const temp = newCovers[0];
                                newCovers[0] = newCovers[idx];
                                newCovers[idx] = temp || "";
                                setFormData({...formData, coverImages: newCovers});
                              }}
                              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold py-2 rounded transition-colors"
                            >
                              Make Hero
                            </button>
                            <button 
                              onClick={() => setFormData({...formData, logoUrl: formData.coverImages[idx]})}
                              className={`flex-1 text-xs font-bold py-2 rounded transition-colors ${formData.logoUrl === formData.coverImages[idx] ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            >
                              {formData.logoUrl === formData.coverImages[idx] ? '✓ Logo' : 'Set Logo'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 2: Store Details & Legal */}
              <div className={`space-y-6 ${modalStep === 2 ? 'block' : 'hidden'}`}>
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2 mb-2">Core Information</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Shop Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Dwarika Jewellers" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email (Login ID & Ownership) *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="owner@gmail.com" />
                    {showEditModal && <span className="text-[10px] text-amber-600 mt-1">Warning: Changing this modifies the public email & claim ownership. (Does not change Auth login ID of already created accounts)</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 99999..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number</label>
                    <input type="text" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 99999..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Website URL</label>
                    <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://www.example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Verification Status</label>
                    <select value={formData.isVerified ? 'true' : 'false'} onChange={e => setFormData({...formData, isVerified: e.target.value === 'true'})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="true">Verified (Active)</option>
                      <option value="false">Pending (Hidden)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Auto-Approve</label>
                    <div className="flex items-center gap-2 mt-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.autoApproveProducts} onChange={e => setFormData({...formData, autoApproveProducts: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-700">Allow Bypassing Review</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Shop Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Write a short description about this shop..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Address / Location</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full address string" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Google Maps Link</label>
                    <input type="text" value={formData.googlePlaceId} onChange={e => setFormData({...formData, googlePlaceId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://maps.google.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Specialties (Comma Separated)</label>
                    <input type="text" value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Diamond, 22K Gold" />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2 mb-2">Legal & Business Details</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Establishment Year</label>
                    <input type="text" value={formData.establishmentYear} onChange={e => setFormData({...formData, establishmentYear: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 1995" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">GST Number</label>
                    <input type="text" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="GSTIN..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Hallmark Licence No.</label>
                    <input type="text" value={formData.hallmarkLicence} onChange={e => setFormData({...formData, hallmarkLicence: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Licence Number..." />
                  </div>
                </div>
              </div>

              {/* STEP 3: KYC & Bank Details */}
              <div className={`space-y-6 ${modalStep === 3 ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2 mb-2">KYC Verification</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Document Type</label>
                    <select value={formData.kycType} onChange={e => setFormData({...formData, kycType: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select Type</option>
                      <option value="GST">GST Certificate</option>
                      <option value="Aadhar">Aadhar Card</option>
                      <option value="PAN">PAN Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Document ID Number</label>
                    <input type="text" value={formData.kycId} onChange={e => setFormData({...formData, kycId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ID Number..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">KYC Document Upload</label>
                    <ImageUploader 
                      label="Upload KYC Photo"
                      aspectRatio="landscape"
                      value={formData.kycDocumentUrl}
                      onChange={(url) => setFormData({...formData, kycDocumentUrl: url})}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2 mb-2">Bank Details</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Account Holder Name</label>
                    <input type="text" value={formData.bankHolder} onChange={e => setFormData({...formData, bankHolder: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name on Account" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name</label>
                    <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Bank Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Account Number</label>
                    <input type="text" value={formData.bankAccount} onChange={e => setFormData({...formData, bankAccount: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Account Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">IFSC Code</label>
                    <input type="text" value={formData.bankIfsc} onChange={e => setFormData({...formData, bankIfsc: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="IFSC Code" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">UPI ID (Optional)</label>
                    <input type="text" value={formData.bankUpi} onChange={e => setFormData({...formData, bankUpi: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="UPI ID" />
                  </div>
                </div>
              </div>

              {/* STEP 4: God Mode */}
              <div className={`space-y-6 ${modalStep === 4 ? 'block' : 'hidden'}`}>
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                  <div className="flex justify-between items-center mb-6 border-b border-amber-200 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">SaaS Subscription Override (God Mode)</h4>
                      <p className="text-[10px] text-amber-700 mt-1">Force upgrade a shop to a premium tier and set an expiration date.</p>
                    </div>
                    <div className="text-2xl">👑</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">Subscription Tier</label>
                      <select 
                        value={formData.subscriptionTier} 
                        onChange={e => setFormData({...formData, subscriptionTier: e.target.value})} 
                        className="w-full border border-amber-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white text-black font-bold"
                      >
                        <option value="free">Free Tier</option>
                        <option value="pro">Pro Tier</option>
                        <option value="advance">Advance Pro Tier</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">Expiration Date (Optional)</label>
                      <input 
                        type="date" 
                        value={formData.subscriptionExpiresAt} 
                        onChange={e => setFormData({...formData, subscriptionExpiresAt: e.target.value})} 
                        className="w-full border border-amber-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white text-black" 
                      />
                      <p className="text-[10px] text-amber-700 mt-1">Leave empty for lifetime access, or pick a date to auto-downgrade.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center z-10">
              <div>
                <button disabled={isSubmitting} onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-500 text-sm font-bold hover:text-gray-900 transition-colors">
                  Cancel
                </button>
              </div>
              <div className="flex gap-3">
                {modalStep > 1 && (
                  <button onClick={() => setModalStep(prev => (prev - 1) as 1 | 2 | 3)} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 font-bold hover:bg-gray-50 rounded-lg transition-colors shadow-sm">
                    Back
                  </button>
                )}
                {modalStep < 3 ? (
                  <button onClick={() => setModalStep(prev => (prev + 1) as 1 | 2 | 3)} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                    Next
                  </button>
                ) : (
                  <button disabled={isSubmitting} onClick={handleSaveShop} className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                    ) : (
                      'Save Shop Profile'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
