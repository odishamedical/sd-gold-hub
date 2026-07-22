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
  // Short-circuit for demo
  if (shopId.startsWith("demo_") || shopId === "test_vendor" || shopId === "shop-1") {
    return [
      {
        id: "mock_1",
        shopId,
        customerId: "mock_cust_1",
        customerName: "Ramesh Kumar",
        customerPhone: "+91 98765 43210",
        customerCity: "Bhubaneswar",
        productId: "demo-1",
        productName: "22K Antique Casting Necklace",
        source: "whatsapp",
        status: "new",
        createdAt: Date.now() - 1000 * 60 * 30 // 30 mins ago
      },
      {
        id: "mock_2",
        shopId,
        customerId: "mock_cust_2",
        customerName: "Sita Das",
        customerPhone: "+91 99999 88888",
        customerCity: "Cuttack",
        source: "phone",
        status: "contacted",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
      }
    ];
  }

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
