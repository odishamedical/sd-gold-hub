import React from "react";
import { Metadata } from "next";
import ClientDirectory from "@/app/directory/[[...slug]]/ClientDirectory";
import { getShops } from "@/lib/firestore/shops";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string, location: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawLocation = decodeURIComponent(resolvedParams.location);
  const rawCategory = decodeURIComponent(resolvedParams.category);
  
  const locationParts = rawLocation.split('-');
  const locationName = locationParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  
  const categoryParts = rawCategory.split('-');
  const categoryName = categoryParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  const title = `Best ${categoryName} in ${locationName} | Buy Gold ${categoryName} | Gold Dunia`;
  const description = `Shop the latest ${categoryName} designs from top-rated gold jewellery shops in ${locationName}. 100% BIS Hallmarked.`;

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

export default async function GeoTargetedCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawLocation = decodeURIComponent(resolvedParams.location);
  const rawCategory = decodeURIComponent(resolvedParams.category);
  
  const locationParts = rawLocation.split('-');
  const districtName = locationParts.length > 0 ? locationParts[0].charAt(0).toUpperCase() + locationParts[0].slice(1) : "";
  const stateName = locationParts.length > 1 ? locationParts[1].charAt(0).toUpperCase() + locationParts[1].slice(1) : "";

  const categoryParts = rawCategory.split('-');
  const categoryName = categoryParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  return (
    <>
      <h1 className="sr-only">Best {categoryName} in {districtName} {stateName}</h1>
      
      {/* We reuse ClientDirectory. For a real category filtering, ClientDirectory could be modified to accept a category filter prop. For now, it ranks as a localized directory. */}
      <ClientDirectory 
        initialCountry="India"
        initialState={stateName || ""}
        initialDistrict={districtName || ""}
        initialBlock=""
      />
    </>
  );
}
