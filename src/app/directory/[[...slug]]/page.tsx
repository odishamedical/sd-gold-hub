import React from "react";
import { Metadata } from "next";
import ClientDirectory from "./ClientDirectory";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  
  // New Geo-Taxonomy Mapping: [country]/[state]/[district]/[block]
  const country = slug[0] ? decodeURIComponent(slug[0]) : "global";
  const state = slug[1] ? decodeURIComponent(slug[1]) : "";
  const district = slug[2] ? decodeURIComponent(slug[2]) : "";
  const block = slug[3] ? decodeURIComponent(slug[3]) : "";

  let title = "Verified Gold Jewelers Directory | Shyam Dash Gold Hub";
  let description = "Discover Authentic Premium Gold Shops and Verified Jewelers Worldwide.";

  if (country !== "global") {
    title = `Verified Gold Jewelers in ${country}`;
    if (block) {
      title = `Best Gold Jewelers in ${block}, ${district} | Gold Hub`;
      description = `Find the top-rated, verified gold jewelers and showrooms in ${block}, ${district}, ${state}. Guaranteed authentic hallmarked gold.`;
    } else if (district) {
      title = `Best Gold Jewelers in ${district}, ${state} | Gold Hub`;
      description = `Find the top-rated, verified gold jewelers and showrooms in ${district}, ${state}. Guaranteed authentic hallmarked gold.`;
    } else if (state) {
      title = `Top Gold Jewelers in ${state}, ${country} | Gold Hub`;
    }
  }

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

import { getShops } from "@/lib/firestore/shops";

export default async function DirectoryServerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  const country = slug[0] ? decodeURIComponent(slug[0]) : "global";
  const state = slug[1] ? decodeURIComponent(slug[1]) : "";
  const district = slug[2] ? decodeURIComponent(slug[2]) : "";
  const block = slug[3] ? decodeURIComponent(slug[3]) : "";

  const shops = await getShops(true);

  return (
    <main>
      <React.Suspense fallback={<div className="flex-1 min-h-screen flex items-center justify-center bg-[#111111]"><div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div></div>}>
        <ClientDirectory 
          initialCountry={country} 
          initialState={state} 
          initialDistrict={district} 
          initialBlock={block} 
          shops={shops}
        />
      </React.Suspense>
    </main>
  );
}
