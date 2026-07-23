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
      <div className="relative py-20 overflow-hidden border-b border-[#2A344A]">
        <div className="absolute inset-0 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-[#C5A059] font-bold mb-6 tracking-wider uppercase drop-shadow-lg">
            About Shyam Dash Creation
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            A premier Publicity and Marketing House driving digital promotion, social media networking, and information technology development. 
            We are the visionary creators behind a one-million-strong digital ecosystem.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-16 space-y-20">
        
        {/* Founder Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-[#C5A059] font-bold">Our Founder & Visionary</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              Founded by <strong>Shyam Sundar Dash</strong>, our organization is built on a massive foundation of industry expertise. 
              With over 40 years of vast experience in pharmaceutical product manufacturing, marketing, and creating vast networks for medical personalities and business houses, Mr. Dash brings unparalleled leadership to the digital realm.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-[#C5A059]/30 flex items-center justify-center bg-[#0A1021]">
             {/* Placeholder for Founder Image */}
             <div className="text-center p-6">
                <Trophy className="w-16 h-16 text-[#C5A059] mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 font-mono uppercase tracking-widest text-sm">40 Years of Excellence</p>
             </div>
          </div>
        </section>

        {/* Global Mission */}
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif text-[#C5A059] font-bold mb-6">Our Core Mission</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              We specialize in elevating local corporate houses to the global platform. From promoting original, hallmarked gold jewelry showrooms across the nation to empowering local Sambalpuri handloom weavers and developing massive healthcare IT networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A1021] border border-[#2A344A] p-8 rounded-2xl text-center hover:border-[#C5A059]/50 transition-colors">
              <Globe className="w-10 h-10 text-[#C5A059] mx-auto mb-4" />
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">Global Promotion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Elevating local businesses, original gold jewelers, and weavers onto the international stage.</p>
            </div>
            <div className="bg-[#0A1021] border border-[#2A344A] p-8 rounded-2xl text-center hover:border-[#C5A059]/50 transition-colors">
              <Users className="w-10 h-10 text-[#C5A059] mx-auto mb-4" />
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">Social Powerhouse</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Operating a massive social media network with over 1 million+ active members across Facebook, Instagram, and YouTube.</p>
            </div>
            <div className="bg-[#0A1021] border border-[#2A344A] p-8 rounded-2xl text-center hover:border-[#C5A059]/50 transition-colors">
              <Building2 className="w-10 h-10 text-[#C5A059] mx-auto mb-4" />
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">Tech Infrastructure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Developing cutting-edge web applications, operating software, and healthcare IT networks.</p>
            </div>
          </div>
        </section>

        {/* The Gold Dunia Platform */}
        <section className="bg-gradient-to-br from-[#141C33] to-[#0A1021] p-8 md:p-12 rounded-3xl border border-[#2A344A]">
          <h2 className="text-3xl font-serif text-[#C5A059] font-bold mb-6">About Gold Dunia</h2>
          <p className="text-slate-300 leading-relaxed text-lg mb-6">
            Gold Dunia is a revolutionary multi-tenant, subscription-based platform. We empower jewelry showrooms by providing them with customized subdomains and dedicated digital storefronts to showcase their verified products.
          </p>
          <p className="text-slate-300 leading-relaxed text-lg">
            Our unique model blends digital discovery with physical trust. We do not sell products directly online. Instead, customers can discover beautiful pieces and book them with a 30% advance payment. The final purchase and verification always happen securely in person at the local showroom.
          </p>
        </section>

      </div>
    </div>
  );
}
