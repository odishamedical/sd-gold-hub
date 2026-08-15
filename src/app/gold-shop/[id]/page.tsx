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
    
    const district = shop.location?.district || shop.location?.city || (shop as any).district || "your area";
    const state = shop.location?.state || (shop as any).state || "";
    
    const title = `${shop.name} - Best Gold Jewellery Shop in ${district}${state ? `, ${state}` : ""} | Gold Dunia`;
    const description = `Visit ${shop.name} in ${district} for the latest Gold Necklace designs, Bangles, and BIS Hallmarked Jewellery.`;
    let imageUrl = shop.logoUrl || "https://golddunia.com/stock/directory-hero-pc.png";
    if (imageUrl.startsWith("/")) imageUrl = `https://golddunia.com${imageUrl}`;

    const ogImage = {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: title
    };

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [ogImage]
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
