import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  limit
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
      title: "22K Solid Gold Heritage Necklace",
      description: "An exquisite handcrafted 22K solid gold heritage necklace featuring intricate traditional temple motifs. Perfect for weddings and special occasions. Hallmarked for purity.",
      huid: "A1B2C3D",
      karat: '22K',
      grossWeightGrams: 45.5,
      netWeightGrams: 45.5,
      makingChargeType: 'PERCENTAGE',
      makingChargeValue: 12,
      images: ["/diamond_necklace_luxury.png"],
      category: "Necklace",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
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
      title: "22K Solid Gold Heritage Necklace",
      description: "Exquisite handcrafted 22K solid gold heritage necklace.",
      huid: "HUID123",
      karat: '22K',
      grossWeightGrams: 45.5,
      netWeightGrams: 45.5,
      makingChargeType: 'PERCENTAGE',
      makingChargeValue: 12,
      images: ["/diamond_necklace_luxury.png"],
      category: "Necklace",
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: "demo-2",
      shopId,
      title: "24K Sovereign Bangle Set",
      description: "Pure 24K gold bangle set.",
      huid: "HUID456",
      karat: '24K',
      grossWeightGrams: 65.0,
      netWeightGrams: 65.0,
      makingChargeType: 'FLAT',
      makingChargeValue: 5000,
      images: ["/gold_bangle_luxury.png"],
      category: "Bangles",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
}
