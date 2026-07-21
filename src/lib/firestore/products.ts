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
    console.warn("Failed to fetch product from firestore, returning mock:", error);
  }
  
  // Return mock if Firestore fails or doesn't exist
  if (productId.startsWith('demo-')) {
    return {
      id: productId,
      shopId: "shop-1",
      categoryId: "cat1",
      subcategoryId: "subcat1",
      designName: "Heritage Necklace",
      metalPurityId: "m1",
      makingChargeId: "mc1",
      image: "/diamond_necklace_luxury.png",
      price: 100000,
      weightGrams: 45.5,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as Product;
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
    console.warn("Failed to fetch shop from firestore, returning mock:", error);
  }

  // Return mock if Firestore fails or doesn't exist
  if (shopId === "shop-1" || shopId.startsWith("demo")) {
    return {
      id: shopId,
      name: "Dwarika Jewellers",
      description: "Premium gold and diamond jewelers specializing in authentic 22K hallmarked traditional designs. Serving customers with transparency and trust since 1995.",
      address: "Plot 45, Unit 2, Ashok Nagar, Bhubaneswar, Odisha 751001",
      location: {
        country: "India",
        state: "Odisha",
        district: "Khordha",
        block: "Bhubaneswar"
      },
      phone: "0674-253-1234",
      whatsappNumber: "+919876543210",
      isVerified: true,
      coverImages: ["/images/showrooms.png"],
      subscriptionTier: 'ELITE',
      rating: 4.8,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
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
    console.warn("Failed to fetch rates from firestore, returning mock:", error);
  }

  // Return mock rates
  return {
    shopId,
    rate24K: 7850,
    rate22K: 7250,
    rate18K: 5850,
    lastUpdated: Date.now()
  };
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
    console.warn("Failed to fetch shop products from firestore, returning mock:", error);
  }

  // Return mock products
  return [
    {
      id: "demo-1",
      shopId,
      categoryId: "Neck Jewellery",
      subcategoryId: "Necklace",
      designName: "Casting",
      metalPurityId: "m2",
      makingChargeId: "c1",
      image: "/diamond_necklace_luxury.png",
      price: 0,
      weightGrams: 45.5,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: "demo-2",
      shopId,
      categoryId: "Hand Jewellery",
      subcategoryId: "Bangles",
      designName: "Dubai",
      metalPurityId: "m1",
      makingChargeId: "c3",
      image: "/gold_bangle_luxury.png",
      price: 0,
      weightGrams: 65.0,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
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
