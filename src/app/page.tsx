import React from "react";
import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import TrustBanner from "@/components/home/TrustBanner";
import EducationSection from "@/components/home/EducationSection";
import HomeDynamicEngine from "@/components/home/HomeDynamicEngine";

import { getPageLayout } from "@/lib/firestore/layouts";
import { getRecentProducts } from "@/lib/firestore/products";
import { getShops } from "@/lib/firestore/shops";

import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // optionally cache for 60 seconds

export const metadata: Metadata = {
  title: "Golddunia | The Ultimate World of Authentic Gold & Fine Jewelry",
  description: "Find the best trusted gold jewelers, showrooms, and check live gold rates.",
  openGraph: {
    images: ["https://sd-gold-hub.vercel.app/home-hero.png"],
  },
  twitter: {
    images: ["https://sd-gold-hub.vercel.app/home-hero.png"],
  },
};

export default async function HomePage() {
  // Fetch everything in parallel
  const [layout, products, shops, jobsSnapshot] = await Promise.all([
    getPageLayout("HOME").catch(() => null),
    getRecentProducts(20).catch(() => []),
    getShops(true).catch(() => []),
    getDocs(
      query(
        collection(db, "jobs"),
        where("status", "==", "Active"),
        orderBy("createdAt", "desc"),
        limit(10)
      )
    ).catch(() => ({ docs: [] }))
  ]);

  const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <main className="min-h-screen bg-[#060A14] text-white font-sans overflow-hidden">
      {/* Ambient Stardust Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#DDA7A5] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <HeroSection />
      <BentoGrid />
      <TrustBanner />
      
      {/* Dynamic Engine processes the layout config from Admin Panel */}
      <HomeDynamicEngine layout={layout} products={products} shops={shops} jobs={jobs} />

      <EducationSection />
    </main>
  );
}
