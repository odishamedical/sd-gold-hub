"use client";

import React, { useState } from 'react';
import { User, Briefcase, FileText, ChevronRight, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCustomer } from '@/context/CustomerContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { jobSeekersCollection, JobSeeker } from '@/lib/jobs';
import { useEffect } from 'react';

export default function SeekerProfilePage() {
  const { profile, loginDemo } = useCustomer();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    skills: [] as string[],
    experienceYears: 0,
    expectedSalary: '',
  });

  const SKILL_OPTIONS = ['Sales Executive', 'Goldsmith', 'Showroom Manager', 'Accountant', 'Appraiser', 'Marketing', 'Security'];

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  useEffect(() => {
    if (profile && !formData.email) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || profile.whatsapp || ''
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    
    try {
      let resumePdfUrl = '';
      if (resumeFile) {
        const storageRef = ref(storage, `resumes/${profile.id}/${resumeFile.name}`);
        await uploadBytes(storageRef, resumeFile);
        resumePdfUrl = await getDownloadURL(storageRef);
      }

      const seekerData: JobSeeker = {
        uid: profile.id,
        ...formData,
        resumePdf: resumePdfUrl,
        profileImage: '',
        education: [],
        workHistory: [],
        isLookingForJob: true
      };

      await setDoc(doc(jobSeekersCollection, profile.id), seekerData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#060A14] pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-6 font-bold tracking-wide">Login Required</h1>
        <p className="text-[#FDF8F5]/60 mb-8 max-w-md">You must be logged in to create a Job Seeker profile and apply to top jewelry shops.</p>
        <button onClick={loginDemo} className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(227,176,97,0.3)] hover:opacity-90 transition-all">
          Login via Google
        </button>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#060A14] pt-32 pb-20 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#25D366]/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-md w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[24px] border border-[#25D366]/30 rounded-[2rem] p-10 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_40px_rgba(37,211,102,0.1)]">
          <div className="w-20 h-20 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_10px_rgba(37,211,102,0.5)]">
            <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">Profile Created!</h2>
          <p className="text-[#FDF8F5]/60 mb-8">Your Seeker Profile is now live. Shop owners in your city can now find you and contact you for opportunities.</p>
          <Link href="/jobs" className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-all inline-block w-full">
            Back to Job Board
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060A14] pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E3B061]/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C58B39]/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide font-bold text-white mb-4">
            Build Your Profile
          </h1>
          <p className="text-[#FDF8F5]/60">Complete your profile to let top jewelry shops find you.</p>
        </div>

        {/* STEPPER */}
        <div className="flex items-center justify-center mb-12 max-w-sm mx-auto">
          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#E3B061]' : 'text-[#FDF8F5]/30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-[#E3B061] bg-[#E3B061]/10' : 'border-[#FDF8F5]/30 bg-transparent'}`}>
              1
            </div>
            <span className="text-xs uppercase tracking-widest font-mono">Basics</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step >= 2 ? 'bg-[#E3B061]' : 'bg-[#FDF8F5]/20'}`} />
          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#E3B061]' : 'text-[#FDF8F5]/30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-[#E3B061] bg-[#E3B061]/10' : 'border-[#FDF8F5]/30 bg-transparent'}`}>
              2
            </div>
            <span className="text-xs uppercase tracking-widest font-mono">Career</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[24px] border border-white/20 border-b-white/5 border-r-white/5 rounded-[2rem] p-6 md:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <User className="w-5 h-5 text-[#E3B061]" />
                <h2 className="text-xl font-bold text-white">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Phone Number</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="WhatsApp preferred" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">City</label>
                  <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="e.g. Mumbai" />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">State</label>
                    <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="e.g. Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Pincode</label>
                    <input type="text" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="e.g. 400001" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="button" onClick={handleNext} disabled={!formData.fullName || !formData.phone || !formData.city || !formData.pincode} className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Briefcase className="w-5 h-5 text-[#E3B061]" />
                <h2 className="text-xl font-bold text-white">Professional Profile</h2>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-3">Your Skills (Select all that apply)</label>
                <div className="flex flex-wrap gap-3">
                  {SKILL_OPTIONS.map(skill => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button 
                        key={skill} type="button" onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSelected ? 'bg-[#E3B061]/20 border-[#E3B061] text-[#E3B061]' : 'bg-black/40 border-white/10 text-[#FDF8F5]/60 hover:border-white/30'}`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Years of Experience</label>
                  <input type="number" required value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" min="0" max="50" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Expected Salary (Monthly)</label>
                  <input type="text" value={formData.expectedSalary} onChange={e => setFormData({...formData, expectedSalary: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] transition-colors" placeholder="e.g. ₹25,000" />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Upload Resume (PDF only)</label>
                <div className="w-full border-2 border-dashed border-white/10 hover:border-[#E3B061]/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-black/20 relative">
                  <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-8 h-8 text-[#FDF8F5]/40 mb-3" />
                  <p className="text-sm text-white font-bold mb-1">{resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}</p>
                  <p className="text-xs text-[#FDF8F5]/50">PDF (MAX. 5MB)</p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={handleBack} className="bg-white/5 border border-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" disabled={isSubmitting || formData.skills.length === 0} className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(227,176,97,0.3)]">
                  {isSubmitting ? 'Creating Profile...' : 'Complete Profile'} <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
