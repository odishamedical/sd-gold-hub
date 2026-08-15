import React from "react";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import Link from "next/link";
import { BookOpen, Sparkles, ShieldCheck, Gem, TrendingUp, Landmark, Users } from "lucide-react";

export const metadata = {
  title: "Gold Education Guide | Gold Dunia",
  description: "Your comprehensive guide to understanding gold purity, investment, pricing, and history.",
};

const guideTopics = [
  {
    slug: "what-is-gold",
    title: "What is Gold?",
    description: "The history, chemistry, and enduring allure of the world's most precious metal.",
    icon: <Sparkles className="w-6 h-6 text-[#C5A059]" />
  },
  {
    slug: "gold-purity",
    title: "Understanding Gold Purity",
    description: "Demystifying Karats (24K, 22K, 18K), hallmark certifications, and common alloys.",
    icon: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
  },
  {
    slug: "choosing-jewellery",
    title: "Choosing Gold Jewellery",
    description: "A buyer's guide to inspecting craftsmanship, making-charges, and authenticity.",
    icon: <Gem className="w-6 h-6 text-[#C5A059]" />
  },
  {
    slug: "gold-investment",
    title: "Gold as an Investment",
    description: "Comparing physical gold, digital gold, ETFs, and Sovereign Gold Bonds.",
    icon: <TrendingUp className="w-6 h-6 text-[#C5A059]" />
  },
  {
    slug: "why-is-gold-costly",
    title: "Why is Gold Costly?",
    description: "Exploring the scarcity, mining difficulty, and economic factors driving value.",
    icon: <BookOpen className="w-6 h-6 text-[#C5A059]" />
  },
  {
    slug: "who-controls-gold-price",
    title: "Who Controls the Price?",
    description: "The role of the LBMA, central banks, and global market demand dynamics.",
    icon: <Landmark className="w-6 h-6 text-[#C5A059]" />
  },
  {
    slug: "gold-consumption-india",
    title: "Gold Consumption in India",
    description: "Cultural significance and India's position as a top global consumer.",
    icon: <Users className="w-6 h-6 text-[#C5A059]" />
  }
];

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden border-b border-[#2A344A]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-[#060A14] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#C5A059] font-bold mb-6 tracking-wider drop-shadow-lg">
            Gold Education & Insights
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            Whether you are a first-time buyer or a seasoned investor, our comprehensive guide empowers you with the knowledge to make informed decisions in the world of gold.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guideTopics.map((topic, index) => (
            <Link href={`/guide/${topic.slug}`} key={index} className="group block h-full">
              <div className="bg-[#0A1021] border border-[#2A344A] p-8 rounded-2xl h-full flex flex-col hover:border-[#C5A059]/50 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0 border border-[#C5A059]/30 mb-6 group-hover:scale-110 transition-transform">
                  {topic.icon}
                </div>
                <h2 className="text-xl font-serif text-white font-bold mb-3 group-hover:text-[#C5A059] transition-colors">{topic.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed font-light mb-4 flex-grow">
                  {topic.description}
                </p>
                <div className="text-[#C5A059] text-xs font-bold uppercase tracking-widest flex items-center mt-auto">
                  Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  );
}
