import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-display mb-8">Command Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="sd-glass-card p-6 border border-gold-primary/20">
          <p className="text-sm text-sd-text-muted uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-bold sd-gold-text">₹ 14,50,000</p>
        </div>
        <div className="sd-glass-card p-6">
          <p className="text-sm text-sd-text-muted uppercase tracking-wider mb-2">Active Orders</p>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="sd-glass-card p-6">
          <p className="text-sm text-sd-text-muted uppercase tracking-wider mb-2">Verified Vendors</p>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      <div className="sd-glass-card p-8">
        <h2 className="text-2xl font-display mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <p className="font-bold">New Order #4029</p>
              <p className="text-sm text-sd-text-muted">Celestial Diamond Solitaire</p>
            </div>
            <p className="text-gold-primary">Just now</p>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <p className="font-bold">Vendor Approval</p>
              <p className="text-sm text-sd-text-muted">Royal Diamonds applied for Tier 3</p>
            </div>
            <p className="text-sd-text-muted">2 hours ago</p>
          </div>
          <div className="flex justify-between items-center pb-4">
            <div>
              <p className="font-bold">System Update</p>
              <p className="text-sm text-sd-text-muted">Live Gold Rate automatically updated</p>
            </div>
            <p className="text-sd-text-muted">5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
