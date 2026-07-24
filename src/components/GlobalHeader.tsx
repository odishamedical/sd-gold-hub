"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/lib/firebase";

interface GlobalHeaderProps {
  activeProject?: string;
}

export default function GlobalHeader({ activeProject = "Gold Hub" }: GlobalHeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const auth = getAuth(app);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      setUserEmail(localStorage.getItem("sd_current_user_email"));
      setUserName(localStorage.getItem("sd_current_user_name"));
      setUserAvatar(localStorage.getItem("sd_current_user_avatar"));
      setUserRole(localStorage.getItem("sd_current_user_role"));
      
      const path = window.location.pathname;
      const isAd = path.startsWith("/admin") || 
                   path.startsWith("/portal") || 
                   path.startsWith("/franchise") || 
                   path.startsWith("/weaver") || 
                   path.startsWith("/store");
      setIsAdminMode(isAd);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes natively via Firebase
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("sd_current_user_email", user.email || "");
        localStorage.setItem("sd_current_user_name", user.displayName || "");
        localStorage.setItem("sd_current_user_avatar", user.photoURL || "");
        
        // If not already set, assign default role
        if (!localStorage.getItem("sd_current_user_role")) {
          // If the admin email is used, set as admin, else customer
          const role = user.email === "odishamedical@gmail.com" ? "admin" : "customer";
          localStorage.setItem("sd_current_user_role", role);
        }
        checkAuth();
      } else {
        ["sd_current_user_email","sd_current_user_name","sd_current_user_avatar",
         "sd_current_user_role","sd_current_user_uid","sd_current_user_profile_complete"].forEach(
          (k) => localStorage.removeItem(k)
        );
        checkAuth();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Ensure page reload if necessary or rely on onAuthStateChanged to populate UI
      window.location.reload();
    } catch (e) {
      console.error("Sign in error:", e);
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

  return (
    <div className="flex w-full h-[40px] bg-[#090F1D] border-b border-[#C5A059]/20 items-center justify-between px-3 md:px-6 font-sans sticky top-0 z-[100]">
      {/* Branding & Nav */}
      <div className="flex items-center gap-4 md:gap-6">
        <a href="/" className="flex items-center gap-2 text-[#C5A059] hover:brightness-110 transition-all shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase font-mono hidden sm:inline-block">{activeProject}</span>
          {isAdminMode && (
            <span className="text-[8px] font-extrabold bg-[#C5A059]/20 text-[#C5A059] px-1.5 py-0.5 rounded border border-[#C5A059]/30 uppercase tracking-widest font-mono shrink-0">ADMIN</span>
          )}
        </a>
        <a href="/gold-price-live" className="flex items-center gap-2 text-[10px] md:text-xs font-black text-white hover:text-red-100 uppercase tracking-widest transition-all bg-gradient-to-r from-red-600 to-red-800 px-3 py-1.5 rounded-md border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> 
          <span>GOLD PRICE TODAY</span>
        </a>
      </div>

      {/* USER AUTH */}
      <div className="flex items-center gap-1.5 md:gap-4 relative shrink-0" ref={dropdownRef}>
        {userEmail ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 md:gap-2 focus:outline-none cursor-pointer"
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="" 
                  className="w-6 h-6 rounded-full object-cover border-2 border-[#C5A059] hover:scale-105 transition-transform" 
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0A1021] flex items-center justify-center font-bold text-[10px] border-2 border-[#C5A059] hover:scale-105 transition-transform">
                  {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
                </div>
              )}
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 bg-[#090F1D] border border-[#C5A059]/40 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] py-2 z-[110] text-left">
                <div className="px-4 py-2 border-b border-[#2A344A]">
                  <p className="text-xs font-bold text-white truncate">{userName || userEmail.split("@")[0]}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{userEmail}</p>
                  {userRole && (
                    <span className="inline-block text-[8px] font-mono font-bold bg-[#C5A059]/20 text-[#C5A059] px-1.5 py-0.5 rounded mt-1.5 uppercase tracking-wide">
                      {userRole.replace("_", " ")}
                    </span>
                  )}
                </div>
                
                <a 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-[#C5A059]/10 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Go to Dashboard</span>
                </a>

                {userRole === "admin" && (
                  <a 
                    href="/admin" 
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-[#C5A059]/10 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Admin Panel</span>
                  </a>
                )}

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-colors text-left font-bold border-t border-[#2A344A]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={handleSignIn}
            className="text-[9px] md:text-[10px] text-[#C5A059] hover:text-[#e5c158] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
            </svg>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
}
