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

  let title = "Verified Gold Jewelers Directory | Golddunia";
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
export const dynamic = 'force-dynamic';

export default async function DirectoryServerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  const country = slug[0] ? decodeURIComponent(slug[0]) : "global";
  const state = slug[1] ? decodeURIComponent(slug[1]) : "";
  const district = slug[2] ? decodeURIComponent(slug[2]) : "";
  const block = slug[3] ? decodeURIComponent(slug[3]) : "";

  return (
    <main>
      <ClientDirectory 
        initialCountry={country} 
        initialState={state} 
        initialDistrict={district} 
        initialBlock={block} 
      />
    </main>
  );
}
