import React from "react";
import { Metadata } from "next";
import ClientPage from "./ClientPage";
import { parseFirestoreDocument } from "@/lib/firestore/restParser";

export const dynamic = 'force-dynamic';

async function fetchJobREST(jobId: string) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/sd-gold-hub/databases/(default)/documents/jobs/${jobId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFirestoreDocument(data);
  } catch (err) {
    return null;
  }
}

async function fetchAllJobsREST() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/sd-gold-hub/databases/(default)/documents/jobs`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents || []).map(parseFirestoreDocument);
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const job = await fetchJobREST(id);
    if (!job) {
      return { title: "Job Details | Gold Dunia" };
    }
    
    const title = `${job.title} | ${job.companyName || job.shopName || 'Gold Dunia'} | Jobs`;
    const description = job.description || job.requirements || `Apply for ${job.title} at ${job.location}`;

    let imageUrl = job.companyLogo || "https://golddunia.com/stock/jobs-hero-pc.png";
    if (imageUrl.startsWith("/")) imageUrl = `https://golddunia.com${imageUrl}`;

    const ogImage = {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: title
    };

    return {
      title,
      description,
      openGraph: { title, description, images: [ogImage] },
      twitter: { title, description, images: [imageUrl], card: "summary_large_image" }
    };
  } catch (e) {
    return { title: "Job Details | Gold Dunia" };
  }
}

export default async function JobServerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [job, allJobs] = await Promise.all([
    fetchJobREST(resolvedParams.id),
    fetchAllJobsREST()
  ]);
  
  const otherJobs = allJobs.filter((j: any) => j.id !== resolvedParams.id && j.status === 'Active');
  
  if (!job) {
    return (
      <main className="min-h-screen bg-[#060A14] flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-4xl text-red-500 font-serif mb-4">404 - Job Not Found</h1>
        <p className="text-gray-400">The job posting you are looking for has been removed or does not exist.</p>
      </main>
    );
  }

  return <ClientPage job={job} otherJobs={otherJobs} />;
}
