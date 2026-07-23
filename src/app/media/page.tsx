import React from "react";
import { Youtube, PlayCircle } from "lucide-react";

export const metadata = {
  title: "Media & Press | Gold Dunia",
  description: "News, updates, and video media from Gold Dunia and Shyam Dash Creation.",
};

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden border-b border-[#2A344A]">
        <div className="absolute inset-0 bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#C5A059] font-bold mb-4 tracking-wider uppercase drop-shadow-lg">
            Media & Press
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and viral videos from the Shyam Dash Creation network.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-16">
        
        {/* Featured Video */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0A1021] border border-[#2A344A] group cursor-pointer">
              {/* Fake Video Thumbnail */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  <PlayCircle className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <span className="text-red-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                <Youtube className="w-4 h-4" /> YouTube Feature
              </span>
              <h2 className="text-3xl font-serif text-white font-bold">The Launch of Gold Dunia</h2>
              <p className="text-slate-400 leading-relaxed">
                Watch founder Shyam Sundar Dash announce the revolutionary Gold Dunia platform, designed to bring absolute transparency and digital scale to local hallmarked gold showrooms.
              </p>
              <button className="bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#060A14] font-bold uppercase tracking-widest px-6 py-3 rounded transition-colors mt-2">
                Watch Full Video
              </button>
            </div>
          </div>
        </section>

        {/* Press Releases Grid */}
        <section>
          <h2 className="text-2xl font-serif text-[#C5A059] font-bold mb-8 border-b border-[#2A344A] pb-4">Latest Press Releases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#0A1021] border border-[#2A344A] p-6 rounded-2xl hover:border-[#C5A059]/50 transition-colors">
              <span className="text-xs text-slate-500 font-mono mb-3 block">July 26, 2026</span>
              <h3 className="text-white font-bold text-lg mb-3">Shyam Dash Creation Hits 1 Million Network Strength</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                The massive digital marketing and publicity house has successfully aggregated over one million highly engaged users across Facebook, Instagram, and YouTube.
              </p>
              <button className="text-[#C5A059] text-sm font-bold uppercase tracking-widest">Read More →</button>
            </div>

            <div className="bg-[#0A1021] border border-[#2A344A] p-6 rounded-2xl hover:border-[#C5A059]/50 transition-colors">
              <span className="text-xs text-slate-500 font-mono mb-3 block">July 15, 2026</span>
              <h3 className="text-white font-bold text-lg mb-3">Gold Dunia Multi-Tenant Architecture Revealed</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                Empowering jewelers nationwide, the new platform allows instant creation of customized digital storefronts with advance booking capabilities.
              </p>
              <button className="text-[#C5A059] text-sm font-bold uppercase tracking-widest">Read More →</button>
            </div>

            <div className="bg-[#0A1021] border border-[#2A344A] p-6 rounded-2xl hover:border-[#C5A059]/50 transition-colors">
              <span className="text-xs text-slate-500 font-mono mb-3 block">June 02, 2026</span>
              <h3 className="text-white font-bold text-lg mb-3">Bhulia Hub Onboards 500+ Master Weavers</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                In a monumental push for local artisans, the sister platform Bhulia Hub has connected hundreds of Sambalpuri weavers directly to global buyers.
              </p>
              <button className="text-[#C5A059] text-sm font-bold uppercase tracking-widest">Read More →</button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
