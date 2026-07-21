"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function GlobalSearchConsole() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/franchise/dashboard") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/login")
  ) {
    return null;
  }

  const category = searchParams?.get("category") || "";
  const purity = searchParams?.get("purity") || "";
  const style = searchParams?.get("style") || "";
  const minPrice = searchParams?.get("minPrice") || "";
  const maxPrice = searchParams?.get("maxPrice") || "";
  const price = (minPrice && maxPrice) ? `${minPrice}-${maxPrice}` : "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(pathname?.includes('search') ? searchParams?.toString() : "");
    if (key === "price") {
      if (value) {
        const [min, max] = value.split("-");
        params.set("minPrice", min);
        params.set("maxPrice", max);
      } else {
        params.delete("minPrice");
        params.delete("maxPrice");
      }
    } else {
      if (value) params.set(key, value); else params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const selectStyles = "bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059]/50 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all cursor-pointer min-w-[180px] shadow-sm appearance-none";
  const arrowStyle = `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23C5A059%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`;

  return (
    <div className="hidden lg:flex w-full bg-[#060A14] backdrop-blur-xl border-b border-[#C5A059]/30 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] z-40 relative">
      <div className="w-full px-6 lg:px-8 py-4 flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center shadow-inner">
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-[#C5A059]">Quick Search</span>
        </div>

        <div className="flex-1 flex items-center gap-4 justify-end">
          <select 
            value={category} 
            onChange={(e) => handleFilterChange("category", e.target.value)} 
            className={selectStyles}
            style={{ backgroundImage: arrowStyle, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
          >
            <option value="">All Categories</option>
            <option value="Necklace">Necklaces</option>
            <option value="Bangle">Bangles</option>
            <option value="Ring">Rings</option>
            <option value="Earring">Earrings</option>
            <option value="Bracelet">Bracelets</option>
            <option value="Pendant">Pendants</option>
          </select>

          <select 
            value={purity} 
            onChange={(e) => handleFilterChange("purity", e.target.value)} 
            className={selectStyles}
            style={{ backgroundImage: arrowStyle, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
          >
            <option value="">All Purities</option>
            <option value="24K">24K (99.9%)</option>
            <option value="22K">22K (91.6%)</option>
            <option value="18K">18K (75.0%)</option>
            <option value="14K">14K (58.3%)</option>
          </select>

          <select 
            value={style} 
            onChange={(e) => handleFilterChange("style", e.target.value)} 
            className={selectStyles}
            style={{ backgroundImage: arrowStyle, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
          >
            <option value="">All Styles</option>
            <option value="Bridal">Bridal</option>
            <option value="Everyday">Everyday</option>
            <option value="Temple">Temple Jewellery</option>
            <option value="Antique">Antique</option>
          </select>

          <select 
            value={price} 
            onChange={(e) => handleFilterChange("price", e.target.value)} 
            className={selectStyles}
            style={{ backgroundImage: arrowStyle, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
          >
            <option value="">Any Price</option>
            <option value="10000-50000">₹10,000 - ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1 Lakh</option>
            <option value="100000-250000">₹1 Lakh - ₹2.5 Lakhs</option>
            <option value="250000-500000">₹2.5 Lakhs - ₹5 Lakhs</option>
            <option value="500000-99999999">Above ₹5 Lakhs</option>
          </select>

          <button 
            onClick={() => router.push("/shop")}
            className="bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_20px_-10px_rgba(197,160,89,0.2)] shrink-0 cursor-pointer ml-2"
          >
            Explore All
          </button>
        </div>

      </div>
    </div>
  );
}
