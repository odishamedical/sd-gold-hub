import React from "react";
import { Metadata } from "next";
import ClientDirectory from "@/app/directory/[[...slug]]/ClientDirectory";
import { getShops } from "@/lib/firestore/shops";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ location: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawLocation = decodeURIComponent(resolvedParams.location);
  
  // Try to parse something like "bargarh-odisha" or "bhubaneswar"
  const locationParts = rawLocation.split('-');
  const locationName = locationParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  const title = `Top Rated Gold Jewellery in ${locationName} | Gold Dunia`;
  const description = `Find the best gold jewellery shops, necklaces, bangles, and BIS hallmarked gold in ${locationName}. Browse verified local jewelers on Gold Dunia.`;

  return {
    title,
    description,
    openGraph: { 
      title, 
      description,
      images: ["https://sd-gold-hub.vercel.app/stock/directory-hero-pc.png"]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://sd-gold-hub.vercel.app/stock/directory-hero-pc.png"]
    }
  };
}

export default async function GeoTargetedGoldPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawLocation = decodeURIComponent(resolvedParams.location);
  const locationParts = rawLocation.split('-');
  const districtName = locationParts.length > 0 ? locationParts[0].charAt(0).toUpperCase() + locationParts[0].slice(1) : "";
  const stateName = locationParts.length > 1 ? locationParts[1].charAt(0).toUpperCase() + locationParts[1].slice(1) : "";

  return (
    <>
      {/* Invisible SEO H1 */}
      <h1 className="sr-only">Top Rated Gold Jewellery in {districtName} {stateName}</h1>
      
      <ClientDirectory 
        initialCountry="India"
        initialState={stateName || ""}
        initialDistrict={districtName || ""}
        initialBlock=""
      />
    </>
  );
}
