import React from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { getShopById } from '@/lib/firestore/products';
import { extractIdFromSlug } from '@/lib/utils/seo-routing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const actualId = extractIdFromSlug(decodedId);
  
  try {
    const shop = await getShopById(actualId);
    
    if (!shop) return { title: 'Verified Gold Jeweler | Golddunia' };
    
    const district = shop.location?.district || shop.location?.city || (shop as any).district || "your area";
    const state = shop.location?.state || (shop as any).state || "";
    
    const title = `${shop.name} - Best Gold Jewellery Shop in ${district}${state ? `, ${state}` : ""} | Gold Dunia`;
    const description = `Visit ${shop.name} in ${district} for the latest Gold Necklace designs, Bangles, and BIS Hallmarked Jewellery.`;
    let imageUrl = shop.logoUrl || "https://golddunia.com/og-universal-banner.png";
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
  const decodedId = decodeURIComponent(shopId);
  const actualId = extractIdFromSlug(decodedId);

  let jsonLd = null;
  try {
    const shop = await getShopById(actualId);
    if (shop) {
      const district = shop.location?.district || shop.location?.city || (shop as any).district || "your area";
      const state = shop.location?.state || (shop as any).state || "";
      const address = (shop.location as any)?.address || "";
      let imageUrl = shop.logoUrl || "https://golddunia.com/og-universal-banner.png";
      if (imageUrl.startsWith("/")) imageUrl = `https://golddunia.com${imageUrl}`;

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'JewelryStore',
        name: shop.name,
        image: imageUrl,
        '@id': `https://golddunia.com/gold-shop/${shopId}`,
        url: `https://golddunia.com/gold-shop/${shopId}`,
        telephone: shop.phone || '',
        address: {
          '@type': 'PostalAddress',
          streetAddress: address,
          addressLocality: district,
          addressRegion: state,
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: shop.location?.lat || 0,
          longitude: shop.location?.lng || 0
        }
      };
    }
  } catch (e) {
    // ignore
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ClientPage shopId={shopId} />
    </>
  );
}
