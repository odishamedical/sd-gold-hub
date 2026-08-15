import React from "react";
import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import TrustBanner from "@/components/home/TrustBanner";
import EducationSection from "@/components/home/EducationSection";
import HomeDynamicEngine from "@/components/home/HomeDynamicEngine";

import { parseFirestoreDocument } from "@/lib/firestore/restParser";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

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

async function fetchCollectionREST(collectionId: string) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/sd-gold-hub/databases/(default)/documents/${collectionId}?pageSize=300`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map(parseFirestoreDocument);
  } catch (err) {
    return [];
  }
}

async function fetchLayoutREST(pageId: string) {
  const url = `https://firestore.googleapis.com/v1/projects/sd-gold-hub/databases/(default)/documents/page_layouts/${pageId}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`REST layout fetch failed: ${res.statusText}`);
  }
  const data = await res.json();
  return parseFirestoreDocument(data);
}

export default async function HomePage() {
  let layoutError = null;
  let layout = null;
  let allProducts = [];
  let allShops = [];
  let allJobs = [];

  try {
    const [fetchedLayout, rawProducts, rawShops, rawJobs] = await Promise.all([
      fetchLayoutREST("HOME").catch(e => { layoutError = e.message || String(e); return null; }),
      fetchCollectionREST("products"),
      fetchCollectionREST("shops"),
      fetchCollectionREST("jobs")
    ]);

    layout = fetchedLayout;
    allProducts = rawProducts;
    allShops = rawShops;
    allJobs = rawJobs;
  } catch (err) {
    console.error("Critical parallel fetch failure", err);
  }

  // Filter and sort products (simulating the query)
  const products = allProducts
    .filter((p: any) => p.status === "active" || p.status === "Active")
    // If createdAt is a timestamp string from REST, we can sort it. If it's undefined, just put it at the end.
    .sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 20);

  const shops = allShops;

  const jobs = allJobs
    .filter((j: any) => j.status === "active" || j.status === "Active")
    .sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 10);

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
      {layoutError && (
        <div className="py-10 text-center text-red-500 font-bold bg-black/50 border border-red-500 m-4 rounded">
          ERROR FETCHING LAYOUT: {layoutError}
        </div>
      )}
      <HomeDynamicEngine layout={layout} products={products} shops={shops} jobs={jobs} />

      <EducationSection />
    </main>
  );
}
