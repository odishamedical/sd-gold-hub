import React from "react";
import { Undo2, Banknote, HelpCircle, AlertTriangle, Phone } from "lucide-react";

import PremiumPageHero from "@/components/PremiumPageHero";

export const metadata = {
  title: "Cancellation & Refund Policy | Gold Dunia",
  description: "Information regarding bookings, cancellations, and our refund process at Gold Dunia.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pb-16">
      <PremiumPageHero 
        title="Cancellation & Refund Policy"
        subtitle="Information regarding bookings, cancellations, and our refund process."
        imagePath="/hero/hero-legal.png"
      />
      <div className="max-w-[1000px] mx-auto px-6 mt-16 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              Welcome to <strong className="text-white font-medium">Gold Dunia</strong>. We value your trust and strive to ensure complete transparency in all our operations. 
              Because we operate a unique Online-to-Offline (O2O) jewelry discovery platform, our refund and cancellation policies are specifically tailored to protect both buyers and our registered showrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">1. Our Booking Model</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                Gold Dunia operates as a discovery and booking platform. <strong className="text-white block mt-2">We do not sell physical jewelry directly online.</strong> 
              </p>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                Instead, users browse verified, hallmarked jewelry from certified showrooms and reserve their desired pieces by paying an <strong className="text-[#C5A059]">advance booking fee (typically 30% of the estimated product price)</strong> through our platform.
              </p>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                The final purchase, full payment, and handover of the jewelry always occur physically at the respective vendor's retail showroom.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Undo2 className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">2. Cancellation of Bookings</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                If you decide not to proceed with the purchase after making an advance booking on Gold Dunia, you are fully entitled to cancel your reservation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>You may cancel your booking at any time before completing the final purchase at the showroom.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>Cancellations can be requested via your Gold Dunia User Dashboard or by contacting our support team at support@golddunia.com.</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">3. Refund Process & Timelines</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                Upon successful cancellation of your booking, we will initiate a full refund of your 30% advance payment.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span><strong className="text-white">Refund Initiation:</strong> Refunds are processed back to the original payment method (Credit Card, Debit Card, UPI, Netbanking, etc.) used during the booking.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span><strong className="text-white">Processing Time:</strong> Please allow <strong>5 to 7 business days</strong> (within one week) for the refunded amount to reflect in your bank account, depending on your bank's processing timelines.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>No hidden deductions or cancellation penalties are applied to standard catalog items.</span>
                </li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">4. Post-Purchase Returns</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">
                Because the final transaction and physical handover occur at the vendor's showroom, <strong className="text-white">any returns, exchanges, or buybacks after the final physical purchase are subject strictly to the individual showroom's return policies.</strong>
              </p>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Gold Dunia is not liable for post-purchase returns, as the final sale agreement is executed offline directly between the buyer and the registered showroom. We strongly advise buyers to verify the HUID and clarify the showroom's return policy during their in-store visit.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#141C33] to-[#0A1021] border border-[#2A344A] p-10 rounded-[2rem] text-center max-w-3xl mx-auto mt-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-[40px] rounded-full pointer-events-none"></div>
             <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-6 h-6 text-[#C5A059]" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-[#C5A059] mb-4">5. Contact for Refund Queries</h2>
             <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
               If you have any issues regarding a pending refund, please contact us at:
             </p>
             <div className="text-white text-sm font-medium leading-relaxed bg-[#060A14] inline-block p-6 rounded-xl border border-[#C5A059]/20 shadow-inner">
               <strong className="text-[#C5A059] block mb-2 text-base">Shyam Dash Creation</strong>
               R7/A2, Jagannath Colony, Budharaja,<br />
               Sambalpur, Odisha, PIN: 768004<br />
               <span className="text-slate-400 mt-2 block">Phone: +91 7683811120</span>
               <span className="text-slate-400 mt-1 block">Email: support@golddunia.com</span>
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
