import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BentoGrid() {
  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        
        {/* Tile A: The Shop (2x2) */}
        <Link href="/gold-jewellery" className="relative group col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
          <Image src="/stock/bento-shop.png" alt="Premium Gold Jewellery" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-12 flex flex-col justify-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <h3 className="text-2xl md:text-4xl font-serif text-[#C5A059] mb-1 md:mb-2 drop-shadow-md">
                <span className="hidden md:inline">Premium Gold Jewellery</span>
                <span className="md:hidden">Gold Jewellery</span>
              </h3>
              <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed hidden md:block">Book breathtaking, HUID-certified 22K & 24K temple jewelry directly from master artisans and verified showrooms.</p>
              <div className="mt-4 inline-flex items-center text-white text-sm tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                Shop Masterpieces <ChevronRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </Link>

        {/* Tile B: Directory (1x1) */}
        <Link href="/directory" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
          <Image src="/stock/bento-directory.png" alt="Global Directory" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xl font-serif text-[#C5A059] mb-1">Global Directory</h3>
              <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                Find Jewelers <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* Tile C: Vendor / Sell (1x1) */}
        <Link href="/sell-with-us" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
          <Image src="/stock/bento-vendor.png" alt="List Your Shop" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xl font-serif text-[#C5A059] mb-1">List Your Shop</h3>
              <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                Sell With Us <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* Tile D: Live Rates (1x1) */}
        <Link href="/gold-price-live" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
          <Image src="/stock/bento-rates.png" alt="Live Gold Rates" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xl font-serif text-[#C5A059] mb-1">Live Gold Rates</h3>
              <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                Check Prices <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* Tile E: Jobs (1x1) */}
        <Link href="/jobs" className="relative group col-span-1 md:col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#DDA7A5]/50 transition-all duration-500">
          <Image src="/stock/bento-jobs.png" alt="Jewelry Careers" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xl font-serif text-[#C5A059] mb-1">Jewelry Careers</h3>
              <div className="inline-flex items-center text-white text-xs tracking-widest uppercase font-bold group-hover:text-[#DDA7A5] transition-colors">
                Browse Jobs <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
