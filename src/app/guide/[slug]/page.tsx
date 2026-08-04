import React from "react";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { guideArticles } from "../data";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = guideArticles[params.slug as keyof typeof guideArticles];
  if (!article) return { title: "Not Found" };
  
  return {
    title: `${article.title} | Gold Dunia`,
    description: article.description,
  };
}

export default function GuideArticlePage({ params }: { params: { slug: string } }) {
  const article = guideArticles[params.slug as keyof typeof guideArticles];
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      <Header />
      
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <Link href="/guide" className="inline-flex items-center text-[#C5A059] hover:text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Guide
        </Link>
        
        <article>
          <header className="mb-12 border-b border-[#2A344A] pb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-6 leading-tight drop-shadow-md">
              {article.title}
            </h1>
            <p className="text-xl text-[#C5A059] font-light leading-relaxed">
              {article.description}
            </p>
          </header>
          
          <div 
            className="text-slate-300 leading-relaxed font-light space-y-6 text-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
        
        {/* Footer CTA */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 text-center">
          <h3 className="text-2xl font-serif text-white font-bold mb-4">Ready to start your journey?</h3>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto font-light">
            Explore verified showrooms and browse exquisite collections directly from our platform.
          </p>
          <Link href="/directory" className="inline-block bg-[#C5A059] hover:bg-[#D4AF37] text-[#060A14] px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-colors shadow-lg shadow-[#C5A059]/20">
            Find a Showroom
          </Link>
        </div>
      </main>
      
      <GlobalFooter />
    </div>
  );
}
