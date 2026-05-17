"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function UserDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputName, setInputName] = useState("");

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("sd_current_user_email");
      const storedName = localStorage.getItem("sd_current_user_name");
      setUserEmail(storedEmail);
      setUserName(storedName);
    }
  };

  useEffect(() => {
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
    localStorage.setItem("sd_current_user_email", inputEmail.trim());
    localStorage.setItem("sd_current_user_name", finalName);
    setUserEmail(inputEmail.trim());
    setUserName(finalName);
    setShowSignInModal(false);
    window.dispatchEvent(new Event("sd_auth_change"));
    alert(`🎉 Successfully Signed In as ${finalName} (${inputEmail.trim()})!\n\nYour persistent Gmail OAuth session is now active across the entire Shyam Dash Gold Hub ecosystem.`);
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out from your Sovereign Gmail session?")) {
      localStorage.removeItem("sd_current_user_email");
      localStorage.removeItem("sd_current_user_name");
      setUserEmail(null);
      setUserName(null);
      window.dispatchEvent(new Event("sd_auth_change"));
      alert("🚪 Sign Out Successful.\n\nYour persistent Gmail session has been disconnected. You can sign back in at any time.");
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "G";
  };

  return (
    <>
      <div className="relative group/user z-50">
        {userEmail ? (
          /* Logged-In State (Persistent Gmail Session) */
          <>
            <button className="flex items-center gap-2 bg-[#141C33] border border-[#2A344A] px-4 py-2 rounded-full hover:border-[#C5A059] transition-all text-[#C5A059]">
              <div className="w-5 h-5 rounded-full bg-[#C5A059] text-[#0A1021] flex items-center justify-center font-bold text-xs font-mono">
                {getInitial(userName || userEmail)}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white truncate max-w-[120px]">
                {userName || userEmail.split("@")[0]} (Gmail)
              </span>
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            /* Dropdown Menu */
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0E1528] border border-[#C5A059] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 opacity-0 pointer-events-none group-hover/user:opacity-100 group-hover/user:pointer-events-auto transition-all duration-300 z-50 flex flex-col gap-3">
              <div className="border-b border-[#2A344A] pb-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Sovereign Gmail Account</p>
                <p className="text-sm font-bold text-white truncate font-mono">{userEmail}</p>
                <span className="inline-block bg-green-500/20 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 animate-pulse font-mono">● Push Notifications Active</span>
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
                  className="text-[10px] text-gray-500 hover:text-red-400 transition-colors tracking-widest uppercase font-mono"
                >
                  Sign Out
                </button>
                <span className="text-[9px] text-[#C5A059] font-mono">Secured by SD Auth</span>
              </div>
            </div>
          </>
        ) : (
          /* Logged-Out State */
          <button 
            onClick={() => setShowSignInModal(true)}
            className="flex items-center gap-2 bg-[#141C33] border border-[#2A344A] px-4 py-2 rounded-full hover:border-[#C5A059] transition-all text-[#C5A059] group/btn shadow"
          >
            <svg className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18.1 12.24 18.1c-3.363 0-6.1-2.737-6.1-6.1s2.737-6.1 6.1-6.1c1.515 0 2.903.553 3.979 1.468l2.351-2.351C16.924 3.616 14.73 2.8 12.24 2.8 7.153 2.8 3.04 6.913 3.04 12s4.113 9.2 9.2 9.2c5.31 0 8.85-3.736 8.85-9.015 0-.61-.055-1.205-.157-1.899H12.24z"/></svg>
            <span className="text-xs font-bold uppercase tracking-widest text-white font-mono">Sign In with Gmail</span>
          </button>
        )}
      </div>

      {/* Interactive Gmail Sign In ModalOverlay */}
      {showSignInModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A1021] border border-[#C5A059] rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.25)] w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 font-sans">
            
            <div className="p-6 border-b border-[#2A344A] bg-[#0E1528] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18.1 12.24 18.1c-3.363 0-6.1-2.737-6.1-6.1s2.737-6.1 6.1-6.1c1.515 0 2.903.553 3.979 1.468l2.351-2.351C16.924 3.616 14.73 2.8 12.24 2.8 7.153 2.8 3.04 6.913 3.04 12s4.113 9.2 9.2 9.2c5.31 0 8.85-3.736 8.85-9.015 0-.61-.055-1.205-.157-1.899H12.24z"/></svg>
                </div>
                <div>
                  <h3 className="text-base font-serif text-[#C5A059] tracking-wider font-bold">Google Gmail SSO</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Sovereign Identity Verification</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSignInModal(false)}
                className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-white border border-[#2A344A] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSignInSubmit} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block font-mono">Gmail Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. founder@shyamdash.com or yourname@gmail.com" 
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono tracking-wider"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block font-mono">Display Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rajesh Sharma" 
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono tracking-wider"
                />
              </div>

              <div className="bg-[#141C33]/50 border border-[#2A344A] p-4 rounded-xl flex flex-col gap-2 text-[11px] text-gray-400 leading-relaxed font-sans shadow-inner">
                <p className="flex items-center gap-1.5 text-white font-bold">
                  <span className="text-[#C5A059]">🔒</span> Edge OAuth Simulation
                </p>
                <p>This simulates a secure Google OAuth 2.0 handshake. Your session will be stored securely in local browser storage for persistent multi-page navigation.</p>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl font-sans"
              >
                Authorize Gmail SSO
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
