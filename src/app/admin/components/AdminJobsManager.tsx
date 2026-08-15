import React, { useState, useEffect } from 'react';
import { jobsCollection, jobApplicationsCollection, jobSeekersCollection, Job, JobApplication, JobSeeker } from '@/lib/jobs';
import { getDocs, query, updateDoc, doc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Briefcase, Users, CheckCircle, XCircle, Search, Plus, Filter, Database, Send } from 'lucide-react';

export default function AdminJobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<(JobApplication & { seeker?: JobSeeker, jobTitle?: string })[]>([]);
  const [resumeDB, setResumeDB] = useState<JobSeeker[]>([]);
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'resumes'>('jobs');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // New Job State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<'Full-time'|'Part-time'|'Contract'>('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [qualification, setQualification] = useState('Any');
  const [vacancies, setVacancies] = useState('1');
  const [industry, setIndustry] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [assignedShopId, setAssignedShopId] = useState('platform'); // Default to platform-wide job
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all Jobs
      const jobsSnap = await getDocs(query(jobsCollection, orderBy("createdAt", "desc")));
      const allJobs = jobsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
      setJobs(allJobs);

      // 2. Fetch Global Resume DB
      const seekersSnap = await getDocs(jobSeekersCollection);
      const allSeekers = seekersSnap.docs.map(d => d.data() as JobSeeker).filter(s => s.fullName); // ensure it's a completed profile
      setResumeDB(allSeekers);

      // 3. Fetch all Applications
      const appsSnap = await getDocs(jobApplicationsCollection);
      const appsData = appsSnap.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication));
      
      const enrichedApps = appsData.map(app => {
        const seeker = allSeekers.find(s => s.uid === app.seekerId);
        const jobTitle = allJobs.find(j => j.id === app.jobId)?.title || 'Unknown Job';
        return { ...app, seeker, jobTitle };
      });
      setApplications(enrichedApps);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJobStatus = async (jobId: string, status: "Active" | "Closed" | "Pending") => {
    try {
      await updateDoc(doc(jobsCollection, jobId), { status });
      setJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status } : j));
    } catch(e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData: Partial<Job> = {
        shopId: assignedShopId,
        shopName,
        title,
        location,
        jobType,
        salaryRange,
        experience,
        qualification,
        vacancies: parseInt(vacancies) || 1,
        industry,
        deadline,
        description,
        status: "Active", // Admin created jobs are active by default
      };
      
      if (editingJobId) {
        await updateDoc(doc(jobsCollection, editingJobId), jobData);
        alert("Job updated successfully!");
      } else {
        jobData.createdAt = serverTimestamp() as any;
        await addDoc(jobsCollection, jobData as Omit<Job, 'id'>);
        alert("Job posting created successfully!");
      }
      
      setShowForm(false);
      setEditingJobId(null);
      setTitle('');
      setShopName('');
      setLocation('');
      setSalaryRange('');
      setExperience('Fresher');
      setQualification('Any');
      setVacancies('1');
      setIndustry('');
      setDeadline('');
      setDescription('');
      setAssignedShopId('platform');
      fetchData();
      alert("Job posting created successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading ATS Data...</div>;

  const handleShareWhatsApp = (includePhone: boolean) => {
    if (!selectedApp || !selectedApp.seeker) return;
    const { seeker, jobTitle } = selectedApp;
    
    let text = `*New Job Application*\n\n`;
    text += `*Candidate:* ${seeker.fullName}\n`;
    text += `*Position:* ${jobTitle}\n`;
    if (includePhone) {
      text += `*Phone:* ${seeker.phone}\n`;
      text += `*Email:* ${seeker.email}\n`;
    }
    text += `*Location:* ${seeker.block}, ${seeker.district}, ${seeker.state}\n`;
    text += `*Experience:* ${seeker.experienceYears} Years\n`;
    
    if (seeker.skills?.length > 0) {
      text += `*Top Skills:* ${seeker.skills.join(', ')}\n`;
    }
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'jobs' ? 'bg-[#060A14] text-[#E3B061]' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Briefcase className="w-5 h-5" /> Jobs Manager
          </button>
          <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'applications' ? 'bg-[#060A14] text-[#E3B061]' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users className="w-5 h-5" /> All Applications
          </button>
          <button onClick={() => setActiveTab('resumes')} className={`px-4 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'resumes' ? 'bg-[#060A14] text-[#E3B061]' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Database className="w-5 h-5" /> Global Resume DB
          </button>
        </div>
        
        {activeTab === 'jobs' && !showForm && (
          <button onClick={() => setShowForm(true)} className="bg-[#E3B061] text-[#060A14] hover:opacity-90 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Post Admin Job
          </button>
        )}
      </div>

      {/* Admin Job Creation / Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{editingJobId ? 'Edit Job' : 'Create Platform Job'}</h2>
          <form onSubmit={handleSaveJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Shop ID</label>
                <input required type="text" value={assignedShopId} onChange={e => setAssignedShopId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-blue-50" placeholder="Use 'platform' for generic" />
                <p className="text-xs text-gray-500 mt-1">If 'platform', it is a general job to collect CVs.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="e.g. Sales Executive" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name (Display)</label>
                <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="e.g. Gold Dunia Direct" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="e.g. Bhubaneswar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select value={jobType} onChange={e => setJobType(e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input type="text" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
                  <option value="Fresher">Fresher</option>
                  <option value="1-2 Years">1-2 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <select value={qualification} onChange={e => setQualification(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
                  <option value="Any">Any</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Specialized Diploma">Specialized Diploma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
                <input required type="number" min="1" value={vacancies} onChange={e => setVacancies(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
                <input required type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="e.g. Retail, Management" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24" placeholder="Detailed job description..."></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingJobId(null); }} className="px-6 py-2 border font-bold rounded-lg text-gray-600">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 font-bold rounded-lg text-white">{editingJobId ? 'Save Changes' : 'Create Active Job'}</button>
            </div>
          </form>
        </div>
      )}

      {/* JOBS TAB */}
      {activeTab === 'jobs' && !showForm && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Job Title</th>
                <th className="p-4">Shop ID</th>
                <th className="p-4">Applicants</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'Active' ? 'bg-green-100 text-green-700' : job.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">{job.title}</td>
                  <td className="p-4 font-mono text-xs">{job.shopId === 'platform' ? '✨ Platform' : job.shopId}</td>
                  <td className="p-4 font-bold">{applications.filter(a => a.jobId === job.id).length}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewingJob(job)}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 font-bold rounded hover:bg-blue-100"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => {
                          setAssignedShopId(job.shopId);
                          setTitle(job.title);
                          setShopName(job.shopName || '');
                          setLocation(job.location);
                          setJobType(job.jobType as any);
                          setSalaryRange(job.salaryRange || '');
                          setExperience(job.experience || 'Fresher');
                          setQualification(job.qualification || 'Any');
                          setVacancies(job.vacancies?.toString() || '1');
                          setIndustry(job.industry || '');
                          setDeadline(job.deadline || '');
                          setDescription(job.description);
                          setEditingJobId(job.id!);
                          setShowForm(true);
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 font-bold rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <select 
                        value={job.status}
                        onChange={e => handleUpdateJobStatus(job.id!, e.target.value as any)}
                        className="border rounded p-1 text-xs font-bold bg-white ml-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active (Approve)</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h2 className="font-bold text-lg mb-4 text-gray-800">All Job Applications (System-wide)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map(app => (
              <div key={app.id} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{app.seeker?.fullName}</h3>
                    <p className="text-xs text-blue-600 font-bold">Applied to: {app.jobTitle}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">Shop: {app.shopId}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {app.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex gap-4 mt-2">
                  <span>📞 {app.seeker?.phone}</span>
                  <span>⭐ {app.seeker?.experienceYears}y Exp</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                  <button onClick={() => setSelectedApp(app)} className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    View Full CV →
                  </button>
                </div>
              </div>
            ))}
            {applications.length === 0 && <p className="text-gray-500 col-span-2">No applications exist.</p>}
          </div>
        </div>
      )}

      {/* RESUME DB TAB */}
      {activeTab === 'resumes' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-800">Global Resume Database</h2>
            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{resumeDB.length} Candidates</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resumeDB.map(seeker => (
              <div key={seeker.uid} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {seeker.profileImage ? <img src={seeker.profileImage} className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{seeker.fullName}</h3>
                    <p className="text-sm text-gray-600">📍 {seeker.block}, {seeker.district}, {seeker.state}</p>
                    <p className="text-sm text-gray-600">📞 {seeker.phone}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white border border-gray-200 text-xs font-bold rounded text-gray-700">
                        {seeker.experienceYears} Years Exp
                      </span>
                      {seeker.expectedSalary && (
                        <span className="px-2 py-1 bg-green-50 border border-green-200 text-xs font-bold rounded text-green-700">
                          {seeker.expectedSalary} Expected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {seeker.skills && seeker.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {seeker.skills.map(s => <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">{s}</span>)}
                    </div>
                  </div>
                )}
                
                {/* Share Feature (Future implementation placeholder) */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                   <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                     <Send className="w-4 h-4" /> Forward to Shop
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="p-6 md:p-8">
              <div className="flex gap-4 items-start mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {selectedApp.seeker?.profileImage ? <img src={selectedApp.seeker.profileImage} className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-gray-400" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedApp.seeker?.fullName}</h2>
                  <p className="text-sm text-gray-500">Applied for: <span className="font-bold text-blue-600">{selectedApp.jobTitle}</span> at {selectedApp.shopId === 'platform' ? 'Gold Dunia Direct' : selectedApp.shopId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Contact</p>
                  <p className="text-sm text-gray-900">{selectedApp.seeker?.phone}</p>
                  <p className="text-sm text-gray-900 break-all">{selectedApp.seeker?.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Location</p>
                  <p className="text-sm text-gray-900">{selectedApp.seeker?.block}, {selectedApp.seeker?.district}</p>
                  <p className="text-sm text-gray-900">{selectedApp.seeker?.state}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Experience</p>
                  <p className="text-sm text-gray-900">{selectedApp.seeker?.experienceYears} Years</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Expected Salary</p>
                  <p className="text-sm text-gray-900">{selectedApp.seeker?.expectedSalary || 'N/A'}</p>
                </div>
              </div>
              
              {selectedApp.seeker?.skills?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.seeker.skills.map((s: string) => (
                      <span key={s} className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded border border-blue-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedApp.seeker?.education?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">Education</p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedApp.seeker.education.map((edu: any, i: number) => (
                      edu.degree && (
                        <div key={i} className="text-sm border-l-2 border-[#E3B061] pl-3">
                          <p className="font-bold text-gray-800">{edu.degree}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{edu.year} • {edu.percentage}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {selectedApp.seeker?.workHistory?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">Work History</p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedApp.seeker.workHistory.map((work: any, i: number) => (
                      work.employer && (
                        <div key={i} className="text-sm border-l-2 border-blue-400 pl-3">
                          <p className="font-bold text-gray-800">{work.position} at {work.employer}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{work.years}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-gray-100 gap-3 mt-8 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  Download PDF
                </button>
                <div className="relative group">
                  <button className="px-4 py-2 bg-[#25D366] text-white hover:bg-[#20b858] font-bold rounded-lg transition-colors flex items-center gap-2">
                    Share WhatsApp ▾
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button 
                      onClick={() => handleShareWhatsApp(true)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 border-b border-gray-100"
                    >
                      With Phone Number
                    </button>
                    <button 
                      onClick={() => handleShareWhatsApp(false)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700"
                    >
                      Without Phone Number
                    </button>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors">
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB DETAILS VIEW MODAL */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8">
            <button onClick={() => setViewingJob(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewingJob.title}</h2>
            <p className="text-gray-600 text-lg mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-400" /> 
              {viewingJob.shopName ? viewingJob.shopName : (viewingJob.shopId === 'platform' ? 'Gold Dunia Direct' : `Shop ID: ${viewingJob.shopId}`)}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Location</p>
                <p className="text-gray-900 font-bold text-sm">{viewingJob.location}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Salary</p>
                <p className="text-gray-900 font-bold text-sm">{viewingJob.salaryRange || 'Not disclosed'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Experience</p>
                <p className="text-gray-900 font-bold text-sm">{viewingJob.experience || 'Any'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Qualification</p>
                <p className="text-gray-900 font-bold text-sm">{viewingJob.qualification || 'Any'}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-gray-900 font-bold text-lg mb-3">Job Description</h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                {viewingJob.description || (viewingJob as any).requirements}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
