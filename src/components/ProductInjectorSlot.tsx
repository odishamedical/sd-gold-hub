"use client";
import React, { useEffect, useState } from "react";
import { getRecentProducts } from "@/lib/firestore/products";
import ProductCard from "./ProductCard";

export default function ProductInjectorSlot({ configStr }: { configStr: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let limitCount = 4;
    try {
      const config = JSON.parse(configStr);
      if (config.limit) limitCount = config.limit;
    } catch (e) {
      // ignore
    }

    getRecentProducts(limitCount).then(res => {
      if (res && res.length > 0) {
        setProducts(res);
      }
    });
  }, [configStr]);

  if (products.length === 0) return null;

  return (
    <div className="w-full h-full bg-[#0A1021] relative overflow-hidden p-4 md:p-6">
      <div className="absolute top-2 right-2 bg-[#C5A059] text-[#0A1021] text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-lg z-20">Sponsored Display</div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Trending Nearby</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-[#C5A059]/30 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {products.map(product => {
          const mappedProduct = {
            id: product.id,
            subcategoryId: product.subcategoryId,
            title: product.title || product.designName,
            image: product.images?.[0] || product.img || product.image || 'https://placehold.co/400x400?text=No+Image',
            price: product.price || 100000,
            karat: product.metalPurityId || product.karat || "22K Gold",
            weightGrams: product.weightGrams || product.weight,
            isVerified: true,
            storeName: product.storeName || "Premium Jeweler"
          };
          return <ProductCard key={product.id} product={mappedProduct} />;
        })}
      </div>
    </div>
  );
}
