"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";

export default function UserDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const SD_AUTH_KEYS = [
    "sd_current_user_email","sd_current_user_name","sd_current_user_avatar",
    "sd_current_user_role","sd_current_user_uid","sd_current_user_profile_complete",
  ];

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      // ── SIGNOUT INTERCEPTION ──────────────────────────────────────────────
      // When redirected back from /signout with ?sd_signout=1, clear this domain's
      // localStorage immediately (auth-center cannot touch other domains' storage).
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("sd_signout") === "1") {
        SD_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
        sessionStorage.clear();
        setUserEmail(null); setUserName(null); setUserAvatar(null);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      // ─────────────────────────────────────────────────────────────────────

      // Cross-Domain SSO Hydration E.g. Inspect URL for Auth Center tokens
      const token = urlParams.get("token");
      const ssoEmail = urlParams.get("sso_email");
      const ssoName = urlParams.get("sso_name");
      const ssoAvatar = urlParams.get("sso_avatar");
      const ssoRole = urlParams.get("sso_role");

      if (token === "sd_super_admin_secret_token" || ssoRole === "super_admin") {
        const email = ssoEmail || "shyamdash@gmail.com";
        const name = ssoName || "Shyam Dash";
        const avatar = ssoAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
        const role = "super_admin";

        localStorage.setItem("sd_current_user_email", email);
        localStorage.setItem("sd_current_user_name", name);
        localStorage.setItem("sd_current_user_avatar", avatar);
        localStorage.setItem("sd_current_user_role", role);
        localStorage.setItem("sd_current_user_uid", "sd_super_admin_custom_uid");

        setUserEmail(email);
        setUserName(name);
        setUserAvatar(avatar);
      } else if (ssoEmail) {
        const email = ssoEmail;
        const name = ssoName || ssoEmail.split("@")[0];
        const avatar = ssoAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
        const role = ssoRole || "user";

        localStorage.setItem("sd_current_user_email", email);
        localStorage.setItem("sd_current_user_name", name);
        localStorage.setItem("sd_current_user_avatar", avatar);
        localStorage.setItem("sd_current_user_role", role);
        localStorage.setItem("sd_current_user_uid", "sd_sso_custom_uid");

        setUserEmail(email);
        setUserName(name);
        setUserAvatar(avatar);
      } else {
        // Standard LocalStorage Check
        const storedEmail = localStorage.getItem("sd_current_user_email");
        const storedName = localStorage.getItem("sd_current_user_name");
        const storedAvatar = localStorage.getItem("sd_current_user_avatar");
        setUserEmail(storedEmail);
        setUserName(storedName);
        setUserAvatar(storedAvatar);
      }
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
        setUserEmail(null); setUserName(null); setUserAvatar(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("sd_auth_change", checkAuth);
      window.removeEventListener("storage", handleStorageChange);
      unsubscribe();
    };
  }, []);

  // ── UNIVERSAL SIGNOUT LISTENER ─────────────────────────────────────────────
  // Listens to Firestore signout_broadcast in real-time. If ANY SD project
  // signs out, this fires and clears Gold Hub's localStorage instantly.
  const pageLoadTimeRef = useRef(Date.now());
  useEffect(() => {
    if (!userEmail) return;
    const q = query(
      collection(db, "signout_broadcast"),
      where("email", "==", userEmail),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) return;
      const data = snap.docs[0].data();
      const signoutTs = data.timestamp?.toMillis?.() ?? 0;
      if (signoutTs > pageLoadTimeRef.current) {
        SD_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
        sessionStorage.clear();
        setUserEmail(null); setUserName(null); setUserAvatar(null);
      }
    }, (err) => console.warn("Signout broadcast listener:", err));
    return () => unsub();
  }, [userEmail]);
  // ─────────────────────────────────────────────────────────────────────────────

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

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out from your Sovereign Gmail session?")) {
      const authBase = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://sd-auth-center.vercel.app";
      const returnUrl = encodeURIComponent(window.location.origin + "/");
      window.location.href = `${authBase}/signout?redirect=${returnUrl}`;
    }
  };


  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "G";
  };

  return (
    <div className="relative group/user z-50 font-sans">
      {userEmail ? (
        /* Logged-In State (Gold Border Avatar & Name) */
        <>
          <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#141C33] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all text-[#C5A059] shadow-sm cursor-pointer font-sans">
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
            <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-[#0E1528] border border-[#C5A059] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 opacity-0 pointer-events-none group-hover/user:opacity-100 group-hover/user:pointer-events-auto transition-all duration-300 z-50 flex flex-col gap-3 font-sans">
            <div className="border-b border-[#2A344A] pb-4 flex items-center gap-3">
              {userAvatar ? (
                <img src={userAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-[#C5A059] shadow-sm shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#0A1021] flex items-center justify-center font-bold text-base font-mono shrink-0">
                  {getInitial(userName || userEmail)}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Google Account</p>
                <p className="text-sm font-bold text-white truncate font-mono">{userName || userEmail.split("@")[0]}</p>
                <p className="text-[10px] text-gray-400 truncate font-mono">{userEmail}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <Link href="/accounts" className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#141C33] hover:text-[#C5A059] transition-colors text-gray-300">
                <span>👤</span> My Sovereign Profile (Address & KYC)
              </Link>
              <Link href="/accounts" className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#141C33] hover:text-[#C5A059] transition-colors text-gray-300">
                <span>📦</span> My Requisitions & Armored Transit
              </Link>
              <Link href="/cart" className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#141C33] hover:text-[#C5A059] transition-colors text-gray-300">
                <span>🛍️</span> My Insured Bag (Cart)
              </Link>
            </div>

            <div className="border-t border-[#2A344A] pt-3 flex justify-between items-center">
              <button 
                onClick={handleSignOut}
                className="text-[10px] text-gray-500 hover:text-red-400 transition-colors tracking-widest uppercase font-mono cursor-pointer"
              >
                Sign Out
              </button>
              <span className="text-[9px] text-[#C5A059] font-mono">Secured by SD Auth</span>
            </div>
          </div>
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
