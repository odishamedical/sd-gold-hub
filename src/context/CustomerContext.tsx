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

import { auth, googleProvider, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged } from '@/lib/firebase';
import CompleteProfileModal from '@/components/CompleteProfileModal';

interface CustomerContextType {
  profile: CustomerProfile | null;
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  toggleFollowShop: (shopId: string) => Promise<void>;
  isProductSaved: (productId: string) => boolean;
  isShopFollowed: (shopId: string) => boolean;
  loginDemo: () => Promise<void>; 
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<CustomerProfile>) => Promise<void>;
  requireCompleteProfile: (callback: () => void) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Check for admin impersonation
    const impersonatedId = typeof window !== "undefined" ? localStorage.getItem("admin_impersonating_customer") : null;
    if (impersonatedId) {
      getCustomerProfile(impersonatedId).then(p => {
        if (p) {
          setProfile(p);
        } else {
           setProfile(null);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load impersonated profile:", err);
        setProfile(null);
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Ensure profile exists in Firestore
          await upsertCustomerProfile(user.uid, {
            name: user.displayName || "Customer",
            email: user.email || "",
          });
          const p = await getCustomerProfile(user.uid);
          if (p) {
            setProfile(p);
            // If profile is missing important data, prompt them but allow skipping
            if (!p.phone || !p.whatsapp || !p.city) {
              setShowProfileModal(true);
            }
          }
        } catch (err) {
          console.error("Failed to load customer profile:", err);
          setProfile(null);
        }
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
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.error("Login failed", e);
      }
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const updateProfileData = async (data: Partial<CustomerProfile>) => {
    if (!profile) return;
    
    // Optimistic UI update
    setProfile(prev => prev ? { ...prev, ...data } : prev);
    
    try {
      await upsertCustomerProfile(profile.id, data);
      const p = await getCustomerProfile(profile.id);
      if (p) setProfile(p);
    } catch (e) {
      console.error("Failed to update profile", e);
      // Revert on failure
      const p = await getCustomerProfile(profile.id);
      if (p) setProfile(p);
      throw e;
    }
  };

  const requireCompleteProfile = (callback: () => void) => {
    if (!profile) {
      // If not logged in, trigger login demo? Actually this should be handled by the caller,
      // but just in case, we can require login.
      loginDemo();
      return;
    }
    if (!profile.phone || !profile.whatsapp || !profile.city) {
      setPendingAction(() => callback);
      setShowProfileModal(true);
    } else {
      callback();
    }
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
    <CustomerContext.Provider value={{ 
      profile, 
      loading, 
      toggleWishlist, 
      toggleFollowShop, 
      isProductSaved, 
      isShopFollowed, 
      loginDemo, 
      logout,
      updateProfileData,
      requireCompleteProfile,
      showProfileModal,
      setShowProfileModal,
      pendingAction,
      setPendingAction
    }}>
      {children}
      {showProfileModal && (
        <CompleteProfileModal 
          onClose={() => {
            setShowProfileModal(false);
            setPendingAction(null);
          }}
          allowSkip={pendingAction === null} // only allow skip if it wasn't triggered by a required action
          onSuccess={() => {
            setShowProfileModal(false);
            if (pendingAction) {
              pendingAction();
              setPendingAction(null);
            }
          }}
        />
      )}
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
