import { db } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

export interface VanityRequest {
  id: string;
  shopId: string;
  shopName: string;
  shopPhone?: string;
  requestedUrls: string[];
  tier: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  updatedAt: any;
}

const COLLECTION_NAME = "vanity_requests";

export async function createVanityRequest(data: Omit<VanityRequest, "id" | "status" | "createdAt" | "updatedAt">): Promise<string> {
  const reqRef = doc(collection(db, COLLECTION_NAME));
  await setDoc(reqRef, {
    ...data,
    id: reqRef.id,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return reqRef.id;
}

export async function getPendingVanityRequests(): Promise<VanityRequest[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "pending")
    );
    // Note: If orderBy("createdAt", "desc") throws index error, just fetch and sort in memory
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => doc.data() as VanityRequest);
    // Sort descending by timestamp locally if composite index doesn't exist
    return results.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
      return timeB - timeA;
    });
  } catch (err) {
    console.error("Failed to fetch pending vanity requests:", err);
    return [];
  }
}

export async function approveVanityRequest(requestId: string, shopId: string, approvedUrl: string, tier: string): Promise<void> {
  // 1. Update the request status
  const reqRef = doc(db, COLLECTION_NAME, requestId);
  await updateDoc(reqRef, {
    status: "approved",
    approvedUrl,
    updatedAt: serverTimestamp()
  });

  // 2. Update the shop document with the new vanity URL
  // We apply the most appropriate field depending on the tier.
  const shopRef = doc(db, "shops", shopId);
  
  // Calculate expiration (1 year from now)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  if (tier === "subdomain") {
    const rawSubdomain = approvedUrl.replace(".golddunia.com", "");
    await updateDoc(shopRef, {
      customDomain: approvedUrl,
      vanityUrl: approvedUrl,
      customSlug: rawSubdomain, // The vanity slug
      "subscription.vanityExpiresAt": expiresAt.toISOString()
    });
  } else {
    // TopPath, StatePath, DistrictPath
    // They all rely on the customSlug mapped in the global router
    // Extract the slug (last part of URL)
    const slugParts = approvedUrl.split("/");
    const customSlug = slugParts[slugParts.length - 1];
    
    await updateDoc(shopRef, {
      vanityUrl: approvedUrl,
      customSlug: customSlug,
      "subscription.vanityExpiresAt": expiresAt.toISOString()
    });
  }
}

export async function rejectVanityRequest(requestId: string): Promise<void> {
  const reqRef = doc(db, COLLECTION_NAME, requestId);
  await updateDoc(reqRef, {
    status: "rejected",
    updatedAt: serverTimestamp()
  });
}
