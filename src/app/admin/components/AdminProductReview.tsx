import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import { Product } from '@/types/gold-hub';
import { getPendingProducts, updateProductStatus } from '@/lib/firestore/products';

export default function AdminProductReview() {
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

  if (loading) return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] items-center justify-center">
      Loading Queue...
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-amber-600" /> Review Queue
          </h2>
          <p className="text-sm text-gray-500 mt-1">Products waiting for admin approval before going live.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50/50 p-6 custom-scrollbar">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
            <CheckCircle className="w-16 h-16 text-green-200 mb-4" />
            <p className="text-lg font-bold text-gray-900">All caught up!</p>
            <p className="text-sm">There are no pending products to review.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
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
        )}
      </div>
    </div>
  );
}
