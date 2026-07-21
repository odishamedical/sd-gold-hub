"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, onSnapshot, query, where } from "firebase/firestore";

export default function UserDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SD_AUTH_KEYS = [
    "sd_current_user_email","sd_current_user_name","sd_current_user_avatar",
    "sd_current_user_role","sd_current_user_uid","sd_current_user_profile_complete",
  ];

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("sd_current_user_email");
      const storedName = localStorage.getItem("sd_current_user_name");
      const storedAvatar = localStorage.getItem("sd_current_user_avatar");
      const storedRole = localStorage.getItem("sd_current_user_role");
      setUserEmail(storedEmail);
      setUserName(storedName);
      setUserAvatar(storedAvatar);
      setUserRole(storedRole || "user");
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
    window.addEventListener("sd_auth_change", checkAuth);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const finalName = user.displayName || user.email?.split("@")[0] || "User";
        const finalAvatar = user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";

        let userRole = "user";
        if (user.email?.includes("shyamdash") || user.email?.includes("odishamedical") || user.email?.includes("admin")) {
          userRole = "super_admin";
        }

        localStorage.setItem("sd_current_user_email", user.email || "");
        localStorage.setItem("sd_current_user_name", finalName);
        localStorage.setItem("sd_current_user_avatar", finalAvatar);
        localStorage.setItem("sd_current_user_role", userRole);
        localStorage.setItem("sd_current_user_uid", user.uid);

        setUserEmail(user.email);
        setUserName(finalName);
        setUserAvatar(finalAvatar);
        setUserRole(userRole);

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.role) {
              localStorage.setItem("sd_current_user_role", data.role);
            }
          }
        } catch (err) {
          console.warn("Firestore background sync skipped (permission denied), local session active", err);
        }
      } else {
        // Only clear if no SSO token in URL or localStorage
        if (typeof window !== "undefined" && !window.location.search.includes("token") && !window.location.search.includes("sso_email")) {
          const storedEmail = localStorage.getItem("sd_current_user_email");
          if (!storedEmail) {
            setUserEmail(null);
            setUserName(null);
            setUserAvatar(null);
          }
        }
      }
    });

    // Cross-domain sign-out: clear local auth when auth-center signs out
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sd_current_user_email" && e.newValue === null) {
        ["sd_current_user_email","sd_current_user_name","sd_current_user_avatar",
         "sd_current_user_role","sd_current_user_uid","sd_current_user_profile_complete"].forEach(
          (k) => localStorage.removeItem(k)
        );
        setUserEmail(null); setUserName(null); setUserAvatar(null); setUserRole("user");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("sd_auth_change", checkAuth);
      window.removeEventListener("storage", handleStorageChange);
      unsubscribe();
    };
  }, []);



  const handleRealGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const finalName = user.displayName || user.email?.split("@")[0] || "User";
      const finalAvatar = user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";

      let userRole = "user";
      if (user.email?.includes("shyamdash") || user.email?.includes("odishamedical") || user.email?.includes("admin")) {
        userRole = "super_admin";
      }

      localStorage.setItem("sd_current_user_email", user.email || "");
      localStorage.setItem("sd_current_user_name", finalName);
      localStorage.setItem("sd_current_user_avatar", finalAvatar);
      localStorage.setItem("sd_current_user_role", userRole);
      localStorage.setItem("sd_current_user_uid", user.uid);

      setUserEmail(user.email);
      setUserName(finalName);
      setUserAvatar(finalAvatar);
      setUserRole(userRole);
      window.dispatchEvent(new Event("sd_auth_change"));

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
        console.warn("Firestore background sync skipped (permission denied). Local session active.", firestoreErr);
      }
    } catch (error: any) {
      console.error("Google OAuth Error:", error);
      alert(`Google Sign-In Failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      try {
        await signOut(auth);
        window.location.reload();
      } catch (e) {
        console.error("Sign out error:", e);
      }
    }
  };


  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "G";
  };

  return (
    <div className="relative inline-block text-left z-50 font-sans" ref={dropdownRef}>
      {userEmail ? (
        /* Logged-In State */
        <>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#141C33] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all text-[#C5A059] shadow-sm cursor-pointer font-sans"
          >
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName || "User"} 
                className="w-6 h-6 rounded-full object-cover border border-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.5)] shrink-0" 
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0A1021] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                {getInitial(userName || userEmail)}
              </div>
            )}
            <span className="text-xs font-medium text-white truncate max-w-[100px] md:max-w-[140px]">
              {userName || userEmail.split("@")[0]}
            </span>
            <svg className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0E1528]/95 backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden text-left animate-fadeIn">
              <div className="bg-[#141C33]/50 px-4 py-3 border-b border-[#2A344A]">
                <p className="text-sm font-bold text-white truncate">{userName || userEmail.split("@")[0]}</p>
                <p className="text-[10px] text-[#C5A059] uppercase tracking-wider mt-0.5 truncate">{userEmail}</p>
              </div>

              <div className="p-2 space-y-1">
                {(userRole === "super_admin" || userRole === "admin") && (
                  <button 
                    onClick={() => { setIsOpen(false); router.push('/admin'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                  >
                    <span className="text-lg">🛡️</span>
                    <span className="text-xs font-bold text-gray-200 group-hover:text-[#C5A059] transition-colors">Admin Console</span>
                  </button>
                )}
                {(userRole === "vendor" || userRole === "shop" || userRole === "super_admin") && (
                  <button 
                    onClick={() => { setIsOpen(false); router.push('/vendor'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                  >
                    <span className="text-lg">🏪</span>
                    <span className="text-xs font-bold text-gray-200 group-hover:text-[#C5A059] transition-colors">Vendor Panel</span>
                  </button>
                )}
                <button 
                  onClick={() => { setIsOpen(false); router.push('/dashboard'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-xs font-bold text-gray-200 group-hover:text-[#C5A059] transition-colors">My Dashboard</span>
                </button>
                <button 
                  onClick={() => { setIsOpen(false); router.push('/cart'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                >
                  <span className="text-lg">🛍️</span>
                  <span className="text-xs font-bold text-gray-200 group-hover:text-[#C5A059] transition-colors">My Insured Bag</span>
                </button>
              </div>

              <div className="p-2 border-t border-[#2A344A]">
                <button 
                  onClick={() => { setIsOpen(false); handleSignOut(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 transition-all text-left group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  <span className="text-xs font-bold">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Logged-Out State (Official Firebase Google Sign-In Trigger) */
        <button 
          onClick={handleRealGoogleLogin}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141C33]/90 border border-[#2A344A] hover:border-[#C5A059] transition-all text-gray-200 hover:text-white group shadow-sm cursor-pointer font-sans"
          title="Sign in with Google"
        >
          {/* Google 'G' SVG Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.81-2.4 3.66v3.04h3.88c2.27-2.09 3.565-5.17 3.565-9.14Z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.96H1.27v3.15C3.26 21.3 7.37 24 12 24Z"/>
            <path fill="#FBBC05" d="M5.29 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.02-3.15Z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.27 6.6l4.02 3.15c.95-2.85 3.59-4.96 6.71-4.96Z"/>
          </svg>
          <span className="text-xs font-medium tracking-wide">Sign in with Google</span>
        </button>
      )}
    </div>
  );
}
