import React from "react";
import { Building2, Globe, Users, Trophy } from "lucide-react";

export const metadata = {
  title: "About Us | Gold Dunia & Shyam Dash Creation",
  description: "Learn about Shyam Dash Creation, the powerhouse behind Gold Dunia and a global ecosystem of digital innovation.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden border-b border-[#C5A059]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3B1518]/60 via-[#060A14] to-[#060A14] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#C5A059]/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
          <p className="text-[#C5A059] font-mono text-sm tracking-[0.3em] uppercase mb-4">A Legacy of Excellence</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-8 tracking-wider drop-shadow-2xl">
            About <span className="text-[#C5A059]">Shyam Dash Creation</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
            A premier Publicity and Marketing House driving digital promotion, social media networking, and information technology development. 
            We are the visionary creators behind a one-million-strong digital ecosystem.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-16 space-y-20">
        
        {/* Founder Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-[#141C33] to-[#0A1021] p-8 md:p-12 rounded-[2rem] border border-[#C5A059]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold tracking-wide">Our Founder & Visionary</h2>
            <div className="w-16 h-1 bg-[#C5A059]/50 rounded-full"></div>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              Founded by <strong className="text-white font-medium">Shyam Sundar Dash</strong>, our organization is built on a massive foundation of industry expertise. 
              With over 40 years of vast experience in pharmaceutical product manufacturing, marketing, and creating vast networks for medical personalities and business houses, Mr. Dash brings unparalleled leadership to the digital realm.
            </p>
          </div>
          <div className="relative h-[450px] rounded-[1.5rem] overflow-hidden border border-[#C5A059]/40 flex items-center justify-center bg-[#060A14] shadow-2xl group">
             {/* Placeholder for Founder Image */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="text-center p-6 relative z-10">
                <Trophy className="w-20 h-20 text-[#C5A059] mx-auto mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                <p className="text-[#C5A059] font-mono uppercase tracking-[0.2em] text-sm font-bold">40 Years of Excellence</p>
             </div>
          </div>
        </section>

        {/* Global Mission */}
        <section className="space-y-16 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-6 tracking-wide">Our Core <span className="text-[#C5A059]">Mission</span></h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-8"></div>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              We specialize in elevating local corporate houses to the global platform. From promoting original, hallmarked gold jewelry showrooms across the nation to empowering local Sambalpuri handloom weavers and developing massive healthcare IT networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A1021]/80 backdrop-blur-sm border border-[#C5A059]/20 p-10 rounded-2xl text-center hover:border-[#C5A059]/60 hover:bg-[#141C33] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 duration-300 group">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-[#C5A059]" />
              </div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm font-serif">Global Promotion</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">Elevating local businesses, original gold jewelers, and weavers onto the international stage.</p>
            </div>
            <div className="bg-[#0A1021]/80 backdrop-blur-sm border border-[#C5A059]/20 p-10 rounded-2xl text-center hover:border-[#C5A059]/60 hover:bg-[#141C33] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 duration-300 group">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-[#C5A059]" />
              </div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm font-serif">Social Powerhouse</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">Operating a massive social media network with over 1 million+ active members across Facebook, Instagram, and YouTube.</p>
            </div>
            <div className="bg-[#0A1021]/80 backdrop-blur-sm border border-[#C5A059]/20 p-10 rounded-2xl text-center hover:border-[#C5A059]/60 hover:bg-[#141C33] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 duration-300 group">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-[#C5A059]" />
              </div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm font-serif">Tech Infrastructure</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">Developing cutting-edge web applications, operating software, and healthcare IT networks.</p>
            </div>
          </div>
        </section>

        {/* The Gold Dunia Platform */}
        <section className="bg-gradient-to-r from-[#C5A059]/10 via-[#0A1021] to-[#0A1021] p-10 md:p-16 rounded-[2rem] border-l-4 border-[#C5A059] shadow-2xl relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-8 tracking-wide">About <span className="text-[#C5A059]">Gold Dunia</span></h2>
          <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              Gold Dunia is a revolutionary multi-tenant, subscription-based platform. We empower jewelry showrooms by providing them with customized subdomains and dedicated digital storefronts to showcase their verified products.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              Our unique model blends digital discovery with physical trust. We do not sell products directly online. Instead, customers can discover beautiful pieces and book them with a 30% advance payment. The final purchase and verification always happen securely in person at the local showroom.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
