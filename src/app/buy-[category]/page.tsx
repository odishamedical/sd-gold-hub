import React from "react";
import { Metadata } from "next";
import ClientDirectory from "@/app/directory/[[...slug]]/ClientDirectory";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.category);
  
  const categoryParts = rawCategory.split('-');
  const categoryName = categoryParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  const title = `Buy ${categoryName} | Authentic 22K & 24K Gold | Gold Dunia`;
  const description = `Shop the latest ${categoryName} designs from top-rated verified gold jewellery shops. 100% BIS Hallmarked.`;

  return {
    title,
    description,
    openGraph: { 
      title, 
      description,
      images: ["https://golddunia.com/og-universal-banner.png"]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://golddunia.com/og-universal-banner.png"]
    }
  };
}

export default async function GenericCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.category);
  
  const categoryParts = rawCategory.split('-');
  const categoryName = categoryParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  return (
    <>
      <h1 className="sr-only">Buy Authentic Gold {categoryName} Online</h1>
      
      {/* We reuse ClientDirectory. For a real category filtering, ClientDirectory could be modified to accept a category filter prop. For now, it acts as a generic directory. */}
      <ClientDirectory 
        initialCountry="India"
        initialState=""
        initialDistrict=""
        initialBlock=""
      />
    </>
  );
}
