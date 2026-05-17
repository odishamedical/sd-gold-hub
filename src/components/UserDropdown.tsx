"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

export default function UserDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [showGoogleAuthPopup, setShowGoogleAuthPopup] = useState(false);
  const [gmailInput, setGmailInput] = useState("");
  const [mounted, setMounted] = useState(false);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("sd_current_user_email");
      const storedName = localStorage.getItem("sd_current_user_name");
      const storedAvatar = localStorage.getItem("sd_current_user_avatar");
      setUserEmail(storedEmail);
      setUserName(storedName);
      setUserAvatar(storedAvatar);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
    window.addEventListener("sd_auth_change", checkAuth);
    return () => {
      window.removeEventListener("sd_auth_change", checkAuth);
    };
  }, []);

  const handleGoogleLoginNext = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = gmailInput.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      alert("Please enter a valid Gmail address (e.g., yourname@gmail.com).");
      return;
    }

    // Automatically extract and capitalize the name from the email prefix E.g. shyam.dash@gmail.com -> Shyam Dash
    const emailPrefix = trimmedEmail.split("@")[0];
    const extractedName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";

    localStorage.setItem("sd_current_user_email", trimmedEmail);
    localStorage.setItem("sd_current_user_name", extractedName);
    localStorage.setItem("sd_current_user_avatar", defaultAvatar);

    setUserEmail(trimmedEmail);
    setUserName(extractedName);
    setUserAvatar(defaultAvatar);
    setShowGoogleAuthPopup(false);
    setGmailInput("");

    window.dispatchEvent(new Event("sd_auth_change"));
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out from your Sovereign Gmail session?")) {
      localStorage.removeItem("sd_current_user_email");
      localStorage.removeItem("sd_current_user_name");
      localStorage.removeItem("sd_current_user_avatar");
      setUserEmail(null);
      setUserName(null);
      setUserAvatar(null);
      window.dispatchEvent(new Event("sd_auth_change"));
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "G";
  };

  return (
    <>
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
          /* Logged-Out State (Google Logo + Sign in with Google) */
          <button 
            onClick={() => setShowGoogleAuthPopup(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141C33]/90 border border-[#2A344A] hover:border-[#C5A059] transition-all text-gray-200 hover:text-white group shadow-sm cursor-pointer font-sans"
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

      {/* Realistic Google OAuth Popup Window Simulation */}
      {mounted && showGoogleAuthPopup && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-800 rounded-[28px] shadow-[0_10px_60px_rgba(0,0,0,0.5)] w-full max-w-[440px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200 relative">
            
            {/* Close Button */}
            <button 
              type="button" 
              onClick={() => setShowGoogleAuthPopup(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Google Official Logo */}
            <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.81-2.4 3.66v3.04h3.88c2.27-2.09 3.565-5.17 3.565-9.14Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.96H1.27v3.15C3.26 21.3 7.37 24 12 24Z"/>
              <path fill="#FBBC05" d="M5.29 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.02-3.15Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.27 6.6l4.02 3.15c.95-2.85 3.59-4.96 6.71-4.96Z"/>
            </svg>

            <h2 className="text-2xl font-normal text-gray-900 mb-1 font-sans">Sign in</h2>
            <p className="text-sm text-gray-600 mb-8 font-sans">to continue to Shyam Dash Gold Hub</p>

            {/* Google Sign-in Form */}
            <form onSubmit={handleGoogleLoginNext} className="w-full flex flex-col gap-6">
              
              <div className="relative w-full">
                <input 
                  type="email" 
                  required
                  id="gmail-input"
                  placeholder=" " 
                  value={gmailInput}
                  onChange={(e) => setGmailInput(e.target.value)}
                  className="block px-4 pb-3 pt-5 w-full text-base text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0b57d0] focus:border-[#0b57d0] peer"
                />
                <label 
                  htmlFor="gmail-input"
                  className="absolute text-base text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-3 left-3 cursor-text"
                >
                  Email or phone
                </label>
              </div>

              <div className="text-xs text-gray-500 leading-normal font-sans">
                Not your computer? Use Guest mode to sign in privately.
              </div>

              <div className="flex justify-between items-center pt-4">
                <button 
                  type="button" 
                  onClick={() => { setGmailInput("shyamdash@gmail.com"); }}
                  className="text-sm text-[#0b57d0] hover:bg-blue-50 px-3 py-2 rounded-full font-medium transition-colors cursor-pointer"
                >
                  Create account
                </button>
                <button 
                  type="submit"
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  Next
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
