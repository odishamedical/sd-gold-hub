"use client";
import React, { useEffect, useState } from "react";
import { getShopById, getRecentShops } from "@/lib/firestore/shops";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ShieldCheck } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/image-proxy";

export default function ShopInjectorSlot({ configStr }: { configStr: string }) {
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    let sourceShopId = "";
    try {
      const config = JSON.parse(configStr);
      if (config.sourceShopId) sourceShopId = config.sourceShopId;
    } catch (e) {
      // ignore
    }

    if (sourceShopId) {
      getShopById(sourceShopId).then(res => {
        if (res) {
          setShop(res);
        }
      });
    } else {
      getRecentShops(1).then(res => {
        if (res && res.length > 0) {
          setShop(res[0]);
        }
      });
    }
  }, [configStr]);

  if (!shop) return null;

  return (
    <div className="w-full h-full bg-[#0A1021] relative overflow-hidden p-4 md:p-6 rounded-2xl border border-[#C5A059]/30">
      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-lg z-20">
        Recommended Jeweler
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-center md:items-start">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-[#C5A059]/30 bg-[#141C33] flex-shrink-0 overflow-hidden shadow-[0_0_20px_rgba(197,160,89,0.2)] relative">
          {shop.logoUrl ? (
             <img src={getProxiedImageUrl(shop.logoUrl, `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=141C33&color=D4AF37`)} alt={shop.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=141C33&color=D4AF37`; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              {shop.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-[family-name:var(--font-display)] text-white tracking-wide mb-2">{shop.name}</h3>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
            <span className="flex items-center gap-1 text-[#9CA3AF]"><MapPin className="w-3.5 h-3.5" /> {shop.address}</span>
            <span className="text-[#333]">•</span>
            {shop.subscriptionTier === 'ELITE' ? (
              <span className="flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded text-[#D4AF37]"><Star className="w-3 h-3 fill-[#D4AF37]"/> Elite Partner</span>
            ) : shop.isVerified ? (
              <span className="flex items-center gap-1 text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded"><ShieldCheck className="w-3.5 h-3.5"/> Verified</span>
            ) : null}
          </div>
          
          <p className="text-sm text-gray-400 mb-4 line-clamp-2 max-w-xl">
             {shop.description || `Discover authentic gold jewelry at ${shop.name}, located in ${shop.location?.city || shop.location?.district}.`}
          </p>
          
          <Link href={`/gold-shop/${shop.slug || shop.id}`} className="bg-[#C5A059] text-black font-bold px-6 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)]">
            Visit Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
