'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CustomerProfile } from '@/types/gold-hub';
import { 
  getCustomerProfile, 
  upsertCustomerProfile, 
  saveProductToWishlist, 
  removeProductFromWishlist, 
  followShop, 
  unfollowShop 
} from '@/lib/firestore/customers';

import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from '@/lib/firebase';

interface CustomerContextType {
  profile: CustomerProfile | null;
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  toggleFollowShop: (shopId: string) => Promise<void>;
  isProductSaved: (productId: string) => boolean;
  isShopFollowed: (shopId: string) => boolean;
  loginDemo: () => Promise<void>; // we'll keep the name loginDemo for compatibility but it will do real login
  logout: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure profile exists in Firestore
        await upsertCustomerProfile(user.uid, {
          name: user.displayName || "Customer",
          email: user.email || "",
        });
        const p = await getCustomerProfile(user.uid);
        if (p) setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginDemo = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const toggleWishlist = async (productId: string) => {
    if (!profile) return;
    const isSaved = profile.savedProducts.includes(productId);
    
    // Optimistic UI update
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        savedProducts: isSaved 
          ? prev.savedProducts.filter(id => id !== productId)
          : [...prev.savedProducts, productId]
      };
    });

    try {
      if (isSaved) {
        await removeProductFromWishlist(profile.id, productId);
      } else {
        await saveProductToWishlist(profile.id, productId);
      }
    } catch (e) {
      console.error(e);
      // Revert on failure
      const p = await getCustomerProfile(profile.id);
      if (p) setProfile(p);
    }
  };

  const toggleFollowShop = async (shopId: string) => {
    if (!profile) return;
    const isFollowed = profile.followedShops.includes(shopId);
    
    // Optimistic UI update
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        followedShops: isFollowed 
          ? prev.followedShops.filter(id => id !== shopId)
          : [...prev.followedShops, shopId]
      };
    });

    try {
      if (isFollowed) {
        await unfollowShop(profile.id, shopId);
      } else {
        await followShop(profile.id, shopId);
      }
    } catch (e) {
      console.error(e);
      // Revert on failure
      const p = await getCustomerProfile(profile.id);
      if (p) setProfile(p);
    }
  };

  const isProductSaved = (productId: string) => profile?.savedProducts.includes(productId) || false;
  const isShopFollowed = (shopId: string) => profile?.followedShops.includes(shopId) || false;

  return (
    <CustomerContext.Provider value={{ profile, loading, toggleWishlist, toggleFollowShop, isProductSaved, isShopFollowed, loginDemo, logout }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
