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

interface CustomerContextType {
  profile: CustomerProfile | null;
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  toggleFollowShop: (shopId: string) => Promise<void>;
  isProductSaved: (productId: string) => boolean;
  isShopFollowed: (shopId: string) => boolean;
  loginDemo: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // In a real app, this would tie into Firebase Auth state.
  // For this demo, we'll auto-login a demo user or load from local storage.
  useEffect(() => {
    async function loadProfile() {
      const demoUid = typeof window !== "undefined" ? localStorage.getItem("sd_customer_id") : null;
      if (demoUid) {
        const p = await getCustomerProfile(demoUid);
        if (p) setProfile(p);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const loginDemo = async () => {
    const demoUid = "demo_customer_123";
    localStorage.setItem("sd_customer_id", demoUid);
    await upsertCustomerProfile(demoUid, {
      name: "Demo Buyer",
      email: "buyer@demo.com",
    });
    const p = await getCustomerProfile(demoUid);
    if (p) setProfile(p);
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
    <CustomerContext.Provider value={{ profile, loading, toggleWishlist, toggleFollowShop, isProductSaved, isShopFollowed, loginDemo }}>
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
