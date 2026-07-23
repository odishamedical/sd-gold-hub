import React from "react";
import { Briefcase, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Careers & Industry Jobs | Gold Dunia",
  description: "Explore career opportunities at Shyam Dash Creation or discover job openings posted by our verified jewelry showrooms.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden border-b border-[#2A344A]">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#C5A059] font-bold mb-4 tracking-wider uppercase drop-shadow-lg">
            Careers & Industry Jobs
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join the team at Shyam Dash Creation, or explore exciting career opportunities posted directly by the premium jewelry showrooms in our network.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-20">
        
        {/* Internal Careers */}
        <section>
          <div className="mb-10">
            <h2 className="text-3xl font-serif text-white font-bold mb-4">Work With Us</h2>
            <p className="text-slate-400 max-w-2xl">
              Open positions at the Shyam Dash Creation headquarters. Help us build the future of digital ecosystems, e-commerce platforms, and marketing networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock Job 1 */}
            <div className="bg-[#0A1021] border border-[#2A344A] p-6 rounded-2xl hover:border-[#C5A059]/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-[#141C33] flex items-center justify-center border border-[#2A344A]">
                  <Briefcase className="w-5 h-5 text-[#C5A059]" />
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Full Time</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C5A059] transition-colors">Senior React Developer</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">Join our core engineering team to build scalable Next.js applications across our global platforms including Gold Hub, Bhulia Hub, and Dehapa Hub.</p>
              <div className="flex justify-between items-center border-t border-[#2A344A] pt-4 mt-4">
                <span className="text-xs text-slate-500 font-mono">Sambalpur, Odisha (Hybrid)</span>
                <button className="text-xs text-[#C5A059] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Apply Now <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>

            {/* Mock Job 2 */}
            <div className="bg-[#0A1021] border border-[#2A344A] p-6 rounded-2xl hover:border-[#C5A059]/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-[#141C33] flex items-center justify-center border border-[#2A344A]">
                  <Briefcase className="w-5 h-5 text-[#C5A059]" />
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Full Time</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C5A059] transition-colors">Digital Marketing Manager</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">Manage and grow our massive social media network of 1 million+ followers across Facebook, Instagram, and YouTube.</p>
              <div className="flex justify-between items-center border-t border-[#2A344A] pt-4 mt-4">
                <span className="text-xs text-slate-500 font-mono">Sambalpur, Odisha</span>
                <button className="text-xs text-[#C5A059] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Apply Now <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Job Board */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div>
              <h2 className="text-3xl font-serif text-[#C5A059] font-bold mb-2">Jewelry Industry Job Board</h2>
              <p className="text-slate-300">Exclusive vacancies posted by our verified Gold Dunia showroom partners.</p>
            </div>
            <button className="bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059] text-white px-6 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-colors">
              Post a Vacancy (Vendors Only)
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            
            {/* Mock Industry Job */}
            <div className="bg-[#0A1021] border border-[#2A344A] p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#C5A059]/30 transition-colors">
              <div>
                <h4 className="text-white font-bold text-lg">Master Gold Artisan (Karigar)</h4>
                <p className="text-slate-400 text-sm mt-1">Posted by: <strong>Kalyan Jewellers (Mumbai Branch)</strong></p>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-xs text-slate-500 font-mono">
                  Experience: 5+ Years<br/>
                  Salary: Competitive
                </div>
                <button className="bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-colors w-full md:w-auto text-center">
                  View Details
                </button>
              </div>
            </div>

            {/* Mock Industry Job */}
            <div className="bg-[#0A1021] border border-[#2A344A] p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#C5A059]/30 transition-colors">
              <div>
                <h4 className="text-white font-bold text-lg">Showroom Sales Executive</h4>
                <p className="text-slate-400 text-sm mt-1">Posted by: <strong>Malabar Gold & Diamonds (Delhi)</strong></p>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-xs text-slate-500 font-mono">
                  Experience: 1-3 Years<br/>
                  Salary: ₹25k - ₹40k/month
                </div>
                <button className="bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-colors w-full md:w-auto text-center">
                  View Details
                </button>
              </div>
            </div>

            <div className="text-center pt-6">
              <button className="text-slate-400 hover:text-white font-mono text-sm tracking-widest uppercase transition-colors">
                View All Industry Jobs ↓
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
