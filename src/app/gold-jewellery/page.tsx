import React from "react";
import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shop Hallmarked Gold & Diamond Jewelry | Golddunia",
  description: "Explore authenticated 22K & 24K gold masterpieces from India's finest verified jewelers.",
};

import { Suspense } from "react";

export default function ShopServerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060A14] flex items-center justify-center text-[#C5A059]">Loading Vault...</div>}>
      <ClientPage />
    </Suspense>
  );
}
