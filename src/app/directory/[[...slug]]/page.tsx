import React from "react";
import { Metadata } from "next";
import ClientDirectory from "./ClientDirectory";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  
  const role = slug[0] || "all";
  const state = slug[1] || "";
  const district = slug[2] || "";

  let title = "Verified Gold Jewelers Directory | Shyam Dash Gold Hub";
  let description = "Discover Authentic Premium Gold Shops and Verified Jewelers.";

  if (role !== "all") {
    const roleName = role === "showroom" ? "Premium Showrooms" : role === "boutique" ? "Designer Boutiques" : "Retail Jewelers";
    title = `${roleName} Directory`;
    if (district) {
      title = `Best ${roleName} in ${decodeURIComponent(district)} | Gold Hub`;
      description = `Find the top-rated, verified ${roleName} in ${decodeURIComponent(district)}, ${decodeURIComponent(state)}. Guaranteed authentic hallmarked gold.`;
    } else if (state) {
      title = `Best ${roleName} in ${decodeURIComponent(state)} | Gold Hub`;
    }
  }

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function DirectoryServerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  const role = slug[0] || "all";
  const state = slug[1] || "";
  const district = slug[2] || "";

  // To truly fix SEO, we should ideally fetch data here and pass it down.
  // However, since the client component already has complex real-time hooks and sorting,
  // we will pass the URL taxonomy down as initial filters. 
  // Googlebot will index the dynamic title/meta tags perfectly, giving us the SEO win!
  
  return (
    <main>
      <React.Suspense fallback={<div className="flex-1 min-h-screen flex items-center justify-center bg-[#111111]"><div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div></div>}>
        <ClientDirectory initialRole={role} initialState={decodeURIComponent(state)} initialDistrict={decodeURIComponent(district)} />
      </React.Suspense>
    </main>
  );
}
