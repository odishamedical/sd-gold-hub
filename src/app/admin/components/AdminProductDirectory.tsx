import React, { useState, useEffect } from 'react';
import { Search, Package, Store, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types/gold-hub';
import { getAllAdminProducts, updateProductStatus, deleteProduct } from '@/lib/firestore/products';

export default function AdminProductDirectory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterShop, setFilterShop] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPurity, setFilterPurity] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const prods = await getAllAdminProducts();
    setProducts(prods);
    setLoading(false);
  };

  const handleToggleSold = async (p: Product) => {
    const newStatus = p.status === 'sold' ? 'active' : 'sold';
    if (!confirm(`Mark this product as ${newStatus.toUpperCase()}?`)) return;
    await updateProductStatus(p.id, newStatus);
    setProducts(products.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this product?")) return;
    await deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  // Extract unique values for filters
  const shops = Array.from(new Set(products.map(p => p.shopName).filter(Boolean)));
  const categories = Array.from(new Set(products.map(p => p.categoryId).filter(Boolean)));
  const purities = Array.from(new Set(products.map(p => p.metalPurityId).filter(Boolean)));
  
  const filtered = products.filter(p => {
    if (search && !p.designName.toLowerCase().includes(search.toLowerCase()) && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterShop && p.shopName !== filterShop) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    if (filterCategory && p.categoryId !== filterCategory) return false;
    if (filterPurity && p.metalPurityId !== filterPurity) return false;
    return true;
  });

  if (loading) return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] items-center justify-center">
      Loading Directory...
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Global Products Directory
          </h2>
          <p className="text-sm text-gray-500 mt-1">Search, filter, and manage all products across the platform.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50/50 p-6 custom-scrollbar">
        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search name/title..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={filterShop} onChange={e => setFilterShop(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Shops</option>
            {shops.map((s: any) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Categories</option>
            {categories.map((c: any) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterPurity} onChange={e => setFilterPurity(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Purities</option>
            {purities.map((p: any) => <option key={p} value={p}>{p === 'm1' ? '24K Gold' : '22K Gold'}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold Out</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-900">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map(product => (
              <div key={product.id} className={`bg-white rounded-2xl border ${product.status === 'sold' ? 'border-red-200' : 'border-gray-200'} shadow-sm overflow-hidden flex flex-col relative`}>
                {product.status === 'sold' && (
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">SOLD OUT</div>
                )}
                <div className="aspect-[4/3] bg-black relative overflow-hidden">
                  <img src={product.images?.[0] || ''} className={`w-full h-full object-cover opacity-90 ${product.status==='sold' ? 'grayscale' : ''}`} />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 line-clamp-1" title={product.designName}>{product.designName}</h3>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{product.categoryId} • {product.metalPurityId === 'm1' ? '24K' : '22K'}</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1 line-clamp-1"><Store className="w-3 h-3 shrink-0"/> {product.shopName || 'Unknown Shop'}</p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-[#C5A059] text-lg">₹ {product.price?.toLocaleString('en-IN') || '---'}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleSold(product)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 tooltip-trigger" title="Toggle Sold Status">
                        <Package className="w-4 h-4" />
                      </button>
                      <Link href={`/product/${product.id}`} target="_blank" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="View Public Page">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Delete Product">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
