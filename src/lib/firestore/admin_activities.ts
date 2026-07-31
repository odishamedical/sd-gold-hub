import { db } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

export interface AdminActivity {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string; // e.g. "Approved Shop", "Rejected KYC", "Edited Shop Profile"
  details: string; // Detailed context
  timestamp: number;
}

const COLLECTION_NAME = "admin_activities";

/**
 * Log a new admin activity
 */
export async function logAdminActivity(
  adminName: string, 
  adminEmail: string, 
  action: string, 
  details: string
): Promise<void> {
  try {
    const id = `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const docRef = doc(collection(db, COLLECTION_NAME), id);
    
    await setDoc(docRef, {
      id,
      adminName,
      adminEmail,
      action,
      details,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Failed to log admin activity:", err);
  }
}

/**
 * Get recent admin activities (max 100)
 */
export async function getRecentAdminActivities(): Promise<AdminActivity[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("timestamp", "desc"),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as AdminActivity);
  } catch (err) {
    console.error("Failed to fetch admin activities:", err);
    return [];
  }
}
