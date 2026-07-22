import React from "react";
import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getRecentProducts } from "@/lib/firestore/products";
import { getShops } from "@/lib/firestore/shops";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Golddunia | Verified Jewelers Directory",
  description: "Find the best trusted gold jewelers, showrooms, and check live gold rates.",
};

export default async function HomePage() {
  // Fetch data on the server
  // Note: we can use Promise.all to fetch them concurrently for speed
  const [recentProducts, featuredShops] = await Promise.all([
    getRecentProducts(20),
    getShops(true) // Get verified shops
  ]);

  return <HomeClient recentProducts={recentProducts} featuredShops={featuredShops} />;
}
