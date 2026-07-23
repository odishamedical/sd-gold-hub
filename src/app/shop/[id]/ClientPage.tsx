"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MapPin, Phone, Star, ShieldCheck, Globe, Share2 } from 'lucide-react';
import { getShopById, getShopLiveRates, getShopProducts, getRecentProducts } from '@/lib/firestore/products';
import FollowShopButton from '@/components/FollowShopButton';
import ProductCard from '@/components/ProductCard';
import GlobalBannerSlot from '@/components/GlobalBannerSlot';

export default function ClientPage({ shopId }: { shopId: string }) {
  const [shop, setShop] = useState<any>(null);
  const [liveRates, setLiveRates] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const decodedId = decodeURIComponent(shopId);
        const [fetchedShop, fetchedRates, fetchedProducts] = await Promise.all([
          getShopById(decodedId),
          getShopLiveRates(decodedId),
          getShopProducts(decodedId)
        ]);

        if (!fetchedShop) {
          window.location.href = '/404'; // trigger 404
          return;
        }

        setShop(fetchedShop);
        setLiveRates(fetchedRates);
        
        const isClaimed = !!fetchedShop.ownerUid;
        if (!isClaimed && (!fetchedProducts || fetchedProducts.length === 0)) {
          const recent = await getRecentProducts(10);
          setProducts(recent);
        } else {
          setProducts(fetchedProducts || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [shopId]);

  if (loading) {
    return <div className="min-h-screen bg-[#060A14] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!shop) return null;
  const isClaimed = !!shop.ownerUid;

  return (
    <main className="min-h-screen bg-[#060A14] text-[#E2E8F0] font-sans pb-24 relative">
      
      {/* Ambient Stardust Background (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        
        {/* Navigation & SEO Tag */}
        <Breadcrumbs items={[
          { label: shop.location?.country || "India", href: "/directory" },
          { label: shop.location?.state || "Odisha", href: `/directory/${encodeURIComponent((shop.location?.country || 'India').toLowerCase())}/${encodeURIComponent((shop.location?.state || 'Odisha').toLowerCase())}` },
          { label: shop.location?.district || "Jharsuguda", href: `/directory/${encodeURIComponent((shop.location?.country || 'India').toLowerCase())}/${encodeURIComponent((shop.location?.state || 'Odisha').toLowerCase())}/${encodeURIComponent((shop.location?.district || 'Jharsuguda').toLowerCase())}` },
          { label: shop.name }
        ]} className="mb-6" />
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ========================================= */}
          {/* LEFT COLUMN: Main Showroom Content        */}
          {/* ========================================= */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            
            {/* Header / Logo / Name */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-white/10 bg-[#141C33] flex-shrink-0 overflow-hidden shadow-xl">
                {shop.logoUrl ? (
                  <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-[family-name:var(--font-display)] text-3xl">
                    {shop.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-display)] text-white tracking-wide mb-2">{shop.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  <span className="flex items-center gap-1 text-[#9CA3AF]"><MapPin className="w-3.5 h-3.5" /> {shop.address}</span>
                  <span className="text-[#333]">•</span>
                  {shop.subscriptionTier === 'ELITE' ? (
                    <span className="flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded text-[#D4AF37] shadow-inner"><Star className="w-3 h-3 fill-[#D4AF37]"/> Elite Partner</span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded"><ShieldCheck className="w-3.5 h-3.5"/> Verified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tightly Packed Image Collage (Hero Row) */}
            {shop.coverImages && shop.coverImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mt-2 border border-white/5 shadow-2xl">
                {shop.coverImages.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className={`bg-[#0A0F1C] relative group ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-video md:aspect-auto' : 'aspect-[4/3]'}`}>
                    <img src={img} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={`Showroom ${i+1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full aspect-[21/9] md:aspect-[32/9] rounded-2xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center mt-2">
                 <span className="text-[#C5A059] opacity-40 font-bold uppercase tracking-widest text-sm">No Showroom Images Uploaded</span>
              </div>
            )}

            {/* Our Heritage & Map */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mt-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.03] blur-[60px] rounded-full pointer-events-none" />
              
              <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-4">Our Heritage</h3>
              <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed mb-8">
                {shop.description || `For generations, ${shop.name} has crafted timeless pieces of art from gold and precious stones, building a legacy of trust, purity, and elegance in the heart of ${shop.location?.district || shop.location?.state || 'your city'}.`}
              </p>
              
              <div className="rounded-2xl overflow-hidden border border-white/10 h-64 bg-[#0A0F1C] shadow-inner">
                <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.name + " " + shop.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}></iframe>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="mt-8">
               <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-[family-name:var(--font-display)] text-white uppercase tracking-widest">
                    {isClaimed ? "Showroom Masterpieces" : "Trending Jewelry"}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
               </div>
               
               {products.length === 0 ? (
                 <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                    <p className="text-gray-500 font-mono tracking-widest uppercase">No products uploaded yet.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {products.map((product) => {
                      const mappedProduct = {
                        id: product.id,
                        subcategoryId: product.subcategoryId,
                        title: product.title || product.designName,
                        image: product.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
                        price: product.price || 100000,
                        karat: product.metalPurityId,
                        weightGrams: product.weightGrams,
                        isVerified: shop.isVerified,
                        storeName: shop.name
                      };
                      return <ProductCard key={product.id} product={mappedProduct} />;
                    })}
                 </div>
               )}
            </div>

          </div>

          {/* ========================================= */}
          {/* RIGHT SIDEBAR: Action Console & Ads       */}
          {/* ========================================= */}
          <aside className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6 relative">
            
            {/* The High-Conversion Action Box */}
            <div className="bg-gradient-to-b from-[#0A1021] to-[#060A14] border border-[#D4AF37]/30 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-[0.05] blur-[40px] rounded-full pointer-events-none" />
              
              <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-between text-[#C5A059] mb-6">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Rates</span>
                <span className="opacity-50">Today</span>
              </h3>
              
              {liveRates ? (
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[#D4AF37] font-bold text-3xl tracking-wider">₹{liveRates.rate24K?.toLocaleString() || 'N/A'}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">24K Pure Gold /g</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xl tracking-wider">₹{liveRates.rate22K?.toLocaleString() || 'N/A'}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">22K Standard /g</span>
                      </div>
                    </div>
                 </div>
              ) : (
                 <div className="text-center text-gray-500 text-xs py-4 font-mono mb-8">Rates temporarily unavailable</div>
              )}

              <div className="space-y-3">
                 {shop.phone && (
                   <>
                     <a href={`tel:${shop.phone}`} className="w-full flex items-center justify-center gap-3 bg-[#D4AF37] text-black hover:bg-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02]">
                       <Phone className="w-4 h-4" /> Call Shop
                     </a>
                     <a href={`https://wa.me/${shop.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-3 bg-[#0E1528] hover:bg-[#15203D] border border-green-500/30 text-green-400 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02]">
                       <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                       WhatsApp
                     </a>
                   </>
                 )}
                 <FollowShopButton shopId={shop.id} />
              </div>
            </div>

            {/* Unclaimed Call To Action */}
            {!isClaimed && (
              <div className="bg-[#141C33] border border-[#D4AF37]/30 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
                  <Star className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="text-white font-bold mb-2 tracking-wide text-lg">Claim this Store</h4>
                <p className="text-xs text-gray-400 mb-6 font-light leading-relaxed">Manage your live inventory, update daily gold rates, and add showroom photos entirely for free.</p>
                <Link href="/claim" className="inline-block bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-colors shadow-xl">Claim Free Profile</Link>
              </div>
            )}

            {/* Sticky Global Banner Ad */}
            <div className="sticky top-24">
              <GlobalBannerSlot placementId="sidebar" context={{ audience: "shops", specificId: shopId }} />
            </div>

          </aside>

        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0A0F1C]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {shop.phone && (
          <>
            <a href={`tel:${shop.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest"><Phone className="w-4 h-4"/> Call</a>
            <a href={`https://wa.me/${shop.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#0E1528] border border-green-500/30 text-green-400 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest"><svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>
          </>
        )}
      </div>

    </main>
  );
}
