import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MapPin, Phone, Star, ShieldCheck, Globe } from 'lucide-react';
import { getShopById, getShopLiveRates, getShopProducts, getRecentProducts } from '@/lib/firestore/products';
import FollowShopButton from '@/components/FollowShopButton';
import ProductCard from '@/components/ProductCard';
import GlobalBannerSlot from '@/components/GlobalBannerSlot';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const shop = await getShopById(resolvedParams.id);
  
  if (!shop) return { title: 'Shop Not Found' };
  
  return {
    title: `${shop.name} - Verified Gold Jeweler | Golddunia`,
    description: shop.description,
  };
}

export default async function ShopProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const shopId = resolvedParams.id;

  const [shop, liveRates, shopProducts] = await Promise.all([
    getShopById(shopId),
    getShopLiveRates(shopId),
    getShopProducts(shopId)
  ]);

  if (!shop) {
    notFound();
  }

  const isClaimed = !!shop.ownerUid;
  
  // If unclaimed and has no products, show generic popular products as a fallback
  const products = (!isClaimed && shopProducts.length === 0) 
    ? await getRecentProducts(10) 
    : shopProducts;

  return (
    <main className="min-h-screen bg-[#060A14] text-[#E2E8F0] font-sans pb-20 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Cover Image Gallery (Up to 4 images) */}
      <div className="relative w-full bg-[#0A0A0A] overflow-hidden">
        {shop.coverImages && shop.coverImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-64 md:h-80 w-full gap-1">
            {shop.coverImages.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative h-full ${i > 0 ? 'hidden sm:block' : ''}`}>
                <img 
                  src={img} 
                  alt={`${shop.name} Cover ${i + 1}`} 
                  className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 md:h-80 w-full flex items-center justify-center bg-[#0A1021]">
            <span className="text-[#C5A059] opacity-20 font-bold uppercase tracking-widest">No Cover Images</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/20 to-transparent z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 md:-mt-32">
        <Breadcrumbs items={[{ label: "Directory", href: "/directory" }, { label: shop.name }]} className="mb-4" />
        
        {/* Profile Card */}
        <div className="bg-[#0E1528] border border-[#2A344A] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          
          {/* Logo */}
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#0E1528] bg-[#141C33] flex-shrink-0 overflow-hidden shadow-2xl relative">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-[family-name:var(--font-display)] text-5xl">
                {shop.name.charAt(0)}
              </div>
            )}
            {shop.isVerified && (
              <div className="absolute bottom-2 right-2 bg-[#0A1021] rounded-full border border-[#C5A059] p-1 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-display)] text-white uppercase tracking-wider mb-2">
                  {shop.name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
                  {shop.subscriptionTier === 'ELITE' && (
                    <span className="text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#D4AF37]" /> Elite Partner
                    </span>
                  )}
                  {shop.rating && (
                    <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
                      ★ {shop.rating.toFixed(1)} Rating
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <FollowShopButton shopId={shop.id} />
            </div>

            <p className="text-[#9CA3AF] font-light max-w-3xl text-lg leading-relaxed mb-6 mt-6">
              {shop.description}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 text-sm text-[#E2E8F0] border-t border-[#2A344A] pt-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>{shop.location.block}, {shop.location.district}, {shop.location.state}</span>
              </div>
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>{shop.phone}</span>
                </div>
              )}
              {shop.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#4285F4]" />
                  <a href={shop.website} target="_blank" rel="noreferrer" className="hover:text-[#4285F4] hover:underline transition-colors">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Live Rates Widget */}
          <div className="w-full md:w-72 bg-[#0A1021] border border-[#2A344A] shadow-inner rounded-2xl p-5 flex-shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-center text-[#C5A059] mb-4 pb-2 border-b border-[#2A344A]">
              Live Gold Rates
            </h3>
            {liveRates ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">24K Pure</span>
                  <span className="text-white font-bold tracking-wider">₹{liveRates.rate24K.toLocaleString()}/g</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">22K Standard</span>
                  <span className="text-[#D4AF37] font-bold tracking-wider text-lg">₹{liveRates.rate22K.toLocaleString()}/g</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">18K Rose/White</span>
                  <span className="text-white font-bold tracking-wider">₹{liveRates.rate18K?.toLocaleString() || Math.floor(liveRates.rate24K * 0.75).toLocaleString()}/g</span>
                </div>
                <div className="text-[10px] text-center text-gray-500 mt-4 pt-2 border-t border-white/5 uppercase">
                  Updated: {new Date(liveRates.lastUpdated).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-4">Rates temporarily unavailable</div>
            )}
          </div>

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

        {/* Dynamic Ad Placement - Content Top */}
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
              {isClaimed ? "Showroom Catalog" : `Trending Jewelry in ${shop.location.district}`}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-[#0E1528] rounded-2xl border border-[#2A344A] border-dashed">
              <p className="text-gray-500 font-mono tracking-widest uppercase">No products uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => {
                // In Phase 7, the pricing logic is encapsulated inside the product itself (price property)
                // since the vendor configures it in their dashboard.
                // We'll use the price if available, otherwise fallback to a generic calculation
                const finalPrice = product.price || 100000;
                
                // Convert new product schema to format expected by ProductCard
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
