import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ArtisanCirclesWidget({ data }: { data: any }) {
  const circles = data.circles || [
    { title: "24K Necklaces", img: "/diamond_necklace_luxury.png", link: "/shop?category=Necklace" },
    { title: "Bridal Bangles", img: "/gold_bangle_luxury.png", link: "/shop?category=Bangle" },
    { title: "Diamond Rings", img: "/hero-gold.png", link: "/shop?category=Ring" },
    { title: "Gold Pendants", img: "/diamond_necklace_luxury.png", link: "/shop?category=Pendant" },
    { title: "Luxury Watches", img: "/gold_bangle_luxury.png", link: "/shop?category=Watch" },
    { title: "Temple Jewellery", img: "/hero-gold.png", link: "/shop?style=Temple" },
    { title: "Gold Coins", img: "/diamond_necklace_luxury.png", link: "/shop?category=Coin" },
  ];

  return (
    <section className="w-full">
      <div className="flex overflow-x-auto gap-6 sm:gap-12 pb-4 scrollbar-hide snap-x justify-start sm:justify-center px-4">
        {circles.map((circle: any, idx: number) => (
          <Link key={idx} href={circle.link || "/shop"} className="flex flex-col items-center gap-3 shrink-0 snap-center group cursor-pointer">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#C5A059]/40 group-hover:border-[#C5A059] group-hover:scale-105 transition-all shadow-lg p-1">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image src={circle.img || "/hero-gold.png"} alt={circle.title || "Category"} fill className="object-cover" />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 group-hover:text-[#C5A059] transition-colors whitespace-nowrap">
              {circle.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
