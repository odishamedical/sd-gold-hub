import React from "react";
import { Package, ShieldCheck, MapPin, CalendarClock } from "lucide-react";
import PremiumPageHero from "@/components/PremiumPageHero";
export const metadata = {
  title: "Shipping & Delivery Policy | Gold Dunia",
  description: "Gold Dunia's policies regarding shipping, delivery, and in-store pickups.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pb-16">
      
      <PremiumPageHero 
        title="Shipping & Delivery Policy"
        subtitle="Policies regarding shipping, delivery, and in-store pickups."
        imagePath="/hero/hero-legal.png"
      />

      <div className="max-w-[1000px] mx-auto px-6 mt-16 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              At <strong className="text-white font-medium">Gold Dunia</strong>, we prioritize the absolute security, authenticity, and satisfaction of our customers when purchasing high-value 22K and 24K gold jewelry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group md:col-span-2">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">1. In-Store Pickup Model</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                Due to the extreme value and delicate nature of fine gold jewelry, <strong className="text-white">Gold Dunia does not offer direct home delivery or postal shipping for jewelry items.</strong>
              </p>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                We operate exclusively on a <strong className="text-[#C5A059]">"Book Online, Pick Up In-Store"</strong> model. This ensures that:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>There is zero risk of theft, loss, or damage during courier transit.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>You can physically inspect the jewelry and verify the HUID (Hallmark Unique Identification) before completing the final purchase.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>You can try on the jewelry to ensure perfect fit and satisfaction.</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">2. The Collection Process</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>Once you pay the 30% advance booking fee on Gold Dunia, your chosen item is immediately reserved for you at the specific vendor's showroom.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>You will receive a Booking Confirmation Receipt via email and on your dashboard.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>You must present this receipt (digitally or printed) along with a valid Government ID at the showroom to collect your item.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>The remaining 70% balance is paid directly to the showroom at the time of collection.</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">3. Collection Timeframes</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                We request that you visit the showroom to complete your purchase and collect your reserved item within <strong className="text-white">14 days</strong> of your booking date. If you need an extension, please contact the showroom directly or reach out to Gold Dunia support. If the item is not collected within the stipulated time, the booking may be subject to cancellation (and your advance will be refunded as per our Refund Policy).
              </p>
            </div>
          </div>

          <p className="text-xs font-mono tracking-widest text-slate-500 text-center mt-16 pt-8 border-t border-[#2A344A]/50 uppercase">
            Last Updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}
