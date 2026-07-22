import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import { CustomerProfile } from "../../types/gold-hub";

const CUSTOMERS_COLLECTION = "customers";

/**
 * Get a customer profile by UID
 */
export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  if (!uid) return null;
  // Short-circuit for demo/impersonated users to bypass the 10s Firebase Auth hang
  if (uid.startsWith('demo_') || uid === 'test_vendor') {
    return null;
  }
  
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, uid);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as CustomerProfile;
    }
    return null;
  } catch (err) {
    console.error("Firebase Error in getCustomerProfile:", err);
    return null; // Return null so the caller can handle fallback
  }
}

/**
 * Create or update a customer profile (on login/signup)
 */
export async function upsertCustomerProfile(uid: string, data: Partial<CustomerProfile>): Promise<void> {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, uid);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      await setDoc(docRef, {
        ...data,
        savedProducts: [],
        followedShops: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.error("Firebase Error in upsertCustomerProfile:", err);
  }
}

/**
 * Add a product to the user's wishlist
 */
export async function saveProductToWishlist(uid: string, productId: string): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, uid);
  await updateDoc(docRef, {
    savedProducts: arrayUnion(productId),
    updatedAt: serverTimestamp()
  });
}

/**
 * Remove a product from the user's wishlist
 */
export async function removeProductFromWishlist(uid: string, productId: string): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, uid);
  await updateDoc(docRef, {
    savedProducts: arrayRemove(productId),
    updatedAt: serverTimestamp()
  });
}

/**
 * Follow a shop
 */
export async function followShop(uid: string, shopId: string): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, uid);
  await updateDoc(docRef, {
    followedShops: arrayUnion(shopId),
    updatedAt: serverTimestamp()
  });
}

/**
 * Unfollow a shop
 */
export async function unfollowShop(uid: string, shopId: string): Promise<void> {
  const docRef = doc(db, CUSTOMERS_COLLECTION, uid);
  await updateDoc(docRef, {
    followedShops: arrayRemove(shopId),
    updatedAt: serverTimestamp()
  });
}
