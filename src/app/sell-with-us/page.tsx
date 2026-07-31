"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { INDIAN_STATES, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';

export default function SellWithUsWizard() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    country: "India",
    state: "Odisha",
    district: "",
    block: "",
    localAddress: "",
    pincode: "",
    personalName: "",
    phone: "",
    whatsapp: "",
    gstin: "",
    bisNumber: ""
  });

  const nextStep = () => {
    if (step === 1) {
      if (!formData.shopName || !formData.country || !formData.state || !formData.district || !formData.block || !formData.personalName || !formData.phone || !formData.whatsapp) {
        alert("Please fill out all required store details to continue.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => setStep(prev => prev - 1);

  const handleAuthAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let currentUser = user;
    
    if (!currentUser) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
      } catch (err) {
        console.error("Login failed", err);
        alert("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }
    }
    
    try {
      // 1. Update User Document
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          role: "shop",
          applicationStatus: "pending",
          personalName: formData.personalName,
          phone: formData.phone,
          whatsapp: formData.whatsapp
        });
      } else {
        await setDoc(userRef, {
          name: currentUser.displayName || formData.personalName,
          email: currentUser.email,
          role: "shop",
          applicationStatus: "pending",
          personalName: formData.personalName,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          createdAt: new Date()
        });
      }

      // 2. Create Shop Document
      const shopRef = doc(db, "shops", currentUser.uid);
      
      const fullAddress = `${formData.localAddress ? formData.localAddress + ', ' : ''}${formData.block}, ${formData.district}, ${formData.state}, ${formData.country} - ${formData.pincode}`;

      const shopData = {
        shopName: formData.shopName,
        address: fullAddress,
        country: formData.country,
        state: formData.state,
        district: formData.district,
        block: formData.block,
        localAddress: formData.localAddress,
        pincode: formData.pincode,
        ownerName: formData.personalName,
        contactPhone: formData.phone,
        whatsappNumber: formData.whatsapp,
        gstin: formData.gstin,
        bisNumber: formData.bisNumber,
        ownerUid: currentUser.uid,
        status: "pending_admin_approval",
        createdAt: new Date()
      };
      
      await setDoc(shopRef, shopData, { merge: true });

      setStep(4);
    } catch (err) {
      console.error("Claim Failed:", err);
      alert("Failed to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Header */}
      <header className="h-20 border-b border-[#D4AF37]/20 flex items-center px-8 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
          <Image src="/sd_logo_final.png" alt="SD Gold Hub" width={40} height={40} className="object-contain" />
          <div className="flex flex-col">
            <h1 className="text-xl font-light tracking-widest uppercase">
              Gold <span className="font-bold text-[#D4AF37]">Dunia</span>
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
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Store / Brand Name *</label>
                    <input type="text" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g. Glow Jewellers" required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Country *</label>
                      <select required value={formData.country === 'India' ? 'India' : (formData.country ? 'Other' : '')} onChange={e => setFormData({...formData, country: e.target.value === 'Other' ? '' : e.target.value, state: '', district: '', block: ''})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                        <option value="India" className="bg-[#0A101C]">India</option>
                        <option value="Other" className="bg-[#0A101C]">Other</option>
                      </select>
                      {formData.country !== 'India' && (
                        <input type="text" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors mt-2" placeholder="Enter Country" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">State / Province *</label>
                      {formData.country === 'India' ? (
                        <select required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value, district: '', block: ''})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                          <option value="" className="bg-[#0A101C]">Select State</option>
                          {INDIAN_STATES.map(st => <option key={st} value={st} className="bg-[#0A101C]">{st}</option>)}
                        </select>
                      ) : (
                        <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Enter State" />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">District *</label>
                      {(formData.country === 'India' && formData.state === 'Odisha') ? (
                        <select required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value, block: ''})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                          <option value="" className="bg-[#0A101C]">Select District</option>
                          {Object.keys(ODISHA_DISTRICT_BLOCKS).map(dst => <option key={dst} value={dst} className="bg-[#0A101C]">{dst}</option>)}
                        </select>
                      ) : (
                        <input type="text" required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g. Pune" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">City / Block *</label>
                      {(formData.country === 'India' && formData.state === 'Odisha' && formData.district) ? (
                        <select required value={formData.block} onChange={e => setFormData({...formData, block: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                          <option value="" className="bg-[#0A101C]">Select Block</option>
                          {(ODISHA_DISTRICT_BLOCKS as any)[formData.district]?.map((b: string) => <option key={b} value={b} className="bg-[#0A101C]">{b}</option>)}
                        </select>
                      ) : (
                        <input type="text" required value={formData.block} onChange={e => setFormData({...formData, block: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g. Bhubaneswar" />
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Local Address (Optional)</label>
                      <input type="text" value={formData.localAddress} onChange={e => setFormData({...formData, localAddress: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Street, Building, Landmark" />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Pincode (Optional)</label>
                      <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g. 751001" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Owner / Contact Person *</label>
                    <input type="text" value={formData.personalName} onChange={e => setFormData({...formData, personalName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Full Name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">Mobile Number *</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="+91" required />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">WhatsApp Number *</label>
                      <input type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="+91" required />
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
                <p className="text-[#A0AEC0] mb-8">Optional fields to ensure 100% authentic HUID jewelry on the platform.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">GST Identification Number (Optional)</label>
                    <input type="text" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-mono" placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A0AEC0] font-semibold mb-2">BIS Hallmark Registration No. (Optional)</label>
                    <input type="text" value={formData.bisNumber} onChange={e => setFormData({...formData, bisNumber: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-mono" placeholder="HM/C-1234567" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm text-[#D4AF37]">
                    * Document uploads (PDF/JPG) will be requested via WhatsApp or Admin Portal during the manual verification process.
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
                    <span className="font-bold">{formData.shopName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-[#A0AEC0]">Owner</span>
                    <span className="font-bold">{formData.personalName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-[#A0AEC0]">WhatsApp</span>
                    <span className="font-bold text-[#D4AF37]">{formData.whatsapp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0AEC0]">GSTIN</span>
                    <span className="font-mono text-sm">{formData.gstin || "Not Provided"}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="px-8 py-4 border border-white/10 rounded-lg text-white hover:bg-white/5 font-bold uppercase tracking-widest transition-colors">
                    Edit
                  </button>
                  <button onClick={handleAuthAndSubmit} disabled={loading} className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#996515] to-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:brightness-110 transition-all">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      user ? "Submit Application" : "Sign in with Google to Submit"
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
                  Your application is securely recorded and is currently <strong>Pending Admin Approval</strong>. <br/><br/>
                  An administrator will call you at <strong>{formData.phone}</strong> shortly to verify your documents and identity.
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
