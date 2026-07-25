import React from "react";
import { Gavel, Store, CreditCard, Building, Edit } from "lucide-react";

import PremiumPageHero from "@/components/PremiumPageHero";

export const metadata = {
  title: "Terms & Conditions | Gold Dunia",
  description: "Terms and conditions for using the Gold Dunia marketplace platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pb-16">
      <PremiumPageHero 
        title="Terms & Conditions"
        subtitle="Please read our terms of service and marketplace conditions."
        imagePath="/stock/abstract-gold-bg.png"
      />
      <div className="max-w-[1000px] mx-auto px-6 mt-16 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              Welcome to <strong className="text-white font-medium">Gold Dunia</strong>, a premium digital discovery and booking platform owned and operated by Shyam Dash Creation. 
              By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">1. Platform Nature (O2O Model)</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                Gold Dunia operates strictly on an Online-to-Offline (O2O) business model. 
                <strong className="text-white block mt-2">We do not sell physical jewelry directly to end consumers online.</strong> 
              </p>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Our platform serves as a digital catalog and discovery network where users can browse hallmarked gold jewelry listed by verified third-party showrooms.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">2. Booking and Advance Payments</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>Users may reserve/book a jewelry item by paying a 30% advance booking fee through our secure payment gateway.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>This booking fee secures the item at the specific local showroom.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>The remaining balance must be paid directly to the showroom during the physical handover of the product.</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">3. Vendor Independence & Liability</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                The independent jewelry showrooms listed on Gold Dunia are entirely separate entities. Gold Dunia is not responsible for the physical manufacturing, final pricing negotiation, or post-purchase guarantees of the jewelry. All guarantees regarding gold purity, HUID certification, and physical condition are the sole responsibility of the respective showroom where the final transaction takes place.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gavel className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">4. Intellectual Property</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                All content on Gold Dunia, including logos, designs, text, and graphics, is the intellectual property of Shyam Dash Creation. 
                Unauthorized use, reproduction, or distribution of our platform content is strictly prohibited.
              </p>
            </div>
          </div>

          {/* Modification Section */}
          <div className="bg-gradient-to-r from-[#141C33] to-[#0A1021] border border-[#2A344A] p-10 rounded-[2rem] text-center max-w-3xl mx-auto mt-12 shadow-2xl relative overflow-hidden group hover:border-[#C5A059]/30 transition-colors">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-[40px] rounded-full pointer-events-none"></div>
             <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Edit className="w-6 h-6 text-[#C5A059]" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-[#C5A059] mb-4">5. Modifications</h2>
             <p className="text-slate-300 text-sm font-light leading-relaxed">
               We reserve the right to update or modify these Terms & Conditions at any time without prior notice. 
               Continued use of the platform following any changes constitutes your acceptance of the new terms.
             </p>
          </div>

          <p className="text-xs font-mono tracking-widest text-slate-500 text-center mt-16 pt-8 border-t border-[#2A344A]/50 uppercase">
            Last Updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}
