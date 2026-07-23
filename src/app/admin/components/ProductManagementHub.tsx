import React, { useState, useEffect } from 'react';
import { Package, Search, Trash2, ExternalLink, CheckCircle, XCircle, Store, Filter } from 'lucide-react';
import Link from 'next/link';
import { Product, Shop } from '@/types/gold-hub';
import { getPendingProducts, getAllAdminProducts, updateProductStatus, deleteProduct } from '@/lib/firestore/products';
import { getShops } from '@/lib/firestore/shops';
import { getShopSettings, ShopSettings } from '@/lib/firestore/shopSettings';
import UploadProduct from '@/app/vendor/components/products/UploadProduct';

export default function ProductManagementHub() {
  const [activeTab, setActiveTab] = useState<'directory' | 'review' | 'add'>('directory');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Product Management Hub
          </h2>
          <p className="text-sm text-gray-500 mt-1">Global directory, moderation queue, and admin uploads.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'directory' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Directory & Filters
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'review' ? 'bg-amber-50 text-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Review Queue
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'add' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50/50 custom-scrollbar relative">
        {activeTab === 'directory' && <DirectoryTab />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'add' && <AddProductTab />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// DIRECTORY TAB
// ----------------------------------------------------------------------
function DirectoryTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterShop, setFilterShop] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  const shops = Array.from(new Set(products.map(p => p.shopName).filter(Boolean)));
  
  const filtered = products.filter(p => {
    if (search && !p.designName.toLowerCase().includes(search.toLowerCase()) && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterShop && p.shopName !== filterShop) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  if (loading) return <div className="p-8 text-center">Loading Directory...</div>;

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
        </div>
        <select value={filterShop} onChange={e => setFilterShop(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white">
          <option value="">All Shops</option>
          {shops.map((s: any) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white">
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <div key={product.id} className={`bg-white rounded-2xl border ${product.status === 'sold' ? 'border-red-200' : 'border-gray-200'} shadow-sm overflow-hidden flex flex-col relative`}>
              {product.status === 'sold' && (
                <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">SOLD OUT</div>
              )}
              <div className="aspect-[4/3] bg-black relative overflow-hidden">
                <img src={product.images?.[0] || ''} className={`w-full h-full object-cover opacity-90 ${product.status==='sold' ? 'grayscale' : ''}`} />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 line-clamp-1">{product.designName}</h3>
                <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1"><Store className="w-3 h-3"/> {product.shopName || 'Unknown Shop'}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-bold text-[#C5A059] text-lg">₹ {product.price?.toLocaleString('en-IN') || '---'}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleSold(product)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 tooltip-trigger" title="Toggle Sold Status">
                      <Package className="w-4 h-4" />
                    </button>
                    <Link href={`/product/${product.id}`} target="_blank" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
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
  );
}

// ----------------------------------------------------------------------
// REVIEW TAB
// ----------------------------------------------------------------------
function ReviewTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const prods = await getPendingProducts();
    setProducts(prods);
    setLoading(false);
  };

  const handleReview = async (id: string, status: 'active' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status.toUpperCase()} this product?`)) return;
    await updateProductStatus(id, status);
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-8 text-center">Loading Queue...</div>;

  if (products.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
      <CheckCircle className="w-16 h-16 text-green-200 mb-4" />
      <p className="text-lg font-bold text-gray-900">All caught up!</p>
      <p className="text-sm">There are no pending products to review.</p>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-amber-200 rounded-xl p-4 flex gap-6 shadow-sm">
            <img src={p.images?.[0]} className="w-32 h-32 rounded-lg object-cover bg-gray-100" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{p.designName}</h3>
                  <p className="text-sm text-gray-500">{p.title}</p>
                  <div className="mt-2 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded inline-block border border-amber-100">
                    Vendor: {p.shopName || 'Unknown Shop'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#C5A059] text-xl">₹ {p.price?.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">{p.weightGrams}g | {p.stoneDetails?.hasStones ? 'With Stones' : 'No Stones'}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => handleReview(p.id, 'rejected')} className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                  <XCircle className="w-4 h-4"/> Reject
                </button>
                <button onClick={() => handleReview(p.id, 'active')} className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm">
                  <CheckCircle className="w-4 h-4"/> Approve & Publish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ADD PRODUCT TAB
// ----------------------------------------------------------------------
function AddProductTab() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    getShops(true).then(s => {
      setShops(s);
      setLoading(false);
    });
  }, []);

  const handleStartUpload = async () => {
    if (!selectedShopId) return alert("Select a shop first");
    setLoading(true);
    const s = await getShopSettings(selectedShopId);
    setSettings(s);
    setFormReady(true);
    setLoading(false);
  };

  if (formReady) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <UploadProduct 
          settings={settings} 
          shopId={selectedShopId} 
          isAdmin={true} 
          onCancel={() => setFormReady(false)} 
          onSuccess={() => {
            alert("Product successfully uploaded as Admin!");
            setFormReady(false);
            setSelectedShopId('');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Map Product to a Shop</h3>
        <p className="text-sm text-gray-500 mt-2">Select which vendor this product belongs to. The form will inherit their live gold rates and making charges.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Select Vendor / Shop</label>
          <select value={selectedShopId} onChange={e => setSelectedShopId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50">
            <option value="">-- Select a Shop --</option>
            {shops.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.location?.district || 'Unknown location'})</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleStartUpload}
          disabled={!selectedShopId || loading}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
        >
          {loading ? 'Loading Engine...' : 'Continue to Upload Form'}
        </button>
      </div>
    </div>
  );
}
