import type { Metadata } from "next";
import "./globals.css";
import SsoBridge from "@/components/SsoBridge";
import Header from "@/components/Header";
import { Suspense } from "react";
import { LocationProvider } from "@/context/LocationContext";
import { CustomerProvider } from "@/context/CustomerContext";

export const metadata: Metadata = {
  title: "SD Gold Hub | Productive Luxury Marketplace",
  description: "The world's most exclusive multi-vendor gold jewelry marketplace.",
  openGraph: {
    title: "SD Gold Hub | Productive Luxury Marketplace",
    description: "The world's most exclusive multi-vendor gold jewelry marketplace.",
    url: "https://sd-gold-hub.vercel.app",
    siteName: "Shyam Dash Gold Hub",
    images: [
      {
        url: "https://sd-gold-hub.vercel.app/diamond_necklace_luxury.png",
        width: 1200,
        height: 630,
        alt: "Shyam Dash Gold Masterpiece",
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

        {/* Global Ecosystem Continuous Footer Bar */}
        <div className="bg-[#060A14] border-t border-[#C5A059]/30 text-white py-8 px-4 md:px-8 z-50 relative mt-auto">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            
            {/* Header / Humble Global Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2A344A] pb-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                <div>
                  <h4 className="font-serif font-bold text-[#C5A059] tracking-widest uppercase text-sm md:text-base">Shyam Dash Global Network</h4>
                  <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 tracking-wider uppercase">Trust • Heritage • Innovation • Future</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-mono hidden md:inline">Continuous Global Ecosystem Menu</span>
            </div>

            {/* Responsive Domain Grid (1 Row per Domain on Mobile, 4 Columns on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Gold Hub */}
              <a href="https://sd-gold-hub.vercel.app" className="group bg-[#0A1021] hover:bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] p-4 rounded-xl transition-all shadow flex flex-col justify-between gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-[#C5A059] font-bold text-sm tracking-wider group-hover:underline block font-mono">shyamdash.com</span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">Our Gold Jewellery Marketplace. Explore verified 22K & 24K hallmarked masterpieces.</p>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest mt-1 block">Explore Gold Hub →</span>
              </a>

              {/* 2. Bhulia Hub */}
              <a href="https://sd-bhulia-hub.vercel.app" className="group bg-[#0A1021] hover:bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] p-4 rounded-xl transition-all shadow flex flex-col justify-between gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-white group-hover:text-[#C5A059] font-bold text-sm tracking-wider group-hover:underline block font-mono">bhulia.com</span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">Our Sambalpuri Saree Marketplace. Providing direct access to purchase from master weavers.</p>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest mt-1 block">Explore Bhulia Hub →</span>
              </a>

              {/* 3. Dehapa Hub */}
              <a href="https://sd-dehapa-hub.vercel.app" className="group bg-[#0A1021] hover:bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] p-4 rounded-xl transition-all shadow flex flex-col justify-between gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-white group-hover:text-[#C5A059] font-bold text-sm tracking-wider group-hover:underline block font-mono">dehapa.com</span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">Our Healthcare Portal. Providing world-class medical and hospital services directly to your home.</p>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest mt-1 block">Explore Dehapa Hub →</span>
              </a>

              {/* 4. IT Hub */}
              <a href="https://sd-it-hub.vercel.app" className="group bg-[#0A1021] hover:bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] p-4 rounded-xl transition-all shadow flex flex-col justify-between gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-white group-hover:text-[#C5A059] font-bold text-sm tracking-wider group-hover:underline block font-mono">SD IT Hub</span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">Our Technology Division. Providing world-class information technology and software solutions.</p>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest mt-1 block">Explore IT Hub →</span>
              </a>

            </div>

            <div className="border-t border-[#2A344A] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-mono">
               <span>© 2026 Shyam Dash Global Network. All rights reserved.</span>
               <span className="text-[#C5A059]">Universal Continuous Ecosystem Bridge</span>
            </div>

          </div>
        </div>
          </CustomerProvider>
        </LocationProvider>

      </body>
    </html>
  );
}
