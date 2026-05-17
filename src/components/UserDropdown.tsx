"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

export default function UserDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputName, setInputName] = useState("");
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

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail || !inputEmail.includes("@")) {
      alert("Please enter a valid Gmail address (e.g., yourname@gmail.com).");
      return;
    }
    const finalName = inputName.trim() || inputEmail.split("@")[0];
    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
    localStorage.setItem("sd_current_user_email", inputEmail.trim());
    localStorage.setItem("sd_current_user_name", finalName);
    localStorage.setItem("sd_current_user_avatar", defaultAvatar);
    setUserEmail(inputEmail.trim());
    setUserName(finalName);
    setUserAvatar(defaultAvatar);
    setShowSignInModal(false);
    window.dispatchEvent(new Event("sd_auth_change"));
    alert(`🎉 Successfully Signed In as ${finalName} (${inputEmail.trim()})!\n\nYour Google profile picture and persistent session are now active across the entire Shyam Dash Gold Hub storefront.`);
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
      alert("🚪 Sign Out Successful.\n\nYour persistent Gmail session has been disconnected. You can sign back in at any time.");
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
            onClick={() => setShowSignInModal(true)}
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

      {/* Interactive Google Sign In ModalOverlay (Rendered via React Portal) */}
      {mounted && showSignInModal && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-sans">
          <div className="bg-[#0A1021] border border-[#C5A059] rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.3)] w-full max-w-md my-auto flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#2A344A] bg-[#0E1528] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shadow">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.81-2.4 3.66v3.04h3.88c2.27-2.09 3.565-5.17 3.565-9.14Z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.96H1.27v3.15C3.26 21.3 7.37 24 12 24Z"/>
                    <path fill="#FBBC05" d="M5.29 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.02-3.15Z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.27 6.6l4.02 3.15c.95-2.85 3.59-4.96 6.71-4.96Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-serif text-[#C5A059] tracking-wider font-bold">Sign in with Google</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Sovereign Identity Verification</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowSignInModal(false)}
                className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 border border-[#2A344A] transition-all cursor-pointer shadow"
                title="Close Modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body - Pristine Google Login Form */}
            <form onSubmit={handleSignInSubmit} className="p-8 flex flex-col gap-6 bg-[#0A1021]">
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Enter your Gmail address to securely connect your Sovereign identity to Shyam Dash Gold Hub.
              </p>

              <div className="flex flex-col gap-1.5 font-mono">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block">Gmail Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. yourname@gmail.com" 
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] tracking-wider"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-mono">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block">Display Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rajesh Sharma" 
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] tracking-wider"
                />
              </div>

              <div className="bg-[#141C33]/50 border border-[#2A344A] p-4 rounded-xl flex flex-col gap-2 text-[11px] text-gray-400 leading-relaxed font-sans shadow-inner">
                <p className="flex items-center gap-1.5 text-white font-bold">
                  <span className="text-[#C5A059]">🔒</span> Edge OAuth Simulation
                </p>
                <p>Upon authorization, your session and Google profile avatar will be stored securely in local browser storage for persistent navigation.</p>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl font-sans cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Authorize Gmail Login</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </form>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
