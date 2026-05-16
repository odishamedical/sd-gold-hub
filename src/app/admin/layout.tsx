import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-midnight text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-display sd-gold-text">Sovereign Admin</h2>
        </div>
        <nav className="flex flex-col gap-4">
          <a href="/admin" className="px-4 py-2 rounded-lg bg-gold-primary/10 text-gold-primary font-bold">Dashboard</a>
          <a href="/admin/products" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Products</a>
          <a href="/admin/orders" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Orders</a>
          <a href="/admin/settings" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Settings</a>
        </nav>
        <div className="mt-auto">
          <button className="w-full text-left px-4 py-2 rounded-lg text-sd-text-muted hover:text-white hover:bg-white/5 transition-colors">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}
