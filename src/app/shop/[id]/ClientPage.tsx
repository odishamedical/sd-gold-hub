"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MapPin, Phone, Star, ShieldCheck, Globe, Share2 } from 'lucide-react';
import { getShopById, getShopLiveRates, getShopProducts, getRecentProducts } from '@/lib/firestore/products';
import FollowShopButton from '@/components/FollowShopButton';
import ProductCard from '@/components/ProductCard';
import GlobalBannerSlot from '@/components/GlobalBannerSlot';

function getTimeAgo(timestamp?: number) {
  if (!timestamp) return 'recently';
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function ClientPage({ shopId }: { shopId: string }) {
  const [shop, setShop] = useState<any>(null);
  const [liveRates, setLiveRates] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);

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

  const adContext = {
    audience: "shops" as const,
    specificId: shopId,
    shopVerificationStatus: shop.isVerified ? "verified" as const : "unverified" as const,
    shopLocation: { city: shop.location?.city, district: shop.location?.district, state: shop.location?.state, country: shop.location?.country }
  };

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

            {/* Tightly Packed Image Collage (5-Image Bento Box) */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden mt-2 border border-white/5 shadow-2xl h-[300px] md:h-[400px]">
              {Array.from({ length: 5 }).map((_, i) => {
                const img = shop.coverImages?.[i] || "https://placehold.co/600x400/0A0F1C/333333?text=Add+Photo";
                return (
                  <div key={i} className={`bg-[#0A0F1C] relative group ${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}>
                    <img src={img} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={`Showroom ${i+1}`} />
                    {!shop.coverImages?.[i] && !isClaimed && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                         <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest px-4 py-2 border border-[#D4AF37] rounded-full backdrop-blur-md">Upload Image</span>
                       </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Our Heritage */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mt-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.03] blur-[60px] rounded-full pointer-events-none" />
              
              <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-4">Our Heritage</h3>
              <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed mb-6">
                {shop.description || `For generations, ${shop.name} has crafted timeless pieces of art from gold and precious stones, building a legacy of trust, purity, and elegance in the heart of ${shop.location?.district || shop.location?.state || 'your city'}.`}
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-6">
                {shop.establishmentYear && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 shrink-0">
                      <Star className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-[#9CA3AF] uppercase tracking-widest font-bold">Established</span>
                      <span className="block text-sm font-bold text-white">Since {shop.establishmentYear}</span>
                    </div>
                  </div>
                )}
                {shop.gstNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-[#9CA3AF] uppercase tracking-widest font-bold">Tax Compliance</span>
                      <span className="block text-sm font-bold text-blue-200">GST Verified</span>
                    </div>
                  </div>
                )}
                {shop.hallmarkLicence && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                      <svg className="w-5 h-5 text-green-400 fill-current" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div>
                      <span className="block text-[9px] text-[#9CA3AF] uppercase tracking-widest font-bold">Purity Guarantee</span>
                      <span className="block text-sm font-bold text-green-200">BIS Hallmarked</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Empty State / Fallback Injector */}
            {products.length === 0 && (
              <div className="mt-8">
                <GlobalBannerSlot placementId="shop_empty_state" context={adContext} />
              </div>
            )}

            {/* Catalog Grid */}
            {products.length > 0 && (
              <div className="mt-8">
                 <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-white uppercase tracking-widest">
                      {isClaimed ? "Showroom Masterpieces" : "Trending Jewelry"}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {products.map((product, index) => {
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
                      
                      const showInterstitial = (index === 3 || index === 11); // Inject after 4th and 12th product
                      
                      return (
                        <React.Fragment key={product.id}>
                          <ProductCard product={mappedProduct} />
                          {showInterstitial && (
                            <div className="col-span-2 md:col-span-3 xl:col-span-4 w-full">
                              <GlobalBannerSlot placementId="shop_grid_interstitial" context={adContext} />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                 </div>
              </div>
            )}

          </div>

          {/* ========================================= */}
          {/* RIGHT SIDEBAR: Action Console & Ads       */}
          {/* ========================================= */}
          <aside className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6 relative z-10">

            {/* Unclaimed Call To Action (Premium Green Glass Ticket) */}
            {!isClaimed && (
              <div className="w-full relative group">
                {/* Soft glowing background to make the ticket appealing */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] rounded-[30px] pointer-events-none -z-10" />
                
                <div className="bg-gradient-to-br from-emerald-900/30 to-[#0A0F1C]/80 backdrop-blur-xl border border-[#FFB6C1]/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-inset ring-[#FFB6C1]/20 animate-[pulse_3s_ease-in-out_infinite] hover:border-[#FFB6C1]/60 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  
                  {/* Top Line: Single Line, Normal Case */}
                  <div className="w-full relative z-10 mb-3">
                    <h4 className="text-sm md:text-[15px] text-emerald-100/90 font-bold text-center w-full drop-shadow-md tracking-wide">
                      Are you the owner of this shop?
                    </h4>
                  </div>
                  
                  {/* Bottom Line: Large Green Button & Heartbeat */}
                  <div className="flex items-center gap-4 relative z-10 w-full justify-center">
                    <Link href="/claim" className="flex-1 max-w-[220px] text-center bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-black font-[family-name:var(--font-display)] text-lg md:text-xl px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 font-bold tracking-widest hover:scale-105 border border-green-400/50">
                      Claim Now
                    </Link>
                    
                    {/* Heartbeat glowing dot */}
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-[#FFB6C1]/30 shadow-inner shrink-0">
                       <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
                       <span className="relative w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ad Injection: Below Claim Ticket */}
            <GlobalBannerSlot placementId="shop_sidebar_top" context={adContext} />
            
            {/* The High-Conversion Action Box (Thick White Frosted Glass) */}
            <div className="relative">
              {/* Subtle background glow to make the glass pop */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#D4AF37]/5 blur-[60px] rounded-[40px] pointer-events-none -z-10" />
              
              {/* The Frosted Glass Container - exactly matching the reference image */}
              <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl p-6 relative overflow-hidden">
                {/* Subtle inner highlight simulating glass thickness */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-3xl" />
              
              <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-between text-[#FFB6C1] mb-6">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Live Rates</span>
                <span className="opacity-70 text-[9px] tracking-widest">{getTimeAgo(liveRates?.lastUpdated)}</span>
              </h3>
              
              {liveRates ? (
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[#FFB6C1] font-[family-name:var(--font-display)] font-bold text-3xl tracking-wider">₹{liveRates.rate24K?.toLocaleString() || 'N/A'}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">24K Pure Gold /g</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-[#B76E79]/20 pt-4">
                      <div className="flex flex-col">
                        <span className="text-white font-[family-name:var(--font-display)] font-bold text-xl tracking-wider">₹{liveRates.rate22K?.toLocaleString() || 'N/A'}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">22K Standard /g</span>
                      </div>
                    </div>
                 </div>
              ) : (
                 <div className="text-center bg-black/40 border border-[#B76E79]/20 rounded-xl p-4 mb-8">
                   <p className="text-[#FFB6C1] text-xs font-mono mb-1">Rates temporarily unavailable.</p>
                   <p className="text-gray-400 text-[10px]">Shop owner has not updated prices recently.</p>
                 </div>
              )}

              {/* Shop Analytics (Trust Signals) */}
              {products.length > 0 && (
                <div className="mb-6 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-full py-2">
                  <span className="text-lg">💎</span>
                  <span className="text-xs text-[#FFB6C1] font-bold tracking-widest uppercase">{products.length} Masterpieces Displayed</span>
                </div>
              )}

              {/* Compact Action Rows */}
              <div className="space-y-3">
                 {/* Row 1: Contact */}
                 {shop.phone && (
                   <div className="flex gap-3">
                     <a href={`tel:${shop.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#B76E79] to-[#D48F9A] text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(183,110,121,0.3)] hover:scale-[1.02]">
                       <Phone className="w-3.5 h-3.5" /> Call Us
                     </a>
                     <a href={`https://wa.me/${(shop.whatsappNumber || shop.phone).replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-400 text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-[1.02]">
                       <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                       WhatsApp
                     </a>
                   </div>
                 )}
                 {/* Row 2: Website (If available) */}
                 {shop.website && (
                    <div className="flex">
                      <a href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:scale-[1.02]">
                        <Globe className="w-3.5 h-3.5" /> Visit Official Website
                      </a>
                    </div>
                 )}
                 {/* Row 3: Share */}
                 <div className="flex gap-3">
                    <button onClick={() => {
                        const url = typeof window !== 'undefined' ? window.location.href : '';
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }} className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
                      <Globe className="w-3.5 h-3.5" /> Share FB
                    </button>
                    <button onClick={() => {
                        const url = typeof window !== 'undefined' ? window.location.href : '';
                        window.open(`https://wa.me/?text=${encodeURIComponent("Check out this amazing shop: " + url)}`, '_blank');
                    }} className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
                      <Share2 className="w-3.5 h-3.5" /> Share WA
                    </button>
                 </div>
                 
                 {/* Ultimate Social Proof Follow Button */}
                 <div className="flex items-center justify-between bg-black/30 rounded-xl p-2 border border-white/5 mt-4">
                    <div className="w-[140px]">
                      <FollowShopButton shopId={shop.id} />
                    </div>
                    <div className="flex-1 text-right pr-3">
                       <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Followed by</span>
                       <span className="text-[#FFB6C1] font-bold text-xs">❤️ {shop.followers || shop.followerCount || 0} Users</span>
                    </div>
                 </div>
              </div>
              </div>
            </div>

            {/* Ad Injection: Below Action Console */}
            <GlobalBannerSlot placementId="shop_sidebar_middle" context={adContext} />

            {/* Square Map Sidebar Widget (Thick White Frosted Glass) */}
            <div className="relative cursor-pointer group" onClick={() => setIsMapOpen(true)}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#D4AF37]/5 blur-[60px] rounded-[40px] pointer-events-none -z-10" />
              <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl p-6 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-3xl" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2 drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Find us on Google Maps
                </h3>
                <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/20 relative shadow-inner bg-black/20">
                  <iframe width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.name + " " + shop.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}></iframe>
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                     <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> Click to Enlarge
                     </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Injection: Below Map */}
            <GlobalBannerSlot placementId="shop_sidebar_bottom" context={adContext} />

            {/* Sticky Global Banner Ad */}
            <div className="sticky top-24">
              <GlobalBannerSlot placementId="sidebar" context={adContext} />
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

      {/* Map Popup Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[80vh] bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20 bg-white/5 relative z-10">
              <h3 className="text-white font-[family-name:var(--font-display)] tracking-widest uppercase text-xl md:text-2xl flex items-center gap-3 drop-shadow-lg">
                <MapPin className="text-[#D4AF37]" /> {shop.name} Location
              </h3>
              <button onClick={() => setIsMapOpen(false)} className="text-white bg-white/10 hover:bg-white/20 border border-white/30 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105">
                Close Map X
              </button>
            </div>
            <div className="flex-1 w-full bg-[#0A0F1C] relative z-10 p-1">
              <iframe width="100%" height="100%" className="rounded-[20px]" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.name + " " + shop.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}></iframe>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
