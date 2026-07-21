import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { Shop } from "../../types/gold-hub";

const COLLECTION_NAME = "shops";

/**
 * Creates or updates a shop document. Often used by the crawler to bulk import unverified shops.
 */
export async function saveShop(shopData: Partial<Shop> & { googlePlaceId: string }): Promise<string> {
  const shopsRef = collection(db, COLLECTION_NAME);
  
  // Use googlePlaceId as the document ID if available, otherwise let Firestore generate
  const docId = shopData.id || shopData.googlePlaceId;
  const docRef = doc(db, COLLECTION_NAME, docId);
  
  const existingDoc = await getDoc(docRef);
  
  if (existingDoc.exists()) {
    // Update existing
    await updateDoc(docRef, {
      ...shopData,
      updatedAt: serverTimestamp()
    });
    return docId;
  } else {
    // Create new
    const newShop: any = {
      ...shopData,
      id: docId,
      isVerified: false, // Always default to false for new imports
      subscriptionTier: shopData.subscriptionTier || 'FREE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(docRef, newShop);
    return docId;
  }
}

/**
 * Retrieves all shops, can optionally filter by verification status
 */
export async function getShops(isVerified?: boolean): Promise<Shop[]> {
  const shopsRef = collection(db, COLLECTION_NAME);
  let q = query(shopsRef);
  
  if (isVerified !== undefined) {
    q = query(shopsRef, where("isVerified", "==", isVerified));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : data.updatedAt,
    } as Shop;
  });
}

/**
 * Update shop verification status
 */
export async function updateShopVerification(shopId: string, isVerified: boolean): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, shopId);
  await updateDoc(docRef, {
    isVerified,
    updatedAt: serverTimestamp()
  });
}
