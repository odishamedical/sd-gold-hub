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
    <main className="min-h-screen bg-[#060A14] text-[#E2E8F0] font-sans pb-20 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-8 md:pt-12">
        
        {/* Navigation & SEO Tag */}
        <Breadcrumbs items={[{ label: "Directory", href: "/directory" }, { label: shop.name }]} className="mb-4" />
        <h1 className="text-lg md:text-xl text-[#9CA3AF] font-light mb-8 tracking-wide">
          Premier <strong className="text-[#D4AF37] font-normal">Gold Jewellery Shop</strong> in {shop.location?.district || shop.location?.state || 'Your Area'}
        </h1>
        
        {/* Premium Glassmorphism Hero Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 flex flex-col lg:flex-row gap-8 md:gap-12 items-start mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
          {/* Subtle glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* Left: Huge Logo */}
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-[6px] border-[#0A1021] bg-[#141C33] flex-shrink-0 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.2)] relative z-10 mx-auto lg:mx-0">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-[family-name:var(--font-display)] text-6xl md:text-8xl">
                {shop.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Middle: Shop Details */}
          <div className="flex-1 w-full relative z-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 flex-wrap">
              {shop.subscriptionTier === 'ELITE' ? (
                <span className="text-[#0A1021] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                  <Star className="w-3 h-3 fill-[#0A1021]" /> Elite Showroom
                </span>
              ) : (
                <span className="text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
              {shop.rating && (
                <span className="text-green-400 bg-green-400/10 px-4 py-1.5 rounded-full border border-green-400/30 flex items-center gap-1">
                  ★ {shop.rating.toFixed(1)}
                </span>
              )}
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-display)] text-white tracking-wide mb-5 leading-tight">
              {shop.name}
            </h2>

            <div className="flex flex-col gap-3 text-sm text-[#E2E8F0] mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="max-w-md leading-relaxed opacity-90">{shop.address}</span>
              </div>
              {shop.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#4285F4] shrink-0" />
                  <a href={shop.website} target="_blank" rel="noreferrer" className="text-[#4285F4] hover:underline transition-colors max-w-md truncate">
                    {shop.website}
                  </a>
                </div>
              )}
            </div>

            <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
              <p className="text-[#9CA3AF] font-light text-base leading-relaxed">
                {shop.description || `Welcome to ${shop.name}, the premier destination for authentic gold and diamond jewellery. We offer a curated collection of BIS hallmarked masterpieces crafted to perfection.`}
              </p>
            </div>
          </div>

          {/* Right: Action Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-4 relative z-10 shrink-0">
            
            {/* Top Row: Follow & Share */}
            <div className="grid grid-cols-2 gap-3">
              <FollowShopButton shopId={shop.id} />
              
              <button onClick={() => alert('Share options coming soon!')} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group">
                <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" /> Share Us
              </button>
            </div>

            {/* Middle Row: Call & Whatsapp */}
            {shop.phone && (
              <div className="grid grid-cols-2 gap-3 mt-1">
                <a href={`tel:${shop.phone}`} className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#333] text-white py-3.5 px-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                  <Phone className="w-4 h-4 text-[#C5A059]" /> Call Us
                </a>
                <a href={`https://wa.me/${shop.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#0E1528] hover:bg-[#15203D] border border-green-500/30 text-green-400 py-3.5 px-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              </div>
            )}

            {/* Bottom Row: Live Gold Rates Embedded Compactly */}
            <div className="bg-black/40 border border-white/5 shadow-inner rounded-xl p-5 mt-2 transition-all hover:bg-black/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-[#C5A059] mb-4 pb-2 border-b border-white/5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Gold Rates
              </h3>
              {liveRates ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">22K Standard</span>
                    <span className="text-[#D4AF37] font-bold tracking-wider text-base">₹{liveRates.rate22K?.toLocaleString() || 'N/A'} <span className="text-[10px] text-gray-500 font-normal">/g</span></span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">18K Rose/White</span>
                    <span className="text-white font-bold tracking-wider">₹{liveRates.rate18K?.toLocaleString() || Math.floor((liveRates.rate24K||0) * 0.75).toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">/g</span></span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-xs py-2 font-mono">Fetching rates...</div>
              )}
            </div>

          </div>
        </div>

        {/* Showroom Image Gallery */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-[family-name:var(--font-display)] text-white uppercase tracking-widest">
              Showroom Gallery
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          {shop.coverImages && shop.coverImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {shop.coverImages.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg bg-[#0A0F1C]">
                  <img 
                    src={img} 
                    alt={`${shop.name} Gallery ${i + 1}`} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-bold text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">View</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 w-full rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 border-dashed">
              <span className="text-[#C5A059] opacity-40 font-bold uppercase tracking-widest text-sm">No Images Uploaded</span>
            </div>
          )}
        </div>

        {/* Wide Google Map Section */}
        <div className="w-full h-64 md:h-80 bg-[#0E1528] rounded-3xl overflow-hidden border border-[#2A344A] mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.name + " " + shop.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>

        {/* Dynamic Ad Placement */}
        <GlobalBannerSlot placementId="content_top" context={{ audience: "shops", specificId: shopId }} />

        {/* Unclaimed Banner & Fallback Products */}
        {!isClaimed && (
          <div className="bg-gradient-to-r from-[#141C33] to-[#0A1021] border border-[#D4AF37]/40 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="flex items-center gap-4 mb-4 md:mb-0 relative z-10">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/30 flex-shrink-0">
                <Star className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl font-[family-name:var(--font-display)] text-white tracking-wider">Is this your jewelry store?</h3>
                <p className="text-sm text-gray-400 font-light mt-1">Claim this business profile for free to upload your own live inventory and manage daily gold rates.</p>
              </div>
            </div>
            <Link href="/claim" className="shrink-0 bg-[#D4AF37] text-[#0A1021] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-lg relative z-10">
              Claim Profile
            </Link>
          </div>
        )}

        {/* Shop Products Grid */}
        <div className="mb-12">
          <div className="flex justify-between items-end border-b border-[#2A344A] pb-4 mb-8">
            <h2 className="text-2xl font-[family-name:var(--font-display)] text-white uppercase tracking-wider flex items-center gap-2">
              {isClaimed ? "Showroom Catalog" : `Trending Jewelry in ${shop.location?.district || 'Your Area'}`}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-[#0E1528] rounded-2xl border border-[#2A344A] border-dashed">
              <p className="text-gray-500 font-mono tracking-widest uppercase">No products uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => {
                const finalPrice = product.price || 100000;
                const mappedProduct = {
                  id: product.id,
                  subcategoryId: product.subcategoryId,
                  title: product.title || product.designName,
                  image: product.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
                  price: finalPrice,
                  karat: product.metalPurityId,
                  weightGrams: product.weightGrams,
                  isVerified: shop.isVerified,
                  storeName: shop.name
                };

                return (
                  <ProductCard key={product.id} product={mappedProduct} />
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
