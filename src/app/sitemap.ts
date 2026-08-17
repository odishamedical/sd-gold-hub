import { MetadataRoute } from 'next';
import { parseFirestoreDocument } from "@/lib/firestore/restParser";

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

const CATEGORIES = [
  'gold-necklace',
  'gold-bangles',
  'gold-earrings',
  'gold-ring',
  'gold-chain',
  'bridal-jewellery',
  'mangalsutra'
];

async function fetchAllShopsREST() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/sd-gold-hub/databases/(default)/documents/shops?pageSize=1000`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map(parseFirestoreDocument);
  } catch (err) {
    console.error("Error fetching shops for sitemap:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await fetchAllShopsREST();
  const baseUrl = 'https://golddunia.com';
  
  const sitemapUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/gold-price-live`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/directory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/gold-jewellery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const uniqueLocations = new Set<string>();

  // Shop Profiles & Extract Unique Locations
  shops.forEach((shop: any) => {
    if (shop.id) {
      sitemapUrls.push({
        url: `${baseUrl}/gold-shop/${shop.id}`,
        lastModified: shop.updatedAt ? new Date(shop.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    const district = shop.location?.district || shop.district || "";
    const state = shop.location?.state || shop.state || "";
    
    if (district && state) {
      const locationSlug = `${district.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}`;
      uniqueLocations.add(locationSlug);
    }
  });

  // Dynamic Location Pages
  uniqueLocations.forEach(locationSlug => {
    // General location page
    sitemapUrls.push({
      url: `${baseUrl}/gold-jewellery-in-${locationSlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Category + Location pages
    CATEGORIES.forEach(category => {
      sitemapUrls.push({
        url: `${baseUrl}/buy-${category}-in-${locationSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  return sitemapUrls;
}
