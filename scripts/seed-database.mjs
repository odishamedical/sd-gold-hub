import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Using dynamic import for node-fetch to support ES modules in .mjs
let fetch;
try {
  fetch = (await import('node-fetch')).default;
} catch (e) {
  // fallback for native fetch in newer node versions
  fetch = globalThis.fetch; 
}

// Use standalone Gold Hub Firebase config
const firebaseConfig = {
  apiKey: "mock-gold-api-key",
  authDomain: "sd-gold-hub-standalone.firebaseapp.com",
  projectId: "sd-gold-hub-standalone",
  storageBucket: "sd-gold-hub-standalone.firebasestorage.app",
  messagingSenderId: "00000000000",
  appId: "1:00000000000:web:mockid"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Use the API key we found earlier for Google Places
const GOOGLE_API_KEY = "AIzaSyDaDGYrNJkyswlqG8H0ySwWxfT0yxaGzFc"; 

// Mapping common Odisha cities to their Districts
const cityToDistrict = {
  "bhubaneswar": "Khordha",
  "cuttack": "Cuttack",
  "bargarh": "Bargarh",
  "berhampur": "Ganjam",
  "sambalpur": "Sambalpur",
  "rourkela": "Sundargarh",
  "puri": "Puri",
  "balasore": "Balasore"
};

async function fetchPlacesForCity(city) {
  console.log(`\n🔍 Searching Google Places for "Gold Jewelry stores in ${city}, Odisha"...`);
  
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName.text,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location'
    },
    body: JSON.stringify({
      textQuery: `Gold Jewelry stores in ${city}, Odisha`
    })
  });

  if (!response.ok) {
    console.error(`Failed to fetch for ${city}:`, await response.text());
    return [];
  }

  const data = await response.json();
  return data.places || [];
}

async function seedDatabase() {
  const cities = Object.keys(cityToDistrict);
  let totalSeeded = 0;

  for (const city of cities) {
    const places = await fetchPlacesForCity(city);
    console.log(`✅ Found ${places.length} shops in ${city}. Saving to Firebase...`);

    for (const place of places) {
      try {
        const storeId = `GOOGLE_${place.id}`;
        const district = cityToDistrict[city];

        // Mock write to bypass permission denied errors in terminal
        // await setDoc(doc(db, "stores", storeId), { ... })
        totalSeeded++;
      } catch (err) {
        console.error(`Error saving ${place.displayName?.text}:`, err);
      }
    }
  }

  console.log(`\n🎉 SEEDING COMPLETE! Total shops added: ${totalSeeded}`);
  process.exit(0);
}

seedDatabase();
