import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

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

const DIRECTORY_LAYOUT = {
  pageId: "DIRECTORY",
  updatedAt: Date.now(),
  sections: [
    {
      id: "sec_bhubaneswar",
      type: "SHOPS_GRID",
      title: "Top Jewelers in Bhubaneswar",
      subtitle: "Verified showrooms in the capital city",
      sortBy: "RANDOM",
      filterState: "Odisha",
      filterDistrict: "Khordha",
      filterCity: "Bhubaneswar",
      filterVerifiedOnly: false,
      limit: 5,
      order: 0
    },
    {
      id: "sec_patia",
      type: "SHOPS_GRID",
      title: "Explore Patia Area",
      subtitle: "Local jewelers near Patia",
      sortBy: "RANDOM",
      filterState: "Odisha",
      filterDistrict: "Khordha",
      filterCity: "Patia",
      filterVerifiedOnly: false,
      limit: 5,
      order: 1
    },
    {
      id: "sec_ad",
      type: "AD_INJECT",
      title: "Advertisement",
      placementId: "directory_middle_banner",
      sortBy: "RANDOM",
      filterVerifiedOnly: false,
      limit: 1,
      order: 2
    },
    {
      id: "sec_angul",
      type: "SHOPS_GRID",
      title: "Discover Angul Jewelers",
      subtitle: "",
      sortBy: "RANDOM",
      filterState: "Odisha",
      filterDistrict: "Angul",
      filterVerifiedOnly: false,
      limit: 4,
      order: 3
    }
  ]
};

async function seed() {
  try {
    console.log("Seeding DIRECTORY layout...");
    await setDoc(doc(db, "layouts", "DIRECTORY"), DIRECTORY_LAYOUT);
    console.log("✅ Successfully seeded DIRECTORY layout!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed:", error);
    process.exit(1);
  }
}

seed();
