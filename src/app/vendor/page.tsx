"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout, { NavItem } from '@/components/DashboardLayout';
import ProfileBuilder from './components/ProfileBuilder';
import MetalRates from './components/rates/MetalRates';
import MakingCharges from './components/rates/MakingCharges';
import Taxes from './components/rates/Taxes';
import ManageProducts from './components/ManageProducts';
import KYCUpload from './components/KYCUpload';
import StaffManagement from './components/StaffManagement';
import SubscriptionManager from './components/SubscriptionManager';
import InquiryInbox from './components/InquiryInbox';
import ManageAuctions from './components/ManageAuctions';
import VendorJobsManager from './components/VendorJobsManager';
import VendorDashboardOverview from './components/VendorDashboardOverview';
import VanityUrlManager from '@/components/VanityUrlManager';
import PricingTab from '@/components/PricingTab';
import ActivityLog from './components/ActivityLog';

import { auth, googleProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import SaaSUpgraderModal from '@/components/SaaSUpgraderModal';

const VENDOR_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard Overview", category: "My Shop (Free Features)" },
  { id: "profile", label: "Personal & Shop Profile", category: "My Shop (Free Features)" },
  { id: "kyc", label: "Verification & KYC", category: "My Shop (Free Features)" },
  { id: "subscription", label: "Membership & Billing", category: "My Shop (Free Features)" },
  { id: "inquiries", label: "Inquiry Inbox", category: "My Shop (Free Features)" },

  { id: "products", label: "🔒 Manage Inventory", category: "Pro Hub (Premium Features)" },
  { id: "metal_rates", label: "🔒 Live Metal Rates", category: "Pro Hub (Premium Features)" },
  { id: "making_charges", label: "🔒 Design & Making Charges", category: "Pro Hub (Premium Features)" },
  { id: "taxes", label: "🔒 Taxes & Fees", category: "Pro Hub (Premium Features)" },
  { id: "vanity_url", label: "🔒 Premium Vanity URL", category: "Pro Hub (Premium Features)" },
  { id: "staff", label: "🔒 Staff Management", category: "Pro Hub (Premium Features)" },
  { id: "auctions", label: "🔒 Live Auctions", category: "Pro Hub (Premium Features)" },
  { id: "jobs", label: "🔒 Job Postings & CVs", category: "Pro Hub (Premium Features)" },
  { id: "activity", label: "🔒 Activity Log", category: "Pro Hub (Premium Features)" }
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to dashboard
  const [userName, setUserName] = useState("Shop Vendor");
  const [userRole, setUserRole] = useState("vendor");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [vendorPermissions, setVendorPermissions] = useState<string[]>([]);
  const [isUpgraderOpen, setIsUpgraderOpen] = useState(false);
  const [pendingStaffInvite, setPendingStaffInvite] = useState<any>(null);
  const [claimCode, setClaimCode] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const impersonatedId = typeof window !== "undefined" ? localStorage.getItem("admin_impersonating_shop") : null;
    if (impersonatedId) {
      setUser({ uid: impersonatedId, displayName: 'Impersonated Shop' } as User);
      setUserName('Impersonated Shop (Admin)');
      setUserRole('vendor');
      setSubscriptionTier('pro_advance'); // Master override for admin
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const actualRole = data.role || "customer";
            
            if (actualRole === "store_staff" || actualRole === "vendor_staff") {
              const bossUid = data.bossUid || data.parentEntityId;
              if (bossUid) {
                setUserRole("vendor_staff");
                setUserName(data.name || currentUser.displayName || "Staff");
                setVendorPermissions(data.vendorPermissions || []);
                localStorage.setItem("sd_boss_uid", bossUid);
                
                // Fetch shop tier to enforce SaaS limits even for staff
                const shopDoc = await getDoc(doc(db, "shops", bossUid));
                if (shopDoc.exists()) {
                  const shopData = shopDoc.data();
                  setSubscriptionTier(shopData.subscription?.tier || "free");

                  // Security Check: Make sure they are still in the shop's staff array!
                  const staffArray = shopData.staff || [];
                  const isStillStaff = staffArray.some((s: any) => s.email === currentUser.email?.trim().toLowerCase());
                  
                  if (!isStillStaff) {
                     // The owner removed them from the UI! Let's revoke their access instantly
                     const { setDoc } = await import('firebase/firestore');
                     await setDoc(doc(db, "users", currentUser.uid), { role: 'customer', bossUid: null, vendorPermissions: [] }, { merge: true });
                     setUserRole("customer");
                     localStorage.removeItem("sd_boss_uid");
                     return;
                  }
                }
              } else {
                setUserRole("customer");
              }
            } else {
              setUserRole("vendor");
              setUserName(data.name || currentUser.displayName || "Shop Vendor");
              
              // 🚨 FIX: Shop ID is NOT the User ID. Fetch by ownerUid instead!
              const { collection, query, where, getDocs } = await import('firebase/firestore');
              const q = query(collection(db, "shops"), where("ownerUid", "==", currentUser.uid));
              const shopSnap = await getDocs(q);
              
              if (!shopSnap.empty) {
                const mainShopDoc = shopSnap.docs[0];
                const shopData = mainShopDoc.data();
                localStorage.setItem("sd_current_vendor_shop_id", mainShopDoc.id); // SAVE CORRECT ID
                const tier = shopData.subscriptionTier || shopData.subscription?.tier || "free";
                setSubscriptionTier(tier.toLowerCase());
              }
            }
          } else if (currentUser.email) {
            // Check for pending staff invite if no special role found
            const inviteDoc = await getDoc(doc(db, "staff_invites", currentUser.email.trim().toLowerCase()));
            if (inviteDoc.exists()) {
              setPendingStaffInvite({ id: inviteDoc.id, ...inviteDoc.data() });
            } else {
              setUserRole("customer");
            }
          } else {
            setUserRole("customer");
          }
        } catch (e) {
          console.error(e);
          setUserRole("vendor");
          setUserName(currentUser.displayName || "Shop Vendor");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // Redirect to our internal SSO Bridge which handles the Auth Center handoff
    window.location.href = "/login";
  };

  const handleClaimStaffRole = async () => {
    if (!claimCode) return;
    setClaiming(true);
    try {
      if (claimCode === pendingStaffInvite.accessCode) {
        // Update user document
        await setDoc(doc(db, "users", user!.uid), {
          name: user!.displayName || 'Staff',
          email: user!.email,
          role: 'vendor_staff',
          bossUid: pendingStaffInvite.bossUid,
          vendorPermissions: pendingStaffInvite.permissions,
          createdAt: new Date().toISOString()
        }, { merge: true });

        // Update local state
        setUserRole('vendor_staff');
        setVendorPermissions(pendingStaffInvite.permissions);
        localStorage.setItem("sd_boss_uid", pendingStaffInvite.bossUid);
        
        // Delete the invite
        await deleteDoc(doc(db, "staff_invites", pendingStaffInvite.id));
        setPendingStaffInvite(null);
        alert('Staff account successfully linked!');
      } else {
        alert('Invalid Access Code. Please check with the shop owner.');
      }
    } catch (e) {
      console.error("Failed to claim staff role", e);
      alert('An error occurred.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#C5A059]">Loading Vendor Portal...</div>;
  }

  if (userRole === "customer" && !pendingStaffInvite) {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Redirecting to User Panel...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            🏪
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Portal</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to manage your shop, inventory, and live rates.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-[#0066CC] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#0052A3] transition-colors shadow-md flex items-center justify-center gap-3"
          >
            <span>🔐</span> Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  if (pendingStaffInvite) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            🛡️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Claim Staff Account</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            You have been appointed as staff ({pendingStaffInvite.role}) by your shop owner. 
            Please provide the Access Code they gave you to link your account.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Access Code</label>
              <input 
                type="text" 
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-black font-bold tracking-widest text-center"
                placeholder="ENTER CODE"
              />
            </div>
            <button 
              onClick={handleClaimStaffRole}
              disabled={!claimCode || claiming}
              className="w-full bg-[#C5A059] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#996515] transition-colors shadow-md disabled:opacity-50"
            >
              {claiming ? 'Verifying...' : 'Link Account & Enter Dashboard'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderProLock = () => (
     <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm max-w-2xl mx-auto mt-10">
         <div className="text-5xl mb-4">🔒</div>
         <h2 className="text-2xl font-black text-gray-900 mb-2">Pro Feature Locked</h2>
         <p className="text-gray-500 mb-8 font-medium">You must upgrade to the Pro Tier to unlock this module.</p>
         <button onClick={() => setIsUpgraderOpen(true)} className="bg-gradient-to-r from-[#C5A059] to-[#996515] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Upgrade to Pro</button>
     </div>
  );

  const renderContent = () => {
    // The shop ID is mapped correctly based on role
    const resolvedShopId = userRole === "vendor_staff" 
      ? (typeof window !== "undefined" ? localStorage.getItem("sd_boss_uid") : "") 
      : (typeof window !== "undefined" ? localStorage.getItem("sd_current_vendor_shop_id") : "");

    switch(activeTab) {
      case "dashboard":
        return <VendorDashboardOverview shopId={resolvedShopId as string} />;
      case "profile":
        return <ProfileBuilder shopId={resolvedShopId as string} />;
      case "metal_rates":
        if (subscriptionTier === "free") return renderProLock();
        return <MetalRates onNext={() => setActiveTab("making_charges")} />;
      case "making_charges":
        if (subscriptionTier === "free") return renderProLock();
        return <MakingCharges onNext={() => setActiveTab("taxes")} />;
      case "taxes":
        if (subscriptionTier === "free") return renderProLock();
        return <Taxes />;
      case "kyc":
        return <KYCUpload shopId={resolvedShopId as string} />;
      case "staff":
        if (subscriptionTier === "free") return renderProLock();
        return <StaffManagement shopId={resolvedShopId as string} subscriptionTier={subscriptionTier} />;
      case "subscription":
        return <PricingTab userRole="shop" />;
      case "vanity_url":
        if (subscriptionTier === "free") return renderProLock();
        return <VanityUrlManager currentSlug={user?.uid} roleType="shop" />;
      case "products":
        if (subscriptionTier === "free") return renderProLock();
        return <ManageProducts />;
      case "auctions":
        if (subscriptionTier === "free") return renderProLock();
        return <ManageAuctions />;
      case "inquiries":
        return <InquiryInbox />;
      case "jobs":
        if (subscriptionTier !== "advance" && subscriptionTier !== "pro_advance") {
          return (
             <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm max-w-2xl mx-auto mt-10">
                 <div className="text-5xl mb-4">🔒</div>
                 <h2 className="text-2xl font-black text-gray-900 mb-2">Advance Feature Locked</h2>
                 <p className="text-gray-500 mb-8 font-medium">You must upgrade to the Pro Advance Tier to post jobs and receive candidate applications.</p>
                 <button onClick={() => setIsUpgraderOpen(true)} className="bg-gradient-to-r from-[#C5A059] to-[#996515] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Upgrade to Advance</button>
             </div>
          );
        }
        return <VendorJobsManager shopId={resolvedShopId as string} />;
      case "activity":
        if (userRole !== "vendor") {
          return (
             <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm max-w-2xl mx-auto mt-10">
                 <div className="text-5xl mb-4">⛔</div>
                 <h2 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h2>
                 <p className="text-gray-500 mb-8 font-medium">Only the Shop Owner can view the Activity Log and Audit Trail.</p>
             </div>
          );
        }
        if (subscriptionTier === "free") return renderProLock();
        return <ActivityLog shopId={resolvedShopId as string} />;
      default:
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 min-h-[400px] flex items-center justify-center animate-in fade-in duration-500 shadow-sm">
            <div className="text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
               </div>
               <h2 className="text-xl font-bold text-gray-900 mb-2">Module "{activeTab}" is empty</h2>
               <p className="text-sm text-gray-500 max-w-sm mx-auto">This section has been reset to a clean slate. Ready for custom feature implementation.</p>
            </div>
          </div>
        );
    }
  };

  const isImpersonating = typeof window !== "undefined" && localStorage.getItem("admin_impersonating_shop");

  let activeNavItems = VENDOR_NAV_ITEMS;
  if (userRole === "vendor_staff") {
    activeNavItems = [
      { id: "dashboard", label: "Dashboard Overview", category: "Dashboard" }
    ];
    if (vendorPermissions.includes("rates")) {
      activeNavItems.push({ id: "metal_rates", label: "Live Metal Rates", category: "Global Pricing Engine" });
      activeNavItems.push({ id: "making_charges", label: "Design & Making Charges", category: "Global Pricing Engine" });
    }
    if (vendorPermissions.includes("products")) {
      activeNavItems.push({ id: "products", label: "Manage Products", category: "Inventory" });
      activeNavItems.push({ id: "auctions", label: "Live Auctions", category: "Sales & Leads" });
    }
    if (vendorPermissions.includes("inquiries")) {
      activeNavItems.push({ id: "inquiries", label: "Inquiry Inbox", category: "Sales & Leads" });
    }
  }

  return (
    <>
      <SaaSUpgraderModal isOpen={isUpgraderOpen} onClose={() => setIsUpgraderOpen(false)} />
      {isImpersonating && (
        <div className="bg-amber-500 text-white px-4 py-2 text-sm font-bold flex justify-between items-center z-50 relative sticky top-0">
          <div className="flex items-center gap-2">
            <span>👀</span> You are currently viewing this shop as an Admin (Impersonation Mode)
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_impersonating_shop");
              window.location.href = "/admin";
            }}
            className="bg-black/20 hover:bg-black/30 px-3 py-1 rounded transition-colors"
          >
            Exit Impersonation
          </button>
        </div>
      )}
      <DashboardLayout
        userName={userName}
        userRole={userRole}
        navItems={activeNavItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </DashboardLayout>
    </>
  );
}
