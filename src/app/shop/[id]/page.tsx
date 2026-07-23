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
    
    return {
      title: `${shop.name} - Verified Gold Jeweler | Golddunia`,
      description: shop.description || `Shop authentic jewelry at ${shop.name}.`,
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
