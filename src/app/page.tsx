import React from "react";
import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getRecentProducts } from "@/lib/firestore/products";
import { getShops } from "@/lib/firestore/shops";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Golddunia | The Ultimate World of Authentic Gold & Fine Jewelry",
  description: "Find the best trusted gold jewelers, showrooms, and check live gold rates.",
};

export default function HomePage() {
  return <HomeClient />;
}
