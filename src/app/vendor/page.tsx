"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout, { NavItem } from '@/components/DashboardLayout';

const VENDOR_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard Overview", category: "Store" },
  { id: "products", label: "Manage Products", category: "Inventory" },
  { id: "orders", label: "Customer Orders", category: "Sales" },
  { id: "profile", label: "Store Profile", category: "Settings" }
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("Shop Vendor");
  const [userRole, setUserRole] = useState("vendor");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("sd_current_user_name");
      const storedRole = localStorage.getItem("sd_current_user_role");
      if (storedName) setUserName(storedName);
      if (storedRole) setUserRole(storedRole);
    }
  }, []);

  const renderContent = () => {
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
