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
    
    if (!shop) return { title: 'Verified Jeweler | Golddunia' };
    
    const title = `${shop.name} - Verified Gold Jeweler | Golddunia`;
    const description = shop.description || `Shop authentic jewelry at ${shop.name}.`;
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
    return { title: 'Verified Jeweler | Golddunia' };
  }
}

export default async function ShopProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const shopId = resolvedParams.id;

  return <ClientPage shopId={shopId} />;
}
