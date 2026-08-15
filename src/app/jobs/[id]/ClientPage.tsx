"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Briefcase, MapPin, IndianRupee, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { useCustomer } from '@/context/CustomerContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jobApplicationsCollection } from '@/lib/jobs';

export default function ClientPage({ job }: { job: any }) {
  const router = useRouter();
  const { profile } = useCustomer();
  const [hasSeekerProfile, setHasSeekerProfile] = useState<boolean | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [pendingJob, setPendingJob] = useState<any | null>(null);

  useEffect(() => {
    if (profile) {
      getDoc(doc(db, 'job_seekers', profile.id)).then(docSnap => {
        setHasSeekerProfile(docSnap.exists());
      });
    } else {
      setHasSeekerProfile(null);
    }
  }, [profile]);

  const handleApply = async () => {
    if (!profile) {
      const redirectUri = typeof window !== "undefined" ? window.location.href : "";
      const authCenterUrl = process.env.NEXT_PUBLIC_AUTH_CENTER_URL || "http://localhost:3000";
      window.location.href = `${authCenterUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
      return;
    }
    if (hasSeekerProfile === false) {
      router.push('/jobs/profile');
      return;
    }
    if (hasSeekerProfile === true) {
      setPendingJob(job);
    }
  };

  const confirmApply = async () => {
    if (!pendingJob || !profile) return;
    setApplyingTo(pendingJob.id);
    try {
      const applicationId = `${pendingJob.id}_${profile.id}`;
      await setDoc(doc(jobApplicationsCollection, applicationId), {
        jobId: pendingJob.id,
        shopId: pendingJob.shopName || pendingJob.shopId,
        seekerId: profile.id,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      setAppliedJobs(prev => [...prev, pendingJob.id]);
    } catch (err) {
      alert("Failed to apply. Please try again.");
    } finally {
      setApplyingTo(null);
      setPendingJob(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#060A14] font-sans text-white pb-32 animate-in fade-in duration-500 overflow-hidden relative">
      {/* Ambient Stardust Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full flex flex-col">
        {/* Breadcrumb Bar */}
        <div className="w-full border-b border-[#2A344A] bg-[#0A1021]/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
             <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: job.title }]} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 lg:py-12">
          
          <div className="bg-[#0A101C] border border-[#E3B061]/20 rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="flex items-start gap-5 mb-8">
              {job.companyLogo ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/60 shrink-0 border border-white/10 shadow-[0_0_15px_rgba(227,176,97,0.1)]">
                  <img src={job.companyLogo} alt={job.shopName || job.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/60 shrink-0 border border-white/10 shadow-[0_0_15px_rgba(227,176,97,0.1)] flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-[#C58B39]" />
                </div>
              )}
              <div className="pt-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#E3B061] mb-2 leading-tight">{job.title}</h1>
                <p className="text-white/80 text-xl flex items-center gap-2">
                  {job.shopName ? job.shopName : (job.shopId === 'platform' ? 'Gold Dunia Direct' : `Shop ID: ${job.shopId}`)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</p>
                <p className="text-white font-medium text-sm md:text-base">{job.location}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1 flex items-center gap-1.5"><IndianRupee className="w-3 h-3" /> Salary</p>
                <p className="text-green-400 font-bold text-sm md:text-base">{job.salaryRange || 'Not disclosed'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1">Experience</p>
                <p className="text-white font-medium text-sm md:text-base">{job.experience || 'Any'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1">Qualification</p>
                <p className="text-white font-medium text-sm md:text-base">{job.qualification || 'Any'}</p>
              </div>
            </div>

            {(job.description || job.requirements) && (
              <div className="mb-10">
                <h3 className="text-[#E3B061] font-bold text-xl mb-4">Job Description</h3>
                <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-base">
                  {job.description || job.requirements}
                </div>
              </div>
            )}

            {job.keyResponsibilities && (
              <div className="mb-10">
                <h3 className="text-[#E3B061] font-bold text-xl mb-4">Key Responsibilities</h3>
                <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-base">
                  {job.keyResponsibilities}
                </div>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-10">
                <h3 className="text-[#E3B061] font-bold text-xl mb-4">Benefits Offered</h3>
                <div className="flex flex-wrap gap-3">
                  {job.benefits.map((b: string) => (
                    <span key={b} className="bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded-xl text-sm font-bold border border-[#25D366]/20 shadow-sm">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.workSchedule && (
              <div className="mb-10">
                <h3 className="text-[#E3B061] font-bold text-xl mb-4">Work Schedule</h3>
                <p className="text-white/80 text-base font-medium bg-white/5 inline-block px-4 py-2 rounded-lg border border-white/10">{job.workSchedule}</p>
              </div>
            )}

            {job.additionalNotes && (
              <div className="mb-10">
                <h3 className="text-[#E3B061] font-bold text-xl mb-4">Additional Notes</h3>
                <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-base italic border-l-4 border-[#E3B061]/30 pl-5 py-2">
                  {job.additionalNotes}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 mt-12">
              <span className="text-sm text-[#FDF8F5]/40 flex items-center gap-2 mb-4 sm:mb-0">
                <Clock className="w-4 h-4" /> 
                Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
              </span>

              {appliedJobs.includes(job.id) ? (
                <button disabled className="w-full sm:w-auto bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-lg">
                  Applied <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleApply}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-extrabold px-10 py-4 rounded-xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(227,176,97,0.3)] hover:shadow-[0_0_40px_rgba(227,176,97,0.5)] text-lg"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* CV CONFIRMATION MODAL */}
      {pendingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A101C] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Apply to {pendingJob.title}</h3>
            <p className="text-[#FDF8F5]/70 mb-8">
              Do you want to submit your saved Gold Dunia CV for this application, or would you like to update your details first?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmApply}
                disabled={applyingTo === pendingJob.id}
                className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-center disabled:opacity-50"
              >
                {applyingTo === pendingJob.id ? 'Submitting...' : 'Submit Saved CV'}
              </button>
              <Link 
                href="/jobs/profile"
                className="bg-white/5 border border-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Update CV First
              </Link>
              <button 
                onClick={() => setPendingJob(null)}
                className="mt-2 text-sm text-[#FDF8F5]/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
