import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, initializeFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Master Database Configuration (Real Gold Hub Database)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAB2xKGQtTC1YFjb3ZrkjKWQBz0U_STo-o",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sd-gold-hub.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sd-gold-hub",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sd-gold-hub.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "966201468334",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:966201468334:web:8160072d8eaebfae12943f"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = !getApps().length ? initializeFirestore(app, { experimentalForceLongPolling: true, ignoreUndefinedProperties: true }) : getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, firebaseConfig };
export type { User };
