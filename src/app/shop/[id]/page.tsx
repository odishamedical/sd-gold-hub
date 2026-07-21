import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { getShopById, getShopLiveRates, getShopProducts } from '@/lib/firestore/products';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const shop = await getShopById(resolvedParams.id);
  
  if (!shop) return { title: 'Shop Not Found' };
  
  return {
    title: `${shop.name} - Verified Gold Jeweler | Shyam Dash Gold Hub`,
    description: shop.description,
  };
}

export default async function ShopProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const shopId = resolvedParams.id;

  const [shop, liveRates, products] = await Promise.all([
    getShopById(shopId),
    getShopLiveRates(shopId),
    getShopProducts(shopId)
  ]);

  if (!shop) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#111111] text-[#E2E8F0] font-sans pb-20">
      <Header />
      
      {/* Cover Image Header */}
      <div className="relative h-64 md:h-80 w-full bg-[#0A0A0A]">
        {shop.coverImages && shop.coverImages.length > 0 ? (
          <img 
            src={shop.coverImages[0]} 
            alt={`${shop.name} Cover`} 
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111111] to-[#1A1A1A]">
            <span className="text-[#D4AF37] opacity-20">No Cover Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-32">
        {/* Profile Card */}
        <div className="aurous-glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start mb-12">
          
          {/* Logo */}
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#111111] bg-[#1A1A1A] flex-shrink-0 overflow-hidden shadow-2xl relative">
            {shop.logoUrl ? (
              <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-[family-name:var(--font-display)] text-5xl">
                {shop.name.charAt(0)}
              </div>
            )}
            {shop.isVerified && (
              <div className="absolute bottom-2 right-2 bg-black rounded-full border border-[#D4AF37] p-1">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
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

            <p className="text-[#9CA3AF] font-light max-w-3xl text-lg leading-relaxed mb-6">
              {shop.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 text-sm text-[#E2E8F0] border-t border-[#D4AF37]/10 pt-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{shop.location.block}, {shop.location.district}, {shop.location.state}</span>
              </div>
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>{shop.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Live Rates Widget */}
          <div className="w-full md:w-72 bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-2xl p-5 flex-shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-center text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
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

        {/* Shop Products Grid */}
        <div className="mb-12">
          <div className="flex justify-between items-end border-b border-[#D4AF37]/20 pb-4 mb-8">
            <h2 className="text-2xl font-[family-name:var(--font-display)] text-white uppercase tracking-wider">
              Showroom Catalog
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
              <p className="text-gray-500">No products uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                // Calculate dynamic price based on Live Rates
                let baseRate = liveRates?.rate22K || 7250;
                if (product.karat === '24K') baseRate = liveRates?.rate24K || 7850;
                if (product.karat === '18K') baseRate = liveRates?.rate18K || 5850;
                
                const goldValue = baseRate * product.netWeightGrams;
                let makingCharges = 0;
                if (product.makingChargeType === 'PERCENTAGE') {
                  makingCharges = goldValue * (product.makingChargeValue / 100);
                } else if (product.makingChargeType === 'FLAT') {
                  makingCharges = product.makingChargeValue;
                } else {
                  makingCharges = product.makingChargeValue * product.netWeightGrams; // PER_GRAM
                }
                
                const finalPrice = goldValue + makingCharges;

                return (
                  <Link href={`/product/${product.id}`} key={product.id} className="aurous-glass rounded-2xl overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                    <div className="h-64 relative bg-[#0A0A0A] overflow-hidden p-2">
                      <div className="w-full h-full bg-[#111111] rounded-xl overflow-hidden relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30 tracking-widest uppercase">
                          {product.karat}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-medium text-lg mb-1 truncate">{product.title}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[#9CA3AF] text-xs">Wt: {product.grossWeightGrams}g</span>
                        <span className="text-gray-500 text-[10px] flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> HUID: {product.huid}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <span className="text-xs text-gray-500">Live Price</span>
                        <span className="text-[#D4AF37] font-bold text-lg">₹{Math.round(finalPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
