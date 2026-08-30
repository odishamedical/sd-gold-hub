import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  where
} from "firebase/firestore";
import { CustomerProfile } from "@/types/gold-hub";

export type CustomerActionType = "SEARCH" | "VIEW_PRODUCT" | "VIEW_SHOP";

export interface CustomerActivityLog {
  id?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  actionType: CustomerActionType;
  details: string;
  metadata: {
    shopId?: string;
    productId?: string;
    keywords?: string;
    [key: string]: any;
  };
  timestamp: any;
}

const COLLECTION_NAME = "customer_activities";

export async function logCustomerActivity(
  profile: CustomerProfile,
  actionType: CustomerActionType,
  details: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  // Prevent logging for super admins to avoid noise
  if (profile.role === "super_admin" || profile.role === "admin") return;

  try {
    const activityRef = collection(db, COLLECTION_NAME);
    await addDoc(activityRef, {
      customerId: profile.id,
      customerName: profile.name,
      customerPhone: profile.phone || profile.whatsapp || "",
      customerEmail: profile.email || "",
      actionType,
      details,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log customer activity:", error);
  }
}

export async function getGlobalCustomerActivities(limitCount: number = 200): Promise<CustomerActivityLog[]> {
  try {
    const activityRef = collection(db, COLLECTION_NAME);
    const q = query(activityRef, orderBy("timestamp", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CustomerActivityLog[];
  } catch (error) {
    console.error("Failed to fetch customer activities:", error);
    return [];
  }
}

export async function getActivitiesByCustomer(customerId: string, limitCount: number = 50): Promise<CustomerActivityLog[]> {
  try {
    const activityRef = collection(db, COLLECTION_NAME);
    const q = query(
      activityRef, 
      where("customerId", "==", customerId),
      orderBy("timestamp", "desc"), 
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CustomerActivityLog[];
  } catch (error) {
    console.error("Failed to fetch specific customer activities:", error);
    return [];
  }
}
