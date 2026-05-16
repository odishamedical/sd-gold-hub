"use client";

import { useState } from "react";
import Image from "next/image";

export default function SellWithUsWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission to backend
    setTimeout(() => {
      setStep(4); // Success step
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Header */}
      <header className="h-20 border-b border-[#D4AF37]/20 flex items-center px-8 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Image src="/sd_logo_final.png" alt="SD Gold Hub" width={40} height={40} className="object-contain" />
          <div className="flex flex-col">
            <h1 className="text-xl font-light tracking-widest uppercase">
              Shyam Dash <span className="font-bold text-[#D4AF37]">Gold Hub</span>
            </h1>
            <span className="text-[10px] text-[#A0AEC0] tracking-widest uppercase mt-0.5">Verified Vendor Registration</span>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="w-full max-w-2xl relative z-10">
          
          {/* Progress Bar (Only show if not on success step) */}
          {step < 4 && (
            <div className="mb-12">
              <div className="flex justify-between text-xs font-bold tracking-widest text-[#A0AEC0] uppercase mb-4">
                <span className={step >= 1 ? "text-[#D4AF37]" : ""}>1. Store Details</span>
                <span className={step >= 2 ? "text-[#D4AF37]" : ""}>2. Compliance</span>
                <span className={step >= 3 ? "text-[#D4AF37]" : ""}>3. Review</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-[#996515] to-[#FFD700] transition-all duration-500"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Glossy top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

            {/* STEP 1: Store Details */}
            {step === 1 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-light mb-2 text-white">Initialize Your Store</h2>
                <p className="text-[#A0AEC0] mb-8">Join India's Verified Gold Marketplace. Tell us about your jewelry business.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Store / Brand Name</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g. Glow Jewellers" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Contact Person</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Full Name" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Phone Number</label>
                      <input type="tel" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="+91" />
                    </div>
                  </div>
                  <button onClick={nextStep} className="w-full bg-gradient-to-r from-[#996515] to-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-lg mt-8 hover:brightness-110 transition-all">
                    Continue to Compliance →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Legal & Compliance */}
            {step === 2 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-light mb-2 text-white">Legal & Compliance</h2>
                <p className="text-[#A0AEC0] mb-8">We require strict verification to ensure 100% authentic HUID jewelry on the platform.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">GST Identification Number (GSTIN)</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-mono" placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">BIS Hallmark Registration No.</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-mono" placeholder="HM/C-1234567" />
                  </div>
                  
                  {/* Document Upload Mockup */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Upload GST Certificate (PDF/JPG)</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#D4AF37]/50 hover:bg-white/5 transition-colors cursor-pointer">
                      <svg className="w-8 h-8 text-[#A0AEC0] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <span className="text-sm font-semibold text-[#D4AF37]">Click to upload</span>
                      <span className="text-xs text-[#A0AEC0] block mt-1">or drag and drop</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={prevStep} className="px-8 py-4 border border-white/10 rounded-lg text-white hover:bg-white/5 font-bold uppercase tracking-widest transition-colors">
                      Back
                    </button>
                    <button onClick={nextStep} className="flex-1 bg-gradient-to-r from-[#996515] to-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:brightness-110 transition-all">
                      Review Application →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-light mb-2 text-white">Final Review</h2>
                <p className="text-[#A0AEC0] mb-8">Please confirm your details before submitting to the Super Admin.</p>
                
                <div className="bg-black/50 border border-white/5 rounded-xl p-6 mb-8 space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-[#A0AEC0]">Store Name</span>
                    <span className="font-bold">Glow Jewellers</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-[#A0AEC0]">GSTIN</span>
                    <span className="font-mono text-sm">22AAAAA0000A1Z5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0AEC0]">Documents</span>
                    <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Uploaded
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="px-8 py-4 border border-white/10 rounded-lg text-white hover:bg-white/5 font-bold uppercase tracking-widest transition-colors">
                    Edit
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#996515] to-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:brightness-110 transition-all">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in duration-500 py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#996515] rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                  <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-light mb-4 text-white">Application Received</h2>
                <p className="text-[#A0AEC0] mb-8 max-w-md mx-auto">
                  Your application has been sent securely to the Shyam Dash Ecosystem Admins. We will verify your documents and send you an approval email shortly.
                </p>
                <button onClick={() => window.location.href = '/'} className="px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg font-bold uppercase tracking-widest transition-colors">
                  Return to Gold Hub
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
