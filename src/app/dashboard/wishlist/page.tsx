'use client';

import React, { useEffect, useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { getProductById } from '@/lib/firestore/products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/gold-hub';

export default function WishlistPage() {
  const { profile, loading } = useCustomer();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      if (!profile || profile.savedProducts.length === 0) {
        setProducts([]);
        return;
      }
      
      setFetching(true);
      try {
        const fetched = await Promise.all(
          profile.savedProducts.map(id => getProductById(id))
        );
        setProducts(fetched.filter(p => p !== null) as Product[]);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setFetching(false);
      }
    }
    
    if (!loading) {
      loadProducts();
    }
  }, [profile, loading]);

  if (loading) return null;

  if (!profile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
        <p className="text-gray-500">Please sign in to view your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} items saved</p>
        </div>
      </div>

      {fetching ? (
        <div className="py-12 text-center text-gray-500 font-mono">Loading saved items...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
           <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
           </div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
           <p className="text-sm text-gray-500 max-w-sm mx-auto">Explore the directory and click the heart icon to save items here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
