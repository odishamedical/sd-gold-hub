import React from "react";
import { Metadata } from "next";
import ClientPage from "./ClientPage";
import { getProductById, getShopById } from "@/lib/firestore/products";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const product = await getProductById(id);
    if (!product) {
      return { title: "Product Not Found | Golddunia" };
    }
    
    const shop = await getShopById(product.shopId);
    const vendorName = shop ? shop.name : "Verified Jeweler";
    const purity = product.metalPurityId === 'm1' ? '24K Pure Gold' : '22K Gold';
    
    return {
      title: `${product.designName} | ${purity} | ${vendorName} | Golddunia`,
      description: `Shop authentic ${purity} ${product.designName} from ${vendorName}. 100% BIS Hallmarked. Secure insured delivery across India.`,
      openGraph: {
        images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      }
    };
  } catch (e) {
    return { title: "Golddunia | Masterpiece" };
  }
}

export default function ProductServerPage({ params }: { params: Promise<{ id: string }> }) {
  return <ClientPage params={params} />;
}
