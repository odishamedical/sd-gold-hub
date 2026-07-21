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

import { auth, googleProvider, signInWithPopup, onAuthStateChanged } from '@/lib/firebase';
import { User } from 'firebase/auth';

const VENDOR_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard Overview", category: "Dashboard" },
  { id: "profile", label: "Personal & Shop Profile", category: "Profile Builder" },
  { id: "kyc", label: "Verification & KYC", category: "Profile Builder" },
  { id: "staff", label: "Staff Management", category: "Profile Builder" },
  { id: "subscription", label: "Platform Subscription", category: "Monetization" },
  { id: "metal_rates", label: "Live Metal Rates", category: "Global Pricing Engine" },
  { id: "making_charges", label: "Design & Making Charges", category: "Global Pricing Engine" },
  { id: "taxes", label: "Taxes & Fees", category: "Global Pricing Engine" },
  { id: "products", label: "Manage Products", category: "Inventory" },
  { id: "inquiries", label: "Inquiry Inbox", category: "Sales & Leads" },
  { id: "orders", label: "Customer Orders", category: "Sales & Leads" }
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("profile"); // Default to profile builder
  const [userName, setUserName] = useState("Shop Vendor");
  const [userRole, setUserRole] = useState("vendor");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserName(currentUser.displayName || "Shop Vendor");
        setUserRole("vendor");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#C5A059]">Loading Vendor Portal...</div>;
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

  const renderContent = () => {
    switch(activeTab) {
      case "profile":
        return <ProfileBuilder />;
      case "metal_rates":
        return <MetalRates onNext={() => setActiveTab("making_charges")} />;
      case "making_charges":
        return <MakingCharges onNext={() => setActiveTab("taxes")} />;
      case "taxes":
        return <Taxes />;
      case "kyc":
        return <KYCUpload />;
      case "staff":
        return <StaffManagement />;
      case "subscription":
        return <SubscriptionManager />;
      case "products":
        return <ManageProducts />;
      case "inquiries":
        return <InquiryInbox />;
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

  return (
    <DashboardLayout
      userName={userName}
      userRole={userRole}
      navItems={VENDOR_NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
