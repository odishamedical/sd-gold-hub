import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CustomerProfile } from '@/types/gold-hub';
import { jobsCollection, Job } from '@/lib/jobs';
import { addDoc, serverTimestamp } from 'firebase/firestore';

interface PostJobModalProps {
  onClose: () => void;
  profile: CustomerProfile;
  onSuccess: () => void;
}

export default function PostJobModal({ onClose, profile, onSuccess }: PostJobModalProps) {
  const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
  const [shopId, setShopId] = useState(isAdmin ? 'platform' : profile.id);
  
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<'Full-time'|'Part-time'|'Contract'>('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newJob: Omit<Job, 'id'> = {
        shopId,
        title,
        location,
        jobType,
        salaryRange,
        requirements,
        status: isAdmin ? 'Active' : 'Pending',
        createdAt: serverTimestamp() as any
      };
      await addDoc(jobsCollection, newJob);
      alert(isAdmin ? "Job posted successfully!" : "Job submitted! It will be public once approved by an Admin.");
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Error posting job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0A101C] border border-[#E3B061]/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-[#E3B061]">Post a New Job</h2>
            <p className="text-white/60 text-sm mt-1">
              {isAdmin 
                ? "Admin Mode: Your job will instantly become active."
                : "Vendor Mode: Your job will be published upon Admin approval."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdmin && (
              <div>
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Shop ID / Assignment</label>
                <input 
                  type="text" 
                  value={shopId} 
                  onChange={e => setShopId(e.target.value)} 
                  className="w-full bg-black/40 border border-[#E3B061]/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061]" 
                  placeholder="Use 'platform' for global" 
                  required
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Job Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061]" 
                  placeholder="e.g. Master Goldsmith" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061]" 
                  placeholder="e.g. Bhubaneswar, Odisha" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Job Type</label>
                <select 
                  value={jobType} 
                  onChange={e => setJobType(e.target.value as any)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061]"
                >
                  <option value="Full-time" className="bg-[#0A101C]">Full-time</option>
                  <option value="Part-time" className="bg-[#0A101C]">Part-time</option>
                  <option value="Contract" className="bg-[#0A101C]">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Salary Range</label>
                <input 
                  type="text" 
                  value={salaryRange} 
                  onChange={e => setSalaryRange(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061]" 
                  placeholder="e.g. ₹20,000 - ₹30,000" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#FDF8F5]/60 uppercase tracking-widest mb-2">Requirements & Description</label>
              <textarea 
                value={requirements} 
                onChange={e => setRequirements(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#E3B061] h-32 resize-none" 
                placeholder="Skills, responsibilities, and experience required..." 
                required
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Post Job Listing'}
              </button>
              
              <p className="text-center text-xs text-white/40">
                You can manage your candidates from the 
                <a href={isAdmin ? "/admin" : "/vendor"} className="text-[#E3B061] hover:underline ml-1">Dashboard</a>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
