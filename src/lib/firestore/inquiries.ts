import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

export interface Inquiry {
  id?: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  productId?: string;
  productName?: string;
  source: "whatsapp" | "phone" | "message";
  status: "new" | "contacted" | "resolved";
  createdAt: any;
}

const INQUIRIES_COLLECTION = "inquiries";

/**
 * Log a new inquiry/lead for a shop
 */
export async function logInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<void> {
  try {
    const inquiriesRef = collection(db, INQUIRIES_COLLECTION);
    await addDoc(inquiriesRef, {
      ...inquiry,
      status: "new",
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log inquiry:", error);
  }
}

/**
 * Get all inquiries for a specific shop
 */
export async function getShopInquiries(shopId: string): Promise<Inquiry[]> {
  // Short-circuit logic removed. Rely on actual Firestore data.

  try {
    const inquiriesRef = collection(db, INQUIRIES_COLLECTION);
    const q = query(inquiriesRef, where("shopId", "==", shopId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Inquiry[];
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return [];
  }
}

/**
 * Update inquiry status
 */
export async function updateInquiryStatus(inquiryId: string, status: "new" | "contacted" | "resolved"): Promise<void> {
  if (inquiryId.startsWith("mock_")) return; // Don't try to update mock data
  
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Failed to update inquiry status:", error);
  }
}
