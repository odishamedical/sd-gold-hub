import React from "react";
import { Metadata } from "next";
import ClientPage from "./ClientPage";
import { getProductById, getShopById } from "@/lib/firestore/products";
import { extractIdFromSlug } from "@/lib/utils/seo-routing";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = extractIdFromSlug(decodeURIComponent(resolvedParams.id));
  
  try {
    const product = await getProductById(id);
    if (!product) {
      return { title: "Authentic Gold Jewellery | Gold Dunia" };
    }
    
    const shop = await getShopById(product.shopId);
    const vendorName = shop ? shop.name : "Verified Jeweler";
    const purity = product.metalPurityId === 'm1' ? '24K Pure Gold' : '22K Gold';
    
    const title = `${product.designName} | ${purity} | ${vendorName} | Golddunia`;
    const description = `Shop authentic ${purity} ${product.designName} from ${vendorName}. 100% BIS Hallmarked. Secure insured delivery across India.`;
    let imageUrl = product.images && product.images.length > 0 ? product.images[0] : "https://golddunia.com/og-universal-banner.png";
    if (imageUrl.startsWith("/")) imageUrl = `https://golddunia.com${imageUrl}`;

    const ogImage = {
      url: imageUrl,
      width: 1200,
      height: 1200,
      alt: title
    };

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      }
    };
  } catch (e) {
    return { title: "Golddunia | Masterpiece" };
  }
}

export default function ProductServerPage({ params }: { params: Promise<{ id: string }> }) {
  return <ClientPage params={params} />;
}
