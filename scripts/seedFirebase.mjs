import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "mock-gold-api-key") {
  console.error("❌ ERROR: NEXT_PUBLIC_FIREBASE_API_KEY is not set or is still the mock key.");
  console.error("Please configure your real Firebase project keys in your environment variables before seeding.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SHOPS_COLLECTION = "shops";
const PRODUCTS_COLLECTION = "products";

const flagshipShops = [
  {
    id: "ira-jewels",
    name: "IRA JEWELS",
    description: "Premium gold and diamond jewelers specializing in authentic 22K hallmarked traditional designs.",
    address: "Bhubaneswar, Odisha",
    ownerEmail: "", // TODO: Add owner email here when ready to hand over
    subscriptionTier: "ELITE",
    isVerified: true
  },
  {
    id: "dwarika-jewellers",
    name: "DWARIKA JEWELLERS",
    description: "Serving customers with transparency and trust since 1995.",
    address: "Plot 45, Unit 2, Ashok Nagar, Bhubaneswar, Odisha 751001",
    ownerEmail: "", // TODO: Add owner email here when ready to hand over
    subscriptionTier: "ELITE",
    isVerified: true
  },
  {
    id: "jewellery-world",
    name: "JEWELLERY WORLD",
    description: "Exclusive multi-vendor gold jewelry marketplace.",
    address: "Odisha Medical Tech Park, Bhubaneswar",
    ownerEmail: "", // TODO: Add owner email here when ready to hand over
    subscriptionTier: "PREMIUM",
    isVerified: true
  },
  {
    id: "new-jewellery-world",
    name: "NEW JEWELLERY WORLD",
    description: "A destination for the finest gold and diamond jewelry.",
    address: "Sambalpur, Odisha",
    ownerEmail: "", // TODO: Add owner email here when ready to hand over
    subscriptionTier: "PREMIUM",
    isVerified: true
  }
];

const mockupProducts = [
  {
    id: "prod-mock-1",
    shopId: "ira-jewels",
    vendor: "IRA JEWELS",
    title: "22K Lotus Heritage Necklace",
    description: "A stunning piece of traditional craftsmanship.",
    purity: "22K Gold",
    categoryId: "Necklaces",
    weightGrams: 41.0,
    price: 285000,
    images: ["/diamond_necklace_luxury.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-2",
    shopId: "dwarika-jewellers",
    vendor: "DWARIKA JEWELLERS",
    title: "Solid 24K Sovereign Bangle Set",
    description: "Exquisite hand-crafted bangles imported from Dubai.",
    purity: "24K Pure Gold",
    categoryId: "Bangles",
    weightGrams: 65.5,
    price: 560000,
    images: ["/gold_bangle_luxury.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-3",
    shopId: "jewellery-world",
    vendor: "JEWELLERY WORLD",
    title: "Royal Diamond & Gold Choker",
    description: "Premium gold choker with diamond accents.",
    purity: "22K Gold",
    categoryId: "Necklaces",
    weightGrams: 85.2,
    price: 1245000,
    images: ["/hero-gold.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-4",
    shopId: "new-jewellery-world",
    vendor: "NEW JEWELLERY WORLD",
    title: "18K Vintage Temple Earrings",
    description: "Classic temple design earrings.",
    purity: "18K Gold",
    categoryId: "Earrings",
    weightGrams: 18.4,
    price: 350000,
    images: ["/diamond_necklace_luxury.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-5",
    shopId: "ira-jewels",
    vendor: "IRA JEWELS",
    title: "24K Pure Gold Lakshmi Coin (10g)",
    description: "Authentic Lakshmi gold coin.",
    purity: "24K Pure Gold",
    categoryId: "Coins",
    weightGrams: 10.0,
    price: 74500,
    images: ["/hero-gold.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-6",
    shopId: "dwarika-jewellers",
    vendor: "DWARIKA JEWELLERS",
    title: "22K Traditional Antique Kangan",
    description: "Antique kangan for traditional occasions.",
    purity: "22K Gold",
    categoryId: "Bangles",
    weightGrams: 52.8,
    price: 415000,
    images: ["/gold_bangle_luxury.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-7",
    shopId: "jewellery-world",
    vendor: "JEWELLERY WORLD",
    title: "22K Filigree Droplet Earrings",
    description: "Beautiful droplet earrings with filigree work.",
    purity: "22K Gold",
    categoryId: "Earrings",
    weightGrams: 14.2,
    price: 112000,
    images: ["/diamond_necklace_luxury.png"],
    status: "active",
    bvcInsured: true
  },
  {
    id: "prod-mock-8",
    shopId: "new-jewellery-world",
    vendor: "NEW JEWELLERY WORLD",
    title: "24K Sovereign Gold Bar (50g)",
    description: "24K investment grade gold bar.",
    purity: "24K Pure Gold",
    categoryId: "Coins",
    weightGrams: 50.0,
    price: 368000,
    images: ["/hero-gold.png"],
    status: "active",
    bvcInsured: true
  }
];

async function seedDatabase() {
  console.log("Starting Firebase Seeding Process...");
  
  try {
    for (const shop of flagshipShops) {
      console.log(`Seeding Shop: ${shop.name}...`);
      await setDoc(doc(db, SHOPS_COLLECTION, shop.id), {
        ...shop,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    for (const prod of mockupProducts) {
      console.log(`Seeding Product: ${prod.title}...`);
      await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), {
        ...prod,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
