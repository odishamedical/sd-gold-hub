import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc,
  deleteDoc,
  query, 
  where,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { Product, Shop, LiveGoldRate } from "../../types/gold-hub";

const PRODUCTS_COLLECTION = "products";
const SHOPS_COLLECTION = "shops";
const RATES_COLLECTION = "live_rates";

/**
 * Fetch a specific product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Product;
    }
  } catch (error) {
    console.error("Failed to fetch product from firestore:", error);
  }
  return null;
}

/**
 * Fetch a shop by ID
 */
export async function getShopById(shopId: string): Promise<Shop | null> {

  try {
    const docRef = doc(db, SHOPS_COLLECTION, shopId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Shop;
    }
  } catch (error) {
    console.error("Failed to fetch shop from firestore:", error);
  }
  return null;
}

/**
 * Fetch live rates for a specific shop
 */
export async function getShopLiveRates(shopId: string): Promise<LiveGoldRate | null> {
  try {
    const docRef = doc(db, RATES_COLLECTION, shopId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as LiveGoldRate;
    }
  } catch (error) {
    console.error("Failed to fetch rates from firestore:", error);
  }
  return null;
}

/**
 * Fetch recent products for a shop
 */
export async function getShopProducts(shopId: string): Promise<Product[]> {

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, where("shopId", "==", shopId), limit(10));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
  } catch (error) {
    console.error("Failed to fetch shop products from firestore:", error);
  }
  return [];
}

/**
 * Add a new product
 */
export async function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const docRef = doc(productsRef); // Auto-generate ID
  
  await setDoc(docRef, {
    ...product,
    id: docRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
}

/**
 * Update a product
 */
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Fetch all recent products (for marketplace homepage)
 */
export async function getRecentProducts(limitCount = 20): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simple query: get active products
    const q = query(
      productsRef,
      where("status", "==", "active"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
  } catch (error) {
    console.error("Failed to fetch recent products from firestore:", error);
  }
  return [];
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(categoryId: string, limitCount = 10): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where("categoryId", "==", categoryId),
      where("status", "==", "active"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
  }
  return [];
}
