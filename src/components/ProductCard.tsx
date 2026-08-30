"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { logInquiry } from "@/lib/firestore/inquiries";
import { generateProductSlug } from '@/lib/utils/seo-routing';
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: any;
  role?: string | null;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isProductSaved, toggleWishlist, profile, loginDemo, requireCompleteProfile } = useCustomer();
  const saved = isProductSaved(product.id);

  // If price is passed as a string with formatting, parse it.
  const priceNum = typeof product.price === 'number' ? product.price : Number(String(product.price).replace(/[^0-9.]/g, '')) || 0;
  let finalPrice = priceNum;

  // Handle dynamic price if weight and goldRate are passed
  if (product.weight && product.goldRate) {
    const weightVal = parseFloat(String(product.weight));
    const makingCharges = parseFloat(String(product.makingCharges || 0));
    finalPrice = (weightVal * product.goldRate) + makingCharges;
  }

  return (
    <div className="group relative flex flex-col w-full bg-[#060A14] rounded-[2rem] overflow-hidden lg:hover:-translate-y-1 transition-transform duration-300 h-full p-2">
      
      {/* Aspect Ratio 1:1 Image Container */}
      <div className="relative w-full aspect-square bg-[#0A1021] overflow-hidden rounded-[1.5rem] shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10">
        <Link href={`/product/${generateProductSlug(product)}`} className="absolute inset-0 z-0">
          <Image
            src={product.img || product.image || product.images?.[0] || "/diamond_necklace_luxury.png"}
            alt={product.title}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
          />
        </Link>
        
        {/* Verification Badge */}
        {product.isVerified && !product.isCrossPollinated && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#996515] to-[#C5A059] text-[#0A1021] text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 z-10">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            Verified Jeweler
          </div>
        )}

        {/* Cross Pollinated Badge */}
        {product.isCrossPollinated && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#0A1021] text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 z-10">
            Available Nearby
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (!profile) {
              loginDemo();
            } else {
              toggleWishlist(product.id);
            }
          }}
          className={`absolute top-3 right-3 p-2 rounded-full z-10 transition-all shadow-lg backdrop-blur-sm ${
            saved 
              ? 'bg-[#C5A059] text-[#0A1021]' 
              : 'bg-black/40 text-white hover:bg-black/60 border border-white/20 hover:border-white/40'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View / Contact Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 lg:p-4 bg-gradient-to-t from-[#0A1021]/90 to-transparent translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (requireCompleteProfile) {
                requireCompleteProfile(async () => {
                  if (profile) {
                    await logInquiry({
                      shopId: product.shopId || product.storeId || "unknown_shop",
                      customerId: profile.id,
                      customerName: profile.name,
                      customerPhone: profile.whatsapp || profile.phone || "",
                      customerCity: profile.block || "",
                      productId: product.id,
                      productName: product.title,
                      source: "message"
                    });
                  }
                  alert(`Please visit or contact ${product.storeName || "the store"} to purchase.`);
                });
              } else {
                 alert(`Please visit or contact ${product.storeName || "the store"} to purchase.`);
              }
            }}
            className="w-full py-1.5 lg:py-2 text-[10px] lg:text-xs font-bold uppercase tracking-wider rounded shadow-lg transition-colors bg-[#C5A059] text-[#0A1021] hover:bg-white"
          >
            Contact Store
          </button>
        </div>
      </div>

      {/* Product Details - 3D Gold Oval */}
      <Link href={`/product/${generateProductSlug(product)}`} className="block flex flex-col flex-1 justify-between bg-gradient-to-b from-[#E5C158] via-[#D4AF37] to-[#996515] p-5 pt-8 -mt-6 rounded-b-[1.5rem] rounded-t-[2rem] shadow-[inset_0_2px_15px_rgba(255,255,255,0.6),0_10px_20px_rgba(0,0,0,0.5)] border border-[#FFF8E7]/50 relative z-0 hover:brightness-110 transition-all">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="text-sm md:text-base font-bold text-[#060A14] leading-tight line-clamp-2 font-serif transition-colors drop-shadow-sm">
              {product.designName || product.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
             <span className="text-[9px] uppercase tracking-widest text-[#060A14] font-black bg-black/10 px-2 py-0.5 rounded shadow-sm border border-black/5">
                {`Gold ${product.subcategoryId || product.category || product.purity || "Jewellery"}`.slice(0, 25)}
             </span>
             {(product.weightGrams || product.weight) && (
               <span className="text-[9px] uppercase tracking-widest text-[#060A14] font-black bg-black/10 px-2 py-0.5 rounded shadow-sm border border-black/5">
                  {product.weightGrams || product.weight}
                  {String(product.weightGrams || product.weight).toLowerCase().includes('g') ? '' : 'g'}
               </span>
             )}
             {(product.storeName || product.vendor) && (
               <span className={`text-[8px] uppercase tracking-widest font-bold truncate ml-auto flex items-center gap-1 ${product.isCrossPollinated ? "text-white bg-[#060A14] px-2 py-0.5 rounded shadow-sm border border-[#C5A059]/50" : "text-[#060A14]/70"}`}>
                 {product.isCrossPollinated && <svg className="w-2.5 h-2.5 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>}
                 By {product.storeName || product.vendor}
               </span>
             )}
          </div>
        </div>

        <div className="mt-auto border-t border-[#060A14]/10 pt-3 flex items-center justify-between">
          <div>
            <span className="text-xl md:text-2xl font-black text-[#060A14] font-sans tracking-tighter drop-shadow-sm">₹{finalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
            <div className="text-[9px] text-[#060A14]/60 uppercase font-bold tracking-widest mt-0.5">* Estimated Price</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#060A14] flex items-center justify-center text-[#D4AF37] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>
        </div>
      </Link>
    </div>
  );
}
