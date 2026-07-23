import React from "react";
import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shop Hallmarked Gold & Diamond Jewelry | Golddunia",
  description: "Explore authenticated 22K & 24K gold masterpieces from India's finest verified jewelers.",
};

export default function ShopServerPage() {
  return <ClientPage />;
}
