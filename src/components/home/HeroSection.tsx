"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/directory?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/directory`);
    }
  };

  const geoChips = [
    { label: "ODISHA", href: "/directory/india/odisha" },
    { label: "DELHI", href: "/directory/india/delhi" },
    { label: "MUMBAI", href: "/directory/india/maharashtra/mumbai" },
    { label: "KOLKATA", href: "/directory/india/west-bengal/kolkata" },
    { label: "CHENNAI", href: "/directory/india/tamil-nadu/chennai" },
    { label: "DUBAI", href: "/directory/uae/dubai" },
  ];

  return (
    <section className="relative pt-32 pb-16 z-10 flex flex-col items-center justify-center min-h-[55vh]">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {/* Desktop Image */}
        <Image src="/stock/home-hero-pc.png" alt="Luxury Bridal Gold" fill priority className="hidden md:block object-cover object-left" />
        {/* Mobile Image */}
        <Image src="/stock/home-hero-phone.png" alt="Luxury Bridal Gold" fill priority className="block md:hidden object-cover object-top" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-black/30 to-black/70"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-end mt-8">
        <div className="w-full max-w-2xl text-center md:text-right">
          {/* Hero Text */}
          <div className="mb-8 flex flex-col items-center md:items-end">
            <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#DDA7A5] via-[#E5C158] to-[#D4AF37] font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-3">
              The World of Gold
            </h1>
            <h2 className="text-lg md:text-xl text-white/90 font-light tracking-[0.2em] uppercase mb-2 drop-shadow-md">
              Time-Tested Pure Value
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-light tracking-widest">
              GOLDDUNIA.COM
            </p>
          </div>

          {/* Search Capsule */}
          <form onSubmit={handleSearch} className="w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#DDA7A5]/20 to-[#D4AF37]/20 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border-2 border-white/30 rounded-[2rem] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] group-hover:border-[#DDA7A5]/50 transition-colors w-full">
              
              {/* Desktop Input */}
              <input 
                type="text" 
                placeholder="Find Trusted Gold Jewelers or Products..." 
                className="hidden md:block flex-1 bg-transparent border-none outline-none text-white px-6 placeholder-gray-300 font-light text-lg tracking-wide text-left min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Mobile Input */}
              <input 
                type="text" 
                placeholder="Gold Jewellery or shop" 
                className="block md:hidden flex-1 bg-transparent border-none outline-none text-white px-4 placeholder-gray-300 font-light text-base tracking-wide text-left min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button type="submit" className="p-2.5 md:p-3 mr-1 md:mr-2 flex-shrink-0 rounded-full bg-gradient-to-r from-[#DDA7A5] to-[#D4AF37] text-[#111] transition-all flex items-center justify-center hover:scale-105 shadow-lg">
                <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
              </button>
            </div>
          </form>

          {/* Geo Chips */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-6">
            {geoChips.map((chip, idx) => (
              <Link key={chip.label} href={chip.href} className={`px-5 py-1.5 rounded-[2rem] border text-xs font-light tracking-wide backdrop-blur-md transition-all hover:scale-105 ${idx === 0 ? 'border-[#DDA7A5] text-[#DDA7A5] shadow-[0_0_15px_rgba(221,167,165,0.3)] bg-black/40' : 'border-white/30 text-white bg-black/20 hover:border-white/60 hover:text-[#D4AF37]'}`}>
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
