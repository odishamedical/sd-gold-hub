"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query as firestoreQuery } from 'firebase/firestore';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function ClaimContent() {
  const searchParams = useSearchParams();
  const directShopId = searchParams.get('shopId');

  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{placeId: string, name: string, address: string, isLocal: boolean}[]>([]);
  
  // Modes: 'search' | 'claim_existing' | 'add_new' | 'success'
  const [mode, setMode] = useState<'search' | 'claim_existing' | 'add_new' | 'success'>('search');
  
  const [selectedPlace, setSelectedPlace] = useState<{placeId: string, name: string, address: string, isLocal: boolean} | null>(null);
  
  const [formData, setFormData] = useState({
    personalName: "",
    phone: "",
    whatsapp: "",
    shopName: "",
    shopAddress: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDirectShop() {
      if (directShopId) {
        try {
          const shopDoc = await getDoc(doc(db, "shops", directShopId));
          if (shopDoc.exists()) {
            const data = shopDoc.data();
            setSelectedPlace({
              placeId: directShopId,
              name: data.shopName || data.name || "Unknown Shop",
              address: data.address || "",
              isLocal: true
            });
            setMode('claim_existing');
          }
        } catch (e) {
          console.error("Failed to fetch direct shop", e);
        }
      }
    }
    fetchDirectShop();
  }, [directShopId]);

  const searchPlaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    
    try {
      // 1. Search Local Directory First
      const shopsRef = collection(db, "shops");
      const q = firestoreQuery(shopsRef);
      const snapshot = await getDocs(q);
      const localMatches = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
        .filter(s => (s.shopName || s.name || "").toLowerCase().includes(query.toLowerCase()))
        .map(s => ({
          placeId: s.id,
          name: s.shopName || s.name,
          address: s.address || s.location?.city || "",
          isLocal: true
        }));

      // 2. Search Google Places Fallback
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      const data = await res.json();
      let googleMatches = [];
      if (data.places) {
        googleMatches = data.places.map((p: any) => ({
          placeId: p.id,
          name: p.displayName?.text || "Unknown",
          address: p.formattedAddress || "",
          isLocal: false
        }));
      }
      
      // Merge ensuring no duplicate names (simple check)
      const allMatches = [...localMatches];
      for (const gm of googleMatches) {
        if (!allMatches.find(lm => lm.name.toLowerCase() === gm.name.toLowerCase())) {
          allMatches.push(gm);
        }
      }
      
      setResults(allMatches);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAuthAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let currentUser = user;
    
    if (!currentUser) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
      } catch (err) {
        console.error("Login failed", err);
        alert("Authentication failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      // 1. Update User Document
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          role: "shop",
          applicationStatus: "pending",
          personalName: formData.personalName,
          phone: formData.phone,
          whatsapp: formData.whatsapp
        });
      } else {
        await setDoc(userRef, {
          name: currentUser.displayName || formData.personalName,
          email: currentUser.email,
          role: "shop",
          applicationStatus: "pending",
          personalName: formData.personalName,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          createdAt: new Date()
        });
      }

      // 2. Create/Update Shop Document
      // If it's an existing local shop, we claim it. If it's a new shop (Google Places or completely new), we create it using their UID.
      const shopId = (mode === 'claim_existing' && selectedPlace?.isLocal) ? selectedPlace.placeId : currentUser.uid;
      const shopRef = doc(db, "shops", shopId);
      
      const shopData = {
        shopName: mode === 'add_new' ? formData.shopName : selectedPlace?.name,
        address: mode === 'add_new' ? formData.shopAddress : selectedPlace?.address,
        ownerUid: currentUser.uid,
        status: "pending_admin_approval",
        isVerified: false,
        contactPhone: formData.phone,
        whatsappNumber: formData.whatsapp,
        ownerName: formData.personalName,
        createdAt: new Date()
      };
      
      if (mode === 'claim_existing' && !selectedPlace?.isLocal) {
        (shopData as any).googlePlaceId = selectedPlace?.placeId;
      }

      await setDoc(shopRef, shopData, { merge: true });

      setMode('success');
    } catch (err) {
      console.error("Claim Failed:", err);
      alert("Failed to process your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'success') {
    return (
      <div className="bg-[#0E1528] rounded-2xl p-12 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] text-center">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500 text-amber-500 text-3xl font-bold">
          !
        </div>
        <h2 className="text-3xl font-serif text-white mb-4">Application Received</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Your request has been submitted successfully and is currently <strong>Pending Admin Approval</strong>. <br/><br/>
          An administrator will call you at <strong>{formData.phone}</strong> shortly to verify your details. Once verified, you will be granted access to the dashboard.
        </p>
        <Link href="/" className="inline-block bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] font-bold px-8 py-4 rounded-xl transition-all">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-[#C5A059] mb-4">Claim Your Gold Shop</h1>
        <p className="text-slate-400">Join the Gold Dunia directory to manage your shop's online presence.</p>
      </div>

      {mode === 'search' && (
        <div className="bg-[#0E1528] rounded-2xl p-8 border border-[#2A344A] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={searchPlaces} className="relative z-10 flex gap-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your shop name..."
              className="flex-1 bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A1021] font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {results.length > 0 && (
            <div className="mt-8 space-y-4 relative z-10">
              <p className="text-sm text-[#C5A059] uppercase tracking-widest font-bold mb-4">Select your business</p>
              {results.map((place, idx) => (
                <div key={place.placeId + idx} className="flex items-center justify-between p-4 rounded-xl bg-[#141C33] border border-[#2A344A] hover:border-[#C5A059]/50 transition-colors cursor-pointer" onClick={() => { setSelectedPlace(place); setMode('claim_existing'); }}>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {place.name}
                      {place.isLocal && <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/30">Directory Match</span>}
                    </h3>
                    <p className="text-sm text-slate-400">{place.address}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                    →
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center relative z-10 pt-8 border-t border-[#2A344A]">
            <p className="text-slate-400 mb-4">Can't find your shop in the search results?</p>
            <button onClick={() => setMode('add_new')} className="bg-[#141C33] border border-[#2A344A] text-white hover:border-[#C5A059] px-6 py-3 rounded-xl transition-all">
              Add New Shop Manually
            </button>
          </div>
        </div>
      )}

      {(mode === 'claim_existing' || mode === 'add_new') && (
        <div className="bg-[#0E1528] rounded-2xl p-8 border border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.1)] relative overflow-hidden">
          {!directShopId && (
            <button onClick={() => { setSelectedPlace(null); setMode('search'); }} className="text-sm text-slate-400 hover:text-white mb-6">← Back to search</button>
          )}
          
          <div className="mb-8 pb-6 border-b border-[#2A344A]">
            {mode === 'claim_existing' ? (
              <>
                <h2 className="text-2xl font-bold text-white">{selectedPlace?.name}</h2>
                <p className="text-[#C5A059]">{selectedPlace?.address}</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Register New Shop</h2>
                <p className="text-slate-400 text-sm">Please provide your shop details to list it in our directory.</p>
              </>
            )}
          </div>

          <form onSubmit={handleAuthAndSubmit} className="space-y-6">
            
            {mode === 'add_new' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Shop Name</label>
                  <input type="text" required value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})} className="w-full bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors" placeholder="Enter shop name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Shop Address</label>
                  <input type="text" required value={formData.shopAddress} onChange={(e) => setFormData({...formData, shopAddress: e.target.value})} className="w-full bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors" placeholder="Enter complete address" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Your Full Name</label>
              <input type="text" required value={formData.personalName} onChange={(e) => setFormData({...formData, personalName: e.target.value})} className="w-full bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors" placeholder="Owner's personal name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors" placeholder="10-digit number" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp Number</label>
                <input type="tel" required value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-[#141C33] border border-[#2A344A] focus:border-[#C5A059] outline-none rounded-xl px-6 py-4 text-white placeholder-slate-500 transition-colors" placeholder="10-digit number" />
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C5A059] text-[#0A1021] hover:bg-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(197,160,89,0.4)] flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Processing..." : user ? "Submit Application" : "Sign in with Google to Apply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default function ClaimListingPage() {
  return (
    <div className="min-h-screen bg-[#0A1021] text-white font-sans selection:bg-[#C5A059]/30">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <Suspense fallback={<div className="text-center text-[#C5A059]">Loading...</div>}>
          <ClaimContent />
        </Suspense>
      </div>
    </div>
  );
}
