import React from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Gold Dunia",
  description: "Get in touch with Gold Dunia support and the Shyam Dash Creation headquarters.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden border-b border-[#2A344A]">
        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#C5A059] font-bold mb-4 tracking-wider uppercase drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We are here to help. Reach out to the Shyam Dash Creation team for platform support, franchise inquiries, or vendor assistance.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-lg">
            <h2 className="text-2xl font-serif text-[#C5A059] font-bold mb-6">Headquarters</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                  <Building2Icon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Shyam Dash Creation</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    A Premier Publicity & Marketing House
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                  <MapPin className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Corporate Office</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    R7/A2, Jagannath Colony,<br />
                    Budharaja, Sambalpur,<br />
                    Odisha, PIN: 768004
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                  <Phone className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Phone Support</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    +91 7683811120
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                  <Mail className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email Inquiry</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    support@golddunia.com
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#0A1021] border border-[#2A344A] p-8 rounded-2xl">
          <h2 className="text-2xl font-serif text-white font-bold mb-6">Send us a Message</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</label>
              <input type="text" className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="How can we help you?" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
              <textarea rows={5} className="w-full bg-[#141C33] border border-[#2A344A] rounded-lg p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="Write your message here..."></textarea>
            </div>

            <button type="button" className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#060A14] font-bold uppercase tracking-widest py-4 rounded-lg transition-colors mt-4">
              Submit Inquiry
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

function Building2Icon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
  );
}
