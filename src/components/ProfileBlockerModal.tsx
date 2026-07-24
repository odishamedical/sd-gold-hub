"use client";

import React from "react";
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProfileBlockerModalProps {
  onClose: () => void;
  actionName?: string;
  originHub?: string;
}

export default function ProfileBlockerModal({ onClose, actionName = "perform this action", originHub }: ProfileBlockerModalProps) {
  const handleCompleteProfile = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const finalName = user.displayName || user.email?.split("@")[0] || "User";
      const finalAvatar = user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";

      let userRole = "user";
      if (user.email?.includes("odishamedical") || user.email?.includes("admin")) {
        userRole = "super_admin";
      }

      localStorage.setItem("sd_current_user_email", user.email || "");
      localStorage.setItem("sd_current_user_name", finalName);
      localStorage.setItem("sd_current_user_avatar", finalAvatar);
      localStorage.setItem("sd_current_user_role", userRole);
      localStorage.setItem("sd_current_user_uid", user.uid);

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.role) {
            localStorage.setItem("sd_current_user_role", data.role);
          }
        } else {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: finalName,
            profilePhoto: finalAvatar,
            role: userRole,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            linkedProjects: ["sd-gold-hub"]
          });
        }
      } catch (firestoreErr) {
        console.warn("Firestore sync skipped", firestoreErr);
      }

      window.location.reload();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
      } else {
        console.error("Google Sign-In Error:", error);
        alert(`Google Sign-In Failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#020610]/95 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0A1021] border-2 border-[#C5A059] rounded-3xl shadow-[0_0_50px_rgba(197,160,89,0.3)] overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200">
        
        {/* Glow indicator */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent w-full -mt-6 -mx-6 mb-6" />
        
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] text-3xl shadow-[0_0_20px_rgba(197,160,89,0.1)]">
            ⚠️
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-wider text-white font-serif">PROFILE REGISTRATION REQUIRED</h3>
            <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-mono mt-1">Authentication Locked</p>
          </div>
        </div>

        {/* Message body */}
        <div className="text-center text-xs text-gray-300 leading-relaxed px-2 space-y-3 font-sans">
          <p>
            To complete your order checkout, consult doctors, claim listings, or submit reviews, you must verify your profile details.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5 mt-6">
          <button 
            onClick={handleCompleteProfile}
            className="w-full py-3 bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg font-sans flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.81-2.4 3.66v3.04h3.88c2.27-2.09 3.565-5.17 3.565-9.14Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.96H1.27v3.15C3.26 21.3 7.37 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.29 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.02-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.27 6.6l4.02 3.15c.95-2.85 3.59-4.96 6.71-4.96Z"/>
            </svg>
            Sign in with Google
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3 border border-slate-800 hover:bg-slate-900 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer font-sans"
          >
            Continue in Read-Only Mode
          </button>
        </div>

      </div>
    </div>
  );
}
