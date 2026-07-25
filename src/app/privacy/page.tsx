import React from "react";
import { Shield, Eye, Settings, FileText, Users } from "lucide-react";

import PremiumPageHero from "@/components/PremiumPageHero";

export const metadata = {
  title: "Privacy Policy | Gold Dunia",
  description: "Gold Dunia Privacy Policy regarding user data and analytics.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pb-16">
      
      <PremiumPageHero 
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
        imagePath="/stock/abstract-gold-bg.png"
      />

      <div className="max-w-[1000px] mx-auto px-6 mt-16 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              At <strong className="text-white font-medium">Gold Dunia</strong> (a platform by Shyam Dash Creation), we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information when you use our digital ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">1. Information We Collect</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span><strong className="text-white">Personal Information:</strong> Name, email address, phone number, and physical address provided during account registration, booking, or contacting us.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span><strong className="text-white">Payment Information:</strong> Transaction details securely processed by our payment gateways (e.g., Razorpay). We do not store complete credit card numbers on our servers.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span><strong className="text-white">Usage Data:</strong> Information on how you interact with our website, including IP address, browser type, and pages visited, for analytics (including Google Analytics and AdSense).</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>To process your advanced bookings and facilitate communication between you and the verified jewelry showrooms.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>To provide customer support and respond to inquiries.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>To send important administrative alerts, booking confirmations, and, if opted in, marketing communications.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0"></span>
                  <span>To analyze platform usage and display relevant advertisements (e.g., via Google AdSense).</span>
                </li>
              </ul>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">3. Third-Party Sharing</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                We do not sell your personal data. We may share necessary booking details (Name, Contact Number) with the specific showroom where you have booked a product to facilitate the in-store handover. We also use trusted third-party services (like payment gateways and analytics providers) who are bound by strict confidentiality agreements.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0A1021]/90 backdrop-blur-md border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#C5A059]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white mb-4">4. Cookies and Tracking</h2>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Gold Dunia uses cookies to maintain session states, remember user preferences, and for advertising tracking (such as Google AdSense). You can control cookie preferences through your browser settings.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#141C33] to-[#0A1021] border border-[#2A344A] p-10 rounded-[2rem] text-center max-w-3xl mx-auto mt-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-[40px] rounded-full pointer-events-none"></div>
             <h2 className="text-2xl font-serif font-bold text-[#C5A059] mb-4">5. Contact Us</h2>
             <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
               If you have questions about this Privacy Policy, please contact us at:
             </p>
             <div className="text-white text-sm font-medium leading-relaxed bg-[#060A14] inline-block p-6 rounded-xl border border-[#C5A059]/20 shadow-inner">
               <strong className="text-[#C5A059] block mb-2 text-base">Shyam Dash Creation</strong>
               R7/A2, Jagannath Colony, Budharaja,<br />
               Sambalpur, Odisha, PIN: 768004<br />
               <span className="text-slate-400 mt-2 block">Email: support@golddunia.com</span>
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
