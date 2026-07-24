import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";

export type JobType = "Full-time" | "Part-time" | "Contract";
export type JobStatus = "Active" | "Closed";

export interface Job {
  id?: string;
  shopId: string;
  title: string;
  location: string;
  jobType: JobType;
  salaryRange?: string;
  requirements: string;
  status: JobStatus;
  createdAt: Timestamp | Date;
}

export interface JobSeeker {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  profileImage?: string;
  city: string;
  state: string;
  pincode: string;
  skills: string[];
  experienceYears: number;
  expectedSalary?: string;
  resumePdf?: string;
  education: { degree: string; institution: string; year: string }[];
  workHistory: { shopName: string; role: string; duration: string }[];
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

// Helper collections references
export const jobsCollection = collection(db, "jobs");
export const jobSeekersCollection = collection(db, "job_seekers");
export const jobApplicationsCollection = collection(db, "job_applications");
