"use client";

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, IndianRupee, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jobApplicationsCollection } from '@/lib/jobs';
import { useEffect } from 'react';
import PostJobModal from './components/PostJobModal';
import { useCustomer } from '@/context/CustomerContext';

// Fetch real jobs below

const CATEGORIES = ['All', 'Sales', 'Goldsmith', 'Management', 'Appraiser', 'Accountant'];

export default function JobsPage() {
  const router = useRouter();
  const { profile, loginDemo } = useCustomer();
  const [activeCategory, setActiveCategory] = useState('All');
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [pendingJob, setPendingJob] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [hasSeekerProfile, setHasSeekerProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (profile) {
      getDoc(doc(db, 'job_seekers', profile.id)).then(docSnap => {
        setHasSeekerProfile(docSnap.exists());
      });
    } else {
      setHasSeekerProfile(null);
    }
  }, [profile]);

  useEffect(() => {
    import('firebase/firestore').then(({ getDocs, query, where, orderBy }) => {
      import('@/lib/jobs').then(({ jobsCollection }) => {
        const q = query(jobsCollection, where("status", "==", "Active"));
        getDocs(q).then(snap => {
          const fetchedJobs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setJobs(fetchedJobs);
          setLoadingJobs(false);
        }).catch(e => {
          console.error(e);
          setLoadingJobs(false);
        });
      });
    });
  }, []);

  const handleApply = async (job: any) => {
    if (!profile) {
      loginDemo();
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
        shopId: pendingJob.shopName,
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

  const filteredJobs = jobs;

  return (
    <main className="min-h-screen bg-[#060A14] pt-24 pb-20 relative overflow-hidden">
      {showPostModal && profile && (
        <PostJobModal 
          onClose={() => setShowPostModal(false)} 
          profile={profile} 
          onSuccess={() => {
            // Re-fetch jobs if admin created active job
            if (profile.role === 'admin' || profile.role === 'super_admin') {
              window.location.reload();
            }
          }}
        />
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E3B061]/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C58B39]/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif tracking-wide font-bold bg-gradient-to-r from-[#FDF8F5] via-[#E3B061] to-[#C58B39] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(227,176,97,0.2)] mb-4">
            Gold Dunia Job Portal
          </h1>
          <p className="text-lg text-[#FDF8F5]/60 max-w-2xl mx-auto">
            Find the perfect career in the jewelry industry. Apply to top shops across India or create a Seeker Profile to let shops find you.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/jobs/profile" className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(227,176,97,0.3)]">
              Create Seeker Profile
            </Link>
            <button 
              onClick={() => {
                if (!profile) {
                  alert("Looking to hire? Register your shop first!");
                  router.push('/sell-with-us');
                  return;
                }
                if (profile.role === 'vendor' || profile.role === 'admin' || profile.role === 'super_admin') {
                  setShowPostModal(true);
                } else {
                  alert("Looking to hire? Register your shop first!");
                  router.push('/sell-with-us');
                }
              }}
              className="bg-white/5 border border-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
            >
              Post a Job (Vendors)
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FDF8F5]/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for jobs by title, skill, or shop..." 
              className="w-full bg-black/40 border border-[#C5A059]/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-[#FDF8F5]/40 focus:outline-none focus:border-[#E3B061] backdrop-blur-md transition-colors"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === cat ? 'bg-[#E3B061]/20 border-[#E3B061] text-[#E3B061]' : 'bg-white/5 border-white/10 text-[#FDF8F5]/60 hover:bg-white/10 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* JOB LISTINGS */}
        <div className="space-y-4">
          {loadingJobs ? (
            <div className="text-center py-12 text-[#FDF8F5]/50 font-mono">Loading active jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-[#FDF8F5]/50 font-mono">No active jobs found.</div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-[#E3B061]/30 transition-all group backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#E3B061] transition-colors">{job.title}</h3>
                  <p className="text-[#FDF8F5]/60 mt-1 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#C58B39]" /> {job.shopId === 'platform' ? 'Platform / Direct Hire' : `Shop ID: ${job.shopId}`}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#FDF8F5]/60 font-mono">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C58B39]" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-[#C58B39]" /> {job.salaryRange || 'Not disclosed'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="bg-white/10 px-2 py-1 rounded text-white text-xs">{job.jobType}</span>
                <span className="text-xs text-[#FDF8F5]/40 italic flex items-center gap-1"><Clock className="w-3 h-3 text-[#E3B061]" /> {job.createdAt ? new Date((job.createdAt as any).seconds * 1000).toLocaleDateString() : 'Recently'}</span>
                {appliedJobs.includes(job.id) ? (
                  <button disabled className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold px-4 py-2 rounded-lg flex items-center gap-2 ml-auto cursor-not-allowed">
                    Applied <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApply(job)}
                    disabled={applyingTo === job.id}
                    className="bg-[#E3B061] text-[#060A14] font-bold px-4 py-2 rounded-lg hover:bg-[#FDF8F5] transition-colors flex items-center gap-2 ml-auto disabled:opacity-50"
                  >
                    {applyingTo === job.id ? 'Applying...' : 'Apply Now'} <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-[#FDF8F5]/50 italic">
              No jobs found in this category.
            </div>
          )}
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
