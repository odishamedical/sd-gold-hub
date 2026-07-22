import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRead() {
  const snapshot = await getDocs(collection(db, "shops"));
  console.log("Shops found:", snapshot.size);
  snapshot.forEach(doc => console.log(doc.id, doc.data().name));
}

testRead().catch(console.error);
