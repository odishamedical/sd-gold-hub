"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, MapPin, Shield, HeartHandshake, Phone, ChevronDown } from "lucide-react";

export default function GlobalFooter() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#060A14] border-t border-[#C5A059]/20 pt-16 pb-8 relative z-40 overflow-hidden">
      {/* Subtle luxury glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Brand & Trust Section */}
          <div className="space-y-6 lg:col-span-4">
            <Link href="/" className="inline-block flex items-center gap-3 mb-2">
              <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0">
                <img src="/gdlogo.png" alt="Gold Dunia" className="w-full h-full object-cover object-top scale-[1.4]" />
              </div>
              <div>
                <h2 className="text-2xl font-[family-name:var(--font-display)] tracking-widest text-[#C5A059] leading-none">
                  GOLD DUNIA
                </h2>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">A Shyam Dash Creation</p>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              The Ultimate World of Authentic Gold & Fine Jewelry. Direct from master jewelers to you.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-slate-300">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span className="text-sm font-medium">100% HUID Certified</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Shield className="w-5 h-5 text-[#C5A059]" />
                <span className="text-sm font-medium">Secure Escrow Protection</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <HeartHandshake className="w-5 h-5 text-[#C5A059]" />
                <span className="text-sm font-medium">Trusted by Master Jewelers</span>
              </div>
            </div>
          </div>

          {/* Corporate Links */}
          <div className="lg:col-span-2 lg:pl-4 border-b border-[#2A344A] md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('corporate')}
              className="w-full flex justify-between items-center md:cursor-default py-2 md:py-0"
            >
              <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest font-serif">Corporate</h3>
              <ChevronDown className={`w-5 h-5 text-[#C5A059] transition-transform md:hidden ${openSection === 'corporate' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 md:space-y-3 mt-4 md:mt-6 transition-all overflow-hidden ${openSection === 'corporate' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'}`}>
              <li><Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>About Us</Link></li>
              <li><Link href="/media" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Media & Press</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Careers</Link></li>
              <li><Link href="/jobs" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Industry Jobs</Link></li>
              <li><Link href="/directory" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Master Directory</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="lg:col-span-3 border-b border-[#2A344A] md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('legal')}
              className="w-full flex justify-between items-center md:cursor-default py-2 md:py-0"
            >
              <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest font-serif">Legal & Policies</h3>
              <ChevronDown className={`w-5 h-5 text-[#C5A059] transition-transform md:hidden ${openSection === 'legal' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 md:space-y-3 mt-4 md:mt-6 transition-all overflow-hidden ${openSection === 'legal' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'}`}>
              <li><Link href="/privacy" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Cancellation & Refunds</Link></li>
              <li><Link href="/shipping" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Shipping & Delivery</Link></li>
              <li><Link href="/sell-with-us" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>Vendor Registration</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="lg:col-span-3 border-b border-[#2A344A] md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('support')}
              className="w-full flex justify-between items-center md:cursor-default py-2 md:py-0"
            >
              <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-widest font-serif">Support & Contact</h3>
              <ChevronDown className={`w-5 h-5 text-[#C5A059] transition-transform md:hidden ${openSection === 'support' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-6 mt-4 md:mt-6 transition-all overflow-hidden ${openSection === 'support' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[500px] md:opacity-100'}`}>
              <li>
                <a href="mailto:support@golddunia.com" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[#141C33] border border-transparent hover:border-[#C5A059]/20 transition-all">
                  <Mail className="w-5 h-5 text-[#C5A059] group-hover:scale-110 transition-transform mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-bold">Email Us</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">support@golddunia.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 p-3 rounded-xl">
                  <Phone className="w-5 h-5 text-[#C5A059] mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-bold">Phone Support</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">+91 7683811120<br/>+91 6371390831</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 p-3 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#C5A059] mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-bold">Headquarters</p>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mt-1">
                      R7/A2-Jagannath Colony,<br/>Budharaja, Sambalpur,<br/>Odisha, Pin: 768004
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <div className="pt-6 mt-4 border-t border-[#2A344A]">
              <div className="flex items-center gap-4">
                <a href="https://instagram.com/shyamdash" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center hover:scale-110 hover:border-[#E1306C] transition-all group">
                  <svg className="w-5 h-5 fill-slate-400 group-hover:fill-[#E1306C] transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.facebook.com/oltamind" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center hover:scale-110 hover:border-[#1877F2] transition-all group">
                  <svg className="w-5 h-5 fill-slate-400 group-hover:fill-[#1877F2] transition-colors" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="https://youtube.com/@shyamdashlive" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center hover:scale-110 hover:border-[#FF0000] transition-all group">
                  <svg className="w-5 h-5 fill-slate-400 group-hover:fill-[#FF0000] transition-colors" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Global SEO & Brand Authority Block */}
        <div className="mt-16 pt-12 border-t border-white/5 text-center">
          <h4 className="text-[#C5A059] font-serif text-lg font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-md">Powered by Shyam Dash Creation IT Services</h4>
          <p className="text-sm text-slate-400 leading-relaxed max-w-5xl mx-auto font-light">
            Gold Dunia is the flagship digital ecosystem engineered by <strong className="text-slate-300">Shyam Dash Creation</strong>, a premier Information Technology and Digital Marketing powerhouse. 
            We specialize in developing robust multi-tenant web applications, advanced operating software, and secure e-commerce ecosystems. 
            Our digital infrastructure currently powers a massive network of over one million active users across social platforms. 
            By merging cutting-edge IT solutions with strict hallmarked purity standards, we are successfully elevating local corporate houses, master weavers, and authentic gold jewelers onto the global digital stage.
          </p>
        </div>

      </div>
    </footer>
  );
}
