"use client";

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, IndianRupee, Clock, ChevronRight, CheckCircle2, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jobApplicationsCollection } from '@/lib/jobs';
import { useEffect } from 'react';
import PostJobModal from './components/PostJobModal';
import GlobalBannerSlot from '@/components/GlobalBannerSlot';
import { useCustomer } from '@/context/CustomerContext';
import PremiumPageHero from "@/components/PremiumPageHero";

// Fetch real jobs below

const CATEGORIES = ['All', 'Sales', 'Goldsmith', 'Management', 'Appraiser', 'Accountant'];

export default function JobsPage() {
  const router = useRouter();
  const { profile, loginDemo } = useCustomer();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [pendingJob, setPendingJob] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [viewingJob, setViewingJob] = useState<any | null>(null);
  const [hasSeekerProfile, setHasSeekerProfile] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('sd_current_user_role'));
    }
  }, []);

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

  const filteredJobs = jobs.filter(j => {
    if (activeCategory !== 'All' && j.industry !== activeCategory) return false;
    if (searchQuery) {
      const searchStr = searchQuery.toLowerCase();
      if (!j.title?.toLowerCase().includes(searchStr) && !j.shopName?.toLowerCase().includes(searchStr)) return false;
    }
    if (locationFilter !== 'All' && !j.location?.includes(locationFilter)) return false;
    if (jobTypeFilter !== 'All' && j.jobType !== jobTypeFilter) return false;
    if (experienceFilter !== 'All' && j.experience !== experienceFilter) return false;
    return true;
  });

  const locations = ['All', ...Array.from(new Set(jobs.map(j => j.location).filter(Boolean)))];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const experiences = ['All', 'Fresher', '1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'];

  return (
    <main className="min-h-screen bg-[#060A14] pb-20 relative overflow-hidden">
      {showPostModal && (
        <PostJobModal 
          onClose={() => setShowPostModal(false)} 
          profile={profile || { id: 'admin_impersonation', role: userRole || 'super_admin' }} 
          onSuccess={() => {
            // Re-fetch jobs if admin created active job
            if (profile?.role === 'admin' || profile?.role === 'super_admin' || userRole === 'super admin' || userRole === 'admin') {
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

      <PremiumPageHero 
        title="Gold Dunia Job Portal"
        imagePath="/stock/jobs-hero-pc.png"
        mobileImagePath="/stock/jobs-hero-phone.png"
        uppercaseTitle={false}
        imageAlignment="right"
        overlayStyle="text-side"
      >
        <p className="text-lg md:text-xl text-gray-300 font-light mb-6">
          Find the perfect career in the jewelry industry. Apply to top shops across India or create a Seeker Profile to let shops find you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
          <Link href="/jobs/profile" className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(227,176,97,0.3)] text-center">
            Create Seeker Profile
          </Link>
          {['vendor', 'store', 'admin', 'super_admin', 'super admin', 'pro', 'advance'].includes(userRole?.toLowerCase()?.replace(' ', '_') || profile?.role?.toLowerCase()?.replace(' ', '_') || '') && (
            <button 
              onClick={() => setShowPostModal(true)}
              className="bg-white/5 border border-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-center"
            >
              Post a Job
            </button>
          )}
        </div>
      </PremiumPageHero>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          
          {/* MOBILE FILTER TOGGLE */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FDF8F5]/40 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jobs..." 
                className="w-full bg-black/40 border border-[#C5A059]/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#FDF8F5]/40 focus:outline-none focus:border-[#E3B061] backdrop-blur-md"
              />
            </div>
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="bg-[#E3B061]/10 text-[#E3B061] border border-[#E3B061]/30 p-3 rounded-xl flex items-center gap-2 font-bold whitespace-nowrap"
            >
              <SlidersHorizontal className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* LEFT SIDEBAR (FILTERS) */}
          <div className={`fixed inset-0 z-50 lg:static lg:block lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 top-auto lg:static bg-[#0a0f1c] lg:bg-transparent rounded-t-3xl lg:rounded-none p-6 lg:p-0 h-[80vh] lg:h-auto overflow-y-auto lg:overflow-visible border-t lg:border-none border-white/10 transition-transform transform">
              
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-white/50 hover:text-white bg-white/5 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="hidden lg:block relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FDF8F5]/40 w-5 h-5" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by title or shop..." 
                    className="w-full bg-black/40 border border-[#C5A059]/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#FDF8F5]/40 focus:outline-none focus:border-[#E3B061] backdrop-blur-md transition-colors"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#E3B061] mb-3 uppercase tracking-wider">Category</h4>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left px-4 py-2 rounded-lg text-sm font-bold transition-all border ${activeCategory === cat ? 'bg-[#E3B061]/20 border-[#E3B061] text-[#E3B061]' : 'bg-white/5 border-transparent text-[#FDF8F5]/60 hover:bg-white/10 hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#E3B061] mb-3 uppercase tracking-wider">Location</h4>
                  <select 
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#E3B061]"
                  >
                    {locations.map(loc => <option key={loc} value={loc} className="bg-[#0a0f1c]">{loc}</option>)}
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#E3B061] mb-3 uppercase tracking-wider">Job Type</h4>
                  <div className="flex flex-col gap-2">
                    {jobTypes.map(jt => (
                      <label key={jt} className="flex items-center gap-3 cursor-pointer text-[#FDF8F5]/80 hover:text-white">
                        <input 
                          type="radio" 
                          name="jobType"
                          value={jt}
                          checked={jobTypeFilter === jt}
                          onChange={e => setJobTypeFilter(e.target.value)}
                          className="w-4 h-4 accent-[#E3B061]"
                        />
                        <span className="text-sm">{jt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#E3B061] mb-3 uppercase tracking-wider">Experience</h4>
                  <div className="flex flex-col gap-2">
                    {experiences.map(exp => (
                      <label key={exp} className="flex items-center gap-3 cursor-pointer text-[#FDF8F5]/80 hover:text-white">
                        <input 
                          type="radio" 
                          name="experience"
                          value={exp}
                          checked={experienceFilter === exp}
                          onChange={e => setExperienceFilter(e.target.value)}
                          className="w-4 h-4 accent-[#E3B061]"
                        />
                        <span className="text-sm">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 lg:hidden">
                  <button onClick={() => setShowMobileFilters(false)} className="w-full bg-[#E3B061] text-[#060A14] font-bold py-3 rounded-xl">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN JOB FEED */}
          <div className="lg:col-span-3 space-y-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Showing {filteredJobs.length} Jobs</h2>
            </div>
            
            <div className="mb-8">
              <GlobalBannerSlot placementId="global_feed" context={{ audience: 'global' }} glass />
            </div>

            {loadingJobs ? (
              <div className="text-center py-12 text-[#FDF8F5]/50 font-mono">Loading active jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
                <Briefcase className="w-16 h-16 text-[#FDF8F5]/20 mx-auto mb-4" />
                <p className="text-xl font-bold text-white mb-2">No jobs match your filters</p>
                <p className="text-[#FDF8F5]/50">Try adjusting your search or category filters.</p>
                <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); setLocationFilter('All'); setJobTypeFilter('All'); setExperienceFilter('All'); }} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : filteredJobs.map(job => (
              <div key={job.id} className="bg-gradient-to-br from-white/5 to-black/40 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#E3B061]/50 hover:shadow-[0_0_30px_rgba(227,176,97,0.1)] transition-all group backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E3B061]/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6 relative z-10">
                  <div className="flex items-start gap-5">
                    {job.companyLogo ? (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-black/80 shrink-0 border border-white/20 shadow-xl group-hover:shadow-[0_0_15px_rgba(227,176,97,0.3)] transition-shadow">
                        <img src={job.companyLogo} alt={job.shopName || job.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2235] to-black/80 shrink-0 border border-white/20 shadow-xl flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(227,176,97,0.3)] transition-shadow">
                        <Briefcase className="w-8 h-8 text-[#C58B39]" />
                      </div>
                    )}
                    <div className="pt-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#E3B061] transition-colors leading-tight mb-2">{job.title}</h3>
                      <p className="text-[#FDF8F5]/70 text-lg flex items-center gap-2">
                        {job.shopName ? job.shopName : (job.shopId === 'platform' ? 'Gold Dunia Direct' : `Shop ID: ${job.shopId}`)}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                    <span className="flex items-center gap-1.5 text-lg font-bold text-green-400 bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20">
                      <IndianRupee className="w-5 h-5" /> {job.salaryRange || 'Competitive'}
                    </span>
                    <span className="text-sm text-[#FDF8F5]/50 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {job.industry && <span className="bg-[#E3B061]/20 border border-[#E3B061]/30 text-[#E3B061] px-3 py-1.5 rounded-lg text-sm font-bold">{job.industry}</span>}
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg text-white text-sm font-bold">{job.jobType}</span>
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[#FDF8F5]/80 text-sm">Exp: {job.experience || 'Any'}</span>
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[#FDF8F5]/80 text-sm">Edu: {job.qualification || 'Any'}</span>
                  
                  {/* Mobile Salary/Location */}
                  <div className="md:hidden flex items-center gap-3 w-full mt-2">
                     <span className="flex items-center gap-1.5 text-sm font-bold text-green-400">
                      <IndianRupee className="w-4 h-4" /> {job.salaryRange || 'Competitive'}
                    </span>
                    <span className="text-sm text-[#FDF8F5]/50 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                  </div>
                </div>
                
                {(job.description || (job as any).requirements) && (
                  <div className="text-base text-[#FDF8F5]/70 line-clamp-2 leading-relaxed mb-6 border-l-2 border-[#E3B061]/30 pl-4">
                    {job.description || (job as any).requirements}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                  <span className="text-xs text-[#FDF8F5]/40 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> 
                    {job.createdAt ? new Date((job.createdAt as any).seconds * 1000).toLocaleDateString() : 'Recently'}
                  </span>
                  
                  <div className="flex gap-4">
                    <Link 
                      href={`/jobs/${job.id}`}
                      className="text-white hover:text-[#E3B061] text-sm font-bold transition-colors flex items-center gap-1"
                    >
                      Read More
                    </Link>
                    {appliedJobs.includes(job.id) ? (
                      <button disabled className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-not-allowed text-sm">
                        Applied <CheckCircle2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(job)}
                        disabled={applyingTo === job.id}
                        className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg text-sm"
                      >
                        {applyingTo === job.id ? 'Applying...' : 'Apply Now'} <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

      {/* JOB DETAILS MODAL */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0A101C] border border-[#E3B061]/20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setViewingJob(null)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <CheckCircle2 className="w-8 h-8 opacity-0" /> {/* Spacer */}
              <span className="text-xl">&times;</span>
            </button>
            
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-5 mb-6">
                {viewingJob.companyLogo ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 shrink-0 border border-white/10 shadow-[0_0_15px_rgba(227,176,97,0.1)]">
                    <img src={viewingJob.companyLogo} alt={viewingJob.shopName || viewingJob.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 shrink-0 border border-white/10 shadow-[0_0_15px_rgba(227,176,97,0.1)] flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-[#C58B39]" />
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-serif font-bold text-[#E3B061] mb-2">{viewingJob.title}</h2>
                  <p className="text-white/80 text-lg flex items-center gap-2">
                    {viewingJob.shopName ? viewingJob.shopName : (viewingJob.shopId === 'platform' ? 'Gold Dunia Direct' : `Shop ID: ${viewingJob.shopId}`)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1">Location</p>
                  <p className="text-white font-medium text-sm">{viewingJob.location}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1">Salary</p>
                  <p className="text-white font-medium text-sm">{viewingJob.salaryRange || 'Not disclosed'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1">Experience</p>
                  <p className="text-white font-medium text-sm">{viewingJob.experience || 'Any'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-[#FDF8F5]/40 text-xs font-mono uppercase mb-1">Qualification</p>
                  <p className="text-white font-medium text-sm">{viewingJob.qualification || 'Any'}</p>
                </div>
              </div>

              {(viewingJob.description || viewingJob.requirements) && (
                <div className="mb-8">
                  <h3 className="text-[#E3B061] font-bold text-lg mb-3">Job Description</h3>
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-sm">
                    {viewingJob.description || viewingJob.requirements}
                  </div>
                </div>
              )}

              {viewingJob.keyResponsibilities && (
                <div className="mb-8">
                  <h3 className="text-[#E3B061] font-bold text-lg mb-3">Key Responsibilities</h3>
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-sm">
                    {viewingJob.keyResponsibilities}
                  </div>
                </div>
              )}

              {viewingJob.benefits && viewingJob.benefits.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[#E3B061] font-bold text-lg mb-3">Benefits Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingJob.benefits.map((b: string) => (
                      <span key={b} className="bg-[#25D366]/10 text-[#25D366] px-3 py-1.5 rounded-lg text-sm font-bold border border-[#25D366]/20">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingJob.workSchedule && (
                <div className="mb-8">
                  <h3 className="text-[#E3B061] font-bold text-lg mb-3">Work Schedule</h3>
                  <p className="text-white/80 text-sm font-medium">{viewingJob.workSchedule}</p>
                </div>
              )}

              {viewingJob.additionalNotes && (
                <div className="mb-8">
                  <h3 className="text-[#E3B061] font-bold text-lg mb-3">Additional Notes</h3>
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-sm italic border-l-2 border-[#E3B061]/30 pl-4 py-1">
                    {viewingJob.additionalNotes}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-white/10">
                {appliedJobs.includes(viewingJob.id) ? (
                  <button disabled className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold px-8 py-3 rounded-xl flex items-center gap-2 cursor-not-allowed">
                    Applied <CheckCircle2 className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setViewingJob(null);
                      handleApply(viewingJob);
                    }}
                    className="bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(227,176,97,0.3)] hover:shadow-[0_0_30px_rgba(227,176,97,0.5)]"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
