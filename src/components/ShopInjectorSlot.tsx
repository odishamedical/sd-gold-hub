"use client";
import React, { useEffect, useState } from "react";
import { getShopById, getRecentShops } from "@/lib/firestore/shops";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ShieldCheck } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import { generateShopSlug } from "@/lib/utils/seo-routing";

export default function ShopInjectorSlot({ configStr }: { configStr: string }) {
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    let sourceShopIds: string[] = [];
    let limitCount = 4;
    try {
      const config = JSON.parse(configStr);
      if (config.sourceShopId) sourceShopIds = config.sourceShopId.split(",").filter(Boolean);
      if (config.limit) limitCount = config.limit;
    } catch (e) {
      // ignore
    }

    if (sourceShopIds.length > 0) {
      Promise.all(sourceShopIds.map(id => getShopById(id))).then(results => {
        const validShops = results.filter(Boolean);
        setShops(validShops.slice(0, limitCount));
      });
    } else {
      getRecentShops(limitCount).then(res => {
        if (res && res.length > 0) {
          setShops(res);
        }
      });
    }
  }, [configStr]);

  if (shops.length === 0) return null;

  return (
    <div className="w-full h-full bg-[#0A1021] relative overflow-hidden p-4 md:p-6 rounded-2xl border border-[#C5A059]/30">
      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-lg z-20">
        Recommended {shops.length > 1 ? "Jewelers" : "Jeweler"}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none" />
      
      <div className={`grid gap-6 relative z-10 ${shops.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {shops.map(shop => (
          <div key={shop.id} className={`flex ${shops.length === 1 ? 'flex-col md:flex-row items-center md:items-start' : 'flex-col items-center text-center'} gap-4 md:gap-6`}>
            <div className={`w-24 h-24 ${shops.length === 1 ? 'md:w-32 md:h-32' : 'md:w-28 md:h-28'} rounded-2xl border border-[#C5A059]/30 bg-[#141C33] flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(197,160,89,0.2)] relative`}>
              {shop.logoUrl ? (
                 <img src={getProxiedImageUrl(shop.logoUrl, `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=141C33&color=D4AF37`)} alt={shop.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=141C33&color=D4AF37`; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-[family-name:var(--font-display)] text-3xl md:text-4xl">
                  {shop.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className={`flex-1 flex flex-col ${shops.length === 1 ? 'items-center md:items-start text-center md:text-left' : 'items-center text-center'} w-full`}>
              <h3 className="text-lg md:text-xl font-[family-name:var(--font-display)] text-white tracking-wide mb-2 line-clamp-2">{shop.name}</h3>
              
              <div className={`flex flex-wrap ${shops.length === 1 ? 'items-center justify-center md:justify-start' : 'items-center justify-center'} gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3`}>
                <span className="flex items-center gap-1 text-[#9CA3AF]"><MapPin className="w-3.5 h-3.5" /> {shop.address}</span>
                {shop.isVerified && <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>}
                {shop.subscriptionTier === 'ELITE' && <span className="flex items-center gap-1 text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded"><Star className="w-3.5 h-3.5" /> Elite</span>}
              </div>
              
              <p className="text-xs text-gray-400 max-w-lg mb-4 line-clamp-2">{shop.description || "Discover our premium collection of authentic gold and diamond jewelry."}</p>
              
              <Link href={`/gold-shop/${generateShopSlug(shop)}`} className={`mt-auto ${shops.length === 1 ? 'w-full md:w-auto' : 'w-full'} inline-flex items-center justify-center px-6 py-2 bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-colors`}>
                Visit Showroom
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
