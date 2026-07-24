"use client";

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, IndianRupee, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/context/CustomerContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jobApplicationsCollection } from '@/lib/jobs';
import { useEffect } from 'react';

const MOCK_JOBS = [
  { id: '1', title: 'Senior Sales Executive', shopName: 'Kalyan Jewellers', location: 'Mumbai, Maharashtra', type: 'Full-time', salary: '₹25,000 - ₹35,000', posted: '2 days ago', category: 'Sales' },
  { id: '2', title: 'Master Goldsmith', shopName: 'Odisha Gold Palace', location: 'Bhubaneswar, Odisha', type: 'Full-time', salary: '₹40,000 - ₹50,000', posted: '1 week ago', category: 'Goldsmith' },
  { id: '3', title: 'Showroom Manager', shopName: 'Malabar Gold', location: 'Chennai, Tamil Nadu', type: 'Full-time', salary: '₹45,000 - ₹60,000', posted: '3 days ago', category: 'Management' },
  { id: '4', title: 'Jewelry Appraiser', shopName: 'Reliance Jewels', location: 'Delhi', type: 'Part-time', salary: '₹20,000 - ₹25,000', posted: '5 hours ago', category: 'Appraiser' },
  { id: '5', title: 'Accountant', shopName: 'Tanishq', location: 'Kolkata, West Bengal', type: 'Full-time', salary: '₹30,000 - ₹40,000', posted: '1 day ago', category: 'Accountant' },
];

const CATEGORIES = ['All', 'Sales', 'Goldsmith', 'Management', 'Appraiser', 'Accountant'];

export default function JobsPage() {
  const router = useRouter();
  const { profile, loginDemo } = useCustomer();
  const [activeCategory, setActiveCategory] = useState('All');
  const [hasSeekerProfile, setHasSeekerProfile] = useState<boolean | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      getDoc(doc(db, 'job_seekers', profile.id)).then(docSnap => {
        setHasSeekerProfile(docSnap.exists());
      });
    } else {
      setHasSeekerProfile(null);
    }
  }, [profile]);

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
      setApplyingTo(job.id);
      try {
        const applicationId = `${job.id}_${profile.id}`;
        await setDoc(doc(jobApplicationsCollection, applicationId), {
          jobId: job.id,
          shopId: job.shopName, // Using shopName as fallback ID for mock jobs
          seekerId: profile.id,
          status: 'Pending',
          createdAt: serverTimestamp()
        });
        setAppliedJobs(prev => [...prev, job.id]);
      } catch (err) {
        alert("Failed to apply. Please try again.");
      } finally {
        setApplyingTo(null);
      }
    }
  };

  const filteredJobs = activeCategory === 'All' 
    ? MOCK_JOBS 
    : MOCK_JOBS.filter(job => job.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#060A14] pt-24 pb-20 relative overflow-hidden">
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
            <button className="bg-white/5 border border-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
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
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[24px] border border-white/20 border-b-white/5 border-r-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-white/10 transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#FDF8F5] group-hover:text-[#E3B061] transition-colors mb-2">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#FDF8F5]/60 font-mono">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#C58B39]" /> {job.shopName}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C58B39]" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-[#C58B39]" /> {job.salary}</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-white text-xs">{job.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                <span className="text-xs text-[#FDF8F5]/40 italic">{job.posted}</span>
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
    </main>
  );
}
