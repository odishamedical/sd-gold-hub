import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAB2xKGQtTC1YFjb3ZrkjKWQBz0U_STo-o",
  authDomain: "sd-gold-hub.firebaseapp.com",
  projectId: "sd-gold-hub",
  storageBucket: "sd-gold-hub.firebasestorage.app",
  messagingSenderId: "966201468334",
  appId: "1:966201468334:web:8160072d8eaebfae12943f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkGetShops() {
  try {
    const shopsRef = collection(db, "shops");
    const snapshot = await getDocs(shopsRef);
    console.log("Success! Total shops fetched:", snapshot.docs.length);
  } catch (e) {
    console.log("Error fetching shops:", e);
  }
}

checkGetShops();
