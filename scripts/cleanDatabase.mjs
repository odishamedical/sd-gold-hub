import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SHOPS_COLLECTION = "shops";
const PRODUCTS_COLLECTION = "products";

const dummyShops = [
  "ira-jewels",
  "dwarika-jewellers",
  "jewellery-world",
  "new-jewellery-world"
];

const dummyProducts = [
  "prod-mock-1",
  "prod-mock-2",
  "prod-mock-3",
  "prod-mock-4",
  "prod-mock-5",
  "prod-mock-6",
  "prod-mock-7",
  "prod-mock-8"
];

async function cleanDatabase() {
  console.log("Starting Firebase Cleanup Process...");
  
  try {
    for (const shopId of dummyShops) {
      console.log(`Deleting Shop: ${shopId}...`);
      await deleteDoc(doc(db, SHOPS_COLLECTION, shopId));
    }

    for (const prodId of dummyProducts) {
      console.log(`Deleting Product: ${prodId}...`);
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, prodId));
    }
    
    console.log("✅ Cleanup completed successfully! Database is now clean.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error cleaning database:", err);
    process.exit(1);
  }
}

cleanDatabase();
