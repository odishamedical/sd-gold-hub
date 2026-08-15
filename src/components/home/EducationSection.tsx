import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function EducationSection() {
  return (
    <section className="relative z-10 py-16 bg-[#0A1021]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-[#C5A059]/20 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-2 tracking-widest uppercase">
              Gold Education & Insights
            </h2>
            <p className="text-[#9CA3AF] font-light text-sm">Empowering you with knowledge before you buy.</p>
          </div>
          <Link href="/guide" className="text-[#C5A059] text-sm hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 font-light uppercase tracking-widest font-bold">
            View Full Guide <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { slug: "what-is-gold", title: "What is Gold?", desc: "The history and enduring allure of the eternal metal." },
            { slug: "gold-purity", title: "Understanding Purity", desc: "Demystifying Karats (24K, 22K) and BIS hallmarks." },
            { slug: "choosing-jewellery", title: "Choosing Jewellery", desc: "A guide to making-charges and craftsmanship." },
            { slug: "gold-investment", title: "Gold as Investment", desc: "Physical gold vs. ETFs and Sovereign Bonds." }
          ].map((topic, i) => (
            <Link href={`/guide/${topic.slug}`} key={i} className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#C5A059]/50 transition-all flex flex-col justify-between h-full shadow-lg">
              <div>
                <h3 className="text-lg font-serif text-white mb-2 group-hover:text-[#C5A059] transition-colors">{topic.title}</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">{topic.desc}</p>
              </div>
              <div className="mt-6 text-[#C5A059] text-xs font-bold uppercase tracking-widest flex items-center">
                Read Article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
