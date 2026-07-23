import type { Metadata } from "next";
import "./globals.css";
import SsoBridge from "@/components/SsoBridge";
import Header from "@/components/Header";
import { Suspense } from "react";
import GlobalFooter from "@/components/GlobalFooter";
import { LocationProvider } from "@/context/LocationContext";
import { CustomerProvider } from "@/context/CustomerContext";

export const metadata: Metadata = {
  title: "SD Gold Hub | Productive Luxury Marketplace",
  description: "The world's most exclusive multi-vendor gold jewelry marketplace.",
  openGraph: {
    title: "SD Gold Hub | Productive Luxury Marketplace",
    description: "The world's most exclusive multi-vendor gold jewelry marketplace.",
    url: "https://sd-gold-hub.vercel.app",
    siteName: "Gold Dunia",
    images: [
      {
        url: "https://sd-gold-hub.vercel.app/diamond_necklace_luxury.png",
        width: 1200,
        height: 630,
        alt: "Gold Dunia Masterpiece",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SD Gold Hub | Productive Luxury Marketplace",
    description: "The world's most exclusive multi-vendor gold jewelry marketplace.",
    images: ["https://sd-gold-hub.vercel.app/diamond_necklace_luxury.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="font-sans min-h-full flex flex-col bg-[#060A14] text-white overflow-x-hidden">
        <LocationProvider>
          <CustomerProvider>
            <SsoBridge />
        <Header />
        {/* Main Page Content */}
        <div className="flex-1 flex flex-col relative pb-16 lg:pb-0">
          {children}
        </div>
        
        {/* Premium Hub-Specific Footer */}
        <GlobalFooter />

        {/* Global Ecosystem Continuous Footer Bar */}
        <div className="bg-[#060A14] relative border-t border-[#C5A059]/30 text-white py-12 px-4 md:px-8 z-50 mt-auto overflow-hidden">
          {/* Animated Background Glowing Blobs for Glass Effect */}
          <div className="absolute inset-0 bg-[#060A14]"></div>
          <div className="absolute -top-[100px] -left-[100px] w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-[20%] left-[30%] w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[0px] right-[5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-[1400px] mx-auto flex flex-col gap-8 relative z-10">
            
            {/* Header / Humble Global Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse shadow-[0_0_10px_#C5A059]"></span>
                <div>
                  <h4 className="font-serif font-bold text-[#C5A059] tracking-widest uppercase text-sm md:text-base drop-shadow-md">Shyam Dash Creation</h4>
                  <p className="text-[10px] md:text-xs text-gray-300 mt-0.5 tracking-wider uppercase">Trust • Heritage • Innovation • Future</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-mono hidden md:inline tracking-widest uppercase">Continuous Global Ecosystem Menu</span>
            </div>

            {/* Responsive Domain Grid (1 Row per Domain on Mobile, 4 Columns on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* 1. Gold Hub */}
              <a href="https://golddunia.com" className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-[#C5A059]/50 p-5 rounded-2xl transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(197,160,89,0.2)] flex flex-col justify-between gap-3">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-[40px] group-hover:bg-[#C5A059]/20 transition-colors"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <img src="/logo/golddunia-1.png" alt="Gold Dunia" className="w-8 h-8 object-contain" />
                    <span className="text-[#C5A059] font-bold text-base tracking-wider block font-mono">Golddunia.com</span>
                  </div>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed relative z-10">Our Gold Jewellery Marketplace. Explore verified 22K & 24K hallmarked masterpieces.</p>
                <span className="text-[10px] text-white/80 group-hover:text-[#C5A059] font-bold uppercase tracking-widest mt-1 block relative z-10 transition-colors">Explore Gold Hub →</span>
              </a>

              {/* 2. Bhulia Hub */}
              <a href="https://bhulia.com" className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-red-500/50 p-5 rounded-2xl transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(239,68,68,0.15)] flex flex-col justify-between gap-3">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-colors"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <img src="/logo/bhulia_logo.png" alt="Bhulia" className="w-8 h-8 object-contain" />
                    <span className="text-white group-hover:text-red-400 font-bold text-base tracking-wider block font-mono transition-colors">bhulia.com</span>
                  </div>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed relative z-10">Our Sambalpuri Saree Marketplace. Providing direct access to purchase from master weavers.</p>
                <span className="text-[10px] text-white/80 group-hover:text-red-400 font-bold uppercase tracking-widest mt-1 block relative z-10 transition-colors">Explore Bhulia Hub →</span>
              </a>

              {/* 3. Dehapa Hub */}
              <a href="https://dehapa.com" className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-blue-400/50 p-5 rounded-2xl transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(96,165,250,0.15)] flex flex-col justify-between gap-3">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <img src="/logo/dehapa_logo.png" alt="Dehapa" className="w-8 h-8 object-contain" />
                    <span className="text-white group-hover:text-blue-400 font-bold text-base tracking-wider block font-mono transition-colors">dehapa.com</span>
                  </div>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed relative z-10">Our Healthcare Portal. Providing world-class medical and hospital services directly to your home.</p>
                <span className="text-[10px] text-white/80 group-hover:text-blue-400 font-bold uppercase tracking-widest mt-1 block relative z-10 transition-colors">Explore Dehapa Hub →</span>
              </a>

              {/* 4. IT Hub */}
              <a href="https://shyamdash.com" className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-emerald-400/50 p-5 rounded-2xl transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(52,211,153,0.15)] flex flex-col justify-between gap-3">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <img src="/logo/IT%20Hub_logo.png" alt="SD IT Hub" className="w-8 h-8 object-contain" />
                    <span className="text-white group-hover:text-emerald-400 font-bold text-base tracking-wider block font-mono transition-colors">SD IT Hub</span>
                  </div>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed relative z-10">Our Technology Division. Providing world-class information technology and software solutions.</p>
                <span className="text-[10px] text-white/80 group-hover:text-emerald-400 font-bold uppercase tracking-widest mt-1 block relative z-10 transition-colors">Explore IT Hub →</span>
              </a>

            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-mono relative z-10">
               <span>© 2026 Shyam Dash Creation. All rights reserved.</span>
               <span className="text-white/60 tracking-widest uppercase">Universal Continuous Ecosystem Bridge</span>
            </div>

          </div>
        </div>
          </CustomerProvider>
        </LocationProvider>

      </body>
    </html>
  );
}
