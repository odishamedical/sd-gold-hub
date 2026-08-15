import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function checkLayout() {
  const docRef = doc(db, 'page_layouts', 'HOME');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.dir(docSnap.data(), { depth: null });
  } else {
    console.log("No layout found for HOME");
  }
}

checkLayout();
