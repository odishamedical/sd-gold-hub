import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SD Gold Hub | Productive Luxury Marketplace",
  description: "The world's most exclusive multi-vendor gold jewelry marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-full flex flex-col bg-midnight text-white`}>
        
        {/* Global Ecosystem Continuous Menu (App Switcher) */}
        <div className="bg-[#0A1021] border-b border-[#C5A059]/40 text-white py-2.5 px-4 md:px-8 text-xs z-50 relative shadow-[0_4_25px_rgba(0,0,0,0.6)]">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-3 lg:gap-8">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
              <span className="font-serif font-bold text-[#C5A059] tracking-widest uppercase text-xs">Shyam Dash Empire</span>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-x-6 gap-y-1.5 text-[11px]">
              <a href="https://sd-gold-hub.vercel.app" className="group flex items-center gap-1 transition-colors py-0.5">
                <span className="text-[#C5A059] font-bold group-hover:underline">shyamdash.com</span>
                <span className="text-gray-400 hidden xl:inline">- Our Gold Jewellery Marketplace</span>
              </a>
              <span className="text-gray-600 hidden md:inline">|</span>
              <a href="https://sd-bhulia-hub.vercel.app" className="group flex items-center gap-1 transition-colors py-0.5">
                <span className="text-white group-hover:text-[#C5A059] font-bold group-hover:underline">bhulia.com</span>
                <span className="text-gray-400 hidden xl:inline">- Our Sambalpuri Saree Marketplace (Direct Weaver Access)</span>
              </a>
              <span className="text-gray-600 hidden md:inline">|</span>
              <a href="https://sd-dehapa-hub.vercel.app" className="group flex items-center gap-1 transition-colors py-0.5">
                <span className="text-white group-hover:text-[#C5A059] font-bold group-hover:underline">dehapa.com</span>
                <span className="text-gray-400 hidden xl:inline">- Healthcare Services Delivered to Your Home</span>
              </a>
              <span className="text-gray-600 hidden md:inline">|</span>
              <a href="https://sd-it-hub.vercel.app" className="group flex items-center gap-1 transition-colors py-0.5">
                <span className="text-white group-hover:text-[#C5A059] font-bold group-hover:underline">SD IT Hub</span>
                <span className="text-gray-400 hidden xl:inline">- World-Class Information Technology Solutions</span>
              </a>
            </div>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
