import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";

export type JobType = "Full-time" | "Part-time" | "Contract";
export type JobStatus = "Pending" | "Active" | "Closed";

export interface Job {
  id?: string;
  shopId: string;
  shopName?: string;
  
  // Extended Company Details (Optional for backwards compatibility)
  companyLogo?: string;
  industry?: string;
  companyWebsite?: string;
  companyAddress?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  
  title: string;
  location: string;
  jobType: JobType;
  salaryRange?: string;
  experience: string;
  qualification: string;
  skillsRequired?: string[];
  vacancies: number;
  deadline?: string;

  description: string;
  
  // Extended Description (Optional)
  keyResponsibilities?: string;
  benefits?: string[];
  workSchedule?: string;
  additionalNotes?: string;
  
  status: JobStatus;
  isDraft?: boolean;
  createdAt: Timestamp | Date;
}

export interface JobSeeker {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  profileImage?: string;
  country: string;
  state: string;
  district: string;
  block: string;
  localAddress: string;
  pincode: string;
  skills: string[];
  experienceYears: number;
  expectedSalary?: string;
  education: { degree: string; year: string; percentage: string }[];
  workHistory: { employer: string; years: string; position: string }[];
  isLookingForJob: boolean;
}

export interface JobApplication {
  id?: string;
  jobId: string;
  shopId: string;
  seekerId: string;
  status: "Pending" | "Shortlisted" | "Rejected";
  createdAt: Timestamp | Date;
}

export interface SharedCandidate {
  id?: string;
  shopId: string;
  seekerId: string;
  sharedByAdmin: string;
  status: "Reviewing" | "Contacted" | "Hired" | "Rejected";
  createdAt: Timestamp | Date;
}

// Helper collections references
export const jobsCollection = collection(db, "jobs");
export const jobSeekersCollection = collection(db, "job_seekers");
export const jobApplicationsCollection = collection(db, "job_applications");
export const sharedCandidatesCollection = collection(db, "shared_candidates");

// SEO Slug Helpers
export const generateJobSlug = (job: Job | any): string => {
  const titleSlug = (job.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const locationSlug = (job.location || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `${titleSlug}${locationSlug ? `-${locationSlug}` : ''}-${job.id}`;
};

export const extractJobIdFromSlug = (slug: string): string => {
  if (!slug) return '';
  const parts = slug.split('-');
  return parts[parts.length - 1];
};
