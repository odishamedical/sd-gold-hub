import React from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { getShopById } from '@/lib/firestore/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  
  try {
    const shop = await getShopById(decodedId);
    
    if (!shop) return { title: 'Verified Gold Jeweler | Golddunia' };
    
    const district = shop.district || shop.city || "your area";
    const state = shop.state || "";
    
    const title = `${shop.name} - Best Gold Jewellery Shop in ${district}${state ? `, ${state}` : ""} | Gold Dunia`;
    const description = `Visit ${shop.name} in ${district} for the latest Gold Necklace designs, Bangles, and BIS Hallmarked Jewellery.`;
    const imageUrl = shop.logoUrl || "https://sd-gold-hub.vercel.app/home-hero.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [imageUrl]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl]
      }
    };
  } catch (e) {
    return { title: 'Verified Gold Jeweler | Golddunia' };
  }
}

export default async function ShopProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const shopId = resolvedParams.id;

  return <ClientPage shopId={shopId} />;
}
