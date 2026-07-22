"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
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
    <div className="group relative flex flex-col w-full bg-[#060A14] border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-md hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:-translate-y-1 transition-all duration-300 h-full">
      
      {/* Aspect Ratio 9:16 Image Container */}
      <div className="relative w-full pt-[177.77%] bg-[#0A1021] overflow-hidden">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          <Image
            src={product.img || product.image || product.images?.[0] || "/diamond_necklace_luxury.png"}
            alt={product.title}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Verification Badge */}
        {product.isVerified && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#996515] to-[#C5A059] text-[#0A1021] text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 z-10">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            Verified Jeweler
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
          className={`absolute top-2 right-2 p-2 rounded-full z-10 transition-all shadow-lg backdrop-blur-sm ${
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
                requireCompleteProfile(() => {
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

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#0E1528]/30">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <Link href={`/product/${product.id}`} className="hover:text-[#C5A059] transition-colors">
              <h3 className="text-sm md:text-base font-bold text-gray-100 leading-tight line-clamp-2 font-serif transition-colors">
                {product.designName || product.title}
              </h3>
            </Link>
          </div>
          
          <div className="flex items-center gap-1.5 mb-3">
             <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium bg-[#C5A059]/10 px-1.5 py-0.5 rounded">
                {(product.metalPurityId || product.karat || product.material || "22K Gold").slice(0, 15)}
             </span>
             {(product.weightGrams || product.weight) && (
               <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium bg-gray-800 px-1.5 py-0.5 rounded">
                  {product.weightGrams || product.weight}g
               </span>
             )}
             {product.storeName && (
               <span className="text-[9px] uppercase tracking-widest text-gray-500 truncate ml-auto">
                 By {product.storeName}
               </span>
             )}
          </div>
        </div>

        <div className="mt-auto border-t border-[#C5A059]/10 pt-3 flex items-center justify-between">
          <div>
            <span className="text-lg md:text-xl font-black text-white font-sans tracking-tight">₹{finalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">* Estimated Price</div>
          </div>
          <Link href={`/product/${product.id}`} className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
