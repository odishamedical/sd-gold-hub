import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sd-gold-hub',
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
