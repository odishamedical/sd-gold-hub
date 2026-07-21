import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";

export interface GlobalAd {
  id: string;
  name: string;
  region: string;
  imageUrl: string;
  status: 'active' | 'paused';
  clicks: number;
  createdAt?: any;
}

const COLLECTION_NAME = "global_ads";

export async function getGlobalAds(): Promise<GlobalAd[]> {
  const adsRef = collection(db, COLLECTION_NAME);
  const snap = await getDocs(adsRef);
  return snap.docs.map(doc => doc.data() as GlobalAd);
}

export async function addGlobalAd(ad: Omit<GlobalAd, "id" | "clicks" | "createdAt">): Promise<string> {
  const adsRef = collection(db, COLLECTION_NAME);
  const docRef = doc(adsRef);
  
  await setDoc(docRef, {
    ...ad,
    id: docRef.id,
    clicks: 0,
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
}

export async function updateGlobalAd(adId: string, updates: Partial<GlobalAd>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, adId);
  await updateDoc(docRef, updates);
}

export async function deleteGlobalAd(adId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, adId);
  await deleteDoc(docRef);
}
