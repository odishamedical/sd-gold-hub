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

    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description }
    };
  } catch (e) {
    return { title: "Job Details | Gold Dunia" };
  }
}

export default async function JobServerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await fetchJobREST(resolvedParams.id);
  
  if (!job) {
    return (
      <main className="min-h-screen bg-[#060A14] flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-4xl text-red-500 font-serif mb-4">404 - Job Not Found</h1>
        <p className="text-gray-400">The job posting you are looking for has been removed or does not exist.</p>
      </main>
    );
  }

  return <ClientPage job={job} />;
}
