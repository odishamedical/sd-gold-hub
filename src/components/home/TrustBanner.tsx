import React from "react";
import { ShieldCheck, Percent, Star } from "lucide-react";

export default function TrustBanner() {
  return (
    <section className="relative z-10 py-8 border-y border-white/5 bg-gradient-to-r from-[#DDA7A5]/5 via-white/5 to-[#D4AF37]/5 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-3xl rounded-2xl flex overflow-x-auto md:overflow-hidden snap-x snap-mandatory flex-nowrap md:flex-row items-center justify-start md:justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="flex-1 flex items-center p-6 md:p-8 border-r border-white/10 hover:bg-white/5 transition-colors group min-w-[85vw] md:min-w-0 snap-center">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-white tracking-wide mb-1">Verified HUID</h3>
              <p className="text-xs text-gray-300 font-light whitespace-normal">Certified authenticity for every piece.</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center p-6 md:p-8 border-r border-white/10 hover:bg-white/5 transition-colors group min-w-[85vw] md:min-w-0 snap-center">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
              <Percent className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-[#FDE047] tracking-wide mb-1">Transparent Making Charges</h3>
              <p className="text-xs text-gray-300 font-light whitespace-normal">Upfront pricing, no hidden fees.</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center p-6 md:p-8 hover:bg-white/5 transition-colors group min-w-[85vw] md:min-w-0 snap-center">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4 text-[#DDA7A5] drop-shadow-[0_0_8px_rgba(221,167,165,0.8)]">
              <Star className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-[#DDA7A5] tracking-wide mb-1">Premium Boutiques</h3>
              <p className="text-xs text-gray-300 font-light whitespace-normal">Luxury aesthetics in every interaction.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
