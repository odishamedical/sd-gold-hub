"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, increment } from "firebase/firestore";
import { AdCampaign } from "@/types/cms";

export function useBanners() {
  const [banners, setBanners] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const q = query(collection(db, "ad_campaigns"), where("status", "==", "active"));
        const snap = await getDocs(q);
        const data: AdCampaign[] = [];
        snap.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() } as AdCampaign);
        });
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
      setLoading(false);
    }
    fetchBanners();
  }, []);

  const getBannersForPlacement = (
    placement: AdCampaign["placement"],
    context: { 
      audience: "shops" | "products" | "global"; 
      specificId?: string;
      category?: string;
      material?: string;
      design?: string;
      userLocation?: { city?: string | null; state?: string | null };
      shopVerificationStatus?: "verified" | "unverified";
      shopLocation?: { district?: string | null; city?: string | null; state?: string | null; address?: string | null };
    }
  ) => {
    return banners.filter(b => {
      if (b.placement !== placement) return false;
      
      if (b.targetAudience === "global") return true;
      if (b.targetAudience !== context.audience) return false;

      // It's the correct audience. Check specific ID targeting.
      if (!b.targetSpecificIds.includes("all")) {
        if (!context.specificId || !b.targetSpecificIds.includes(context.specificId)) return false;
      }

      // If audience is products, check granular filters
      if (b.targetAudience === "products") {
        if (b.targetCategory && b.targetCategory !== "all" && b.targetCategory !== context.category) return false;
        if (b.targetMaterial && b.targetMaterial !== "all" && b.targetMaterial !== context.material) return false;
        if (b.targetDesign && b.targetDesign !== "all" && b.targetDesign !== context.design) return false;
      }

      // Check Verification Status (for shops)
      if (b.targetVerificationStatus && b.targetVerificationStatus !== "all") {
        if (!context.shopVerificationStatus) return false;
        if (b.targetVerificationStatus !== context.shopVerificationStatus) return false;
      }

      // Check Location targeting
      if (b.targetLocation && b.targetLocation !== "all") {
        const adLoc = b.targetLocation.toLowerCase();
        
        // If targeting shops, check shop location
        if (context.audience === "shops" && context.shopLocation) {
           const shopCityMatch = context.shopLocation.city && adLoc.includes(context.shopLocation.city.toLowerCase());
           const shopDistrictMatch = context.shopLocation.district && adLoc.includes(context.shopLocation.district.toLowerCase());
           const shopStateMatch = context.shopLocation.state && adLoc.includes(context.shopLocation.state.toLowerCase());
           const shopAddressMatch = context.shopLocation.address && context.shopLocation.address.toLowerCase().includes(adLoc);
           if (!shopCityMatch && !shopDistrictMatch && !shopStateMatch && !shopAddressMatch) return false;
        } 
        // Otherwise check user location
        else if (context.userLocation) {
          const cityMatch = context.userLocation.city && adLoc.includes(context.userLocation.city.toLowerCase());
          const stateMatch = context.userLocation.state && adLoc.includes(context.userLocation.state.toLowerCase());
          if (!cityMatch && !stateMatch) return false;
        } else {
          return false; // Requires location but none provided
        }
      }

      return true;
    });
  };

  const trackClick = async (bannerId: string) => {
    try {
      await updateDoc(doc(db, "ad_campaigns", bannerId), {
        clicks: increment(1)
      });
    } catch (e) {
      console.error("Error tracking click", e);
    }
  };

  const trackImpression = async (bannerId: string) => {
    try {
      const b = banners.find(x => x.id === bannerId);
      if (!b) return;
      
      const newImpressions = b.impressions + 1;
      const updates: any = { impressions: increment(1) };
      
      // Auto-pause if hit limit
      if (b.impressionLimit && newImpressions >= b.impressionLimit) {
        updates.status = "paused";
        // Also update local state so it hides immediately
        setBanners(prev => prev.filter(x => x.id !== bannerId));
      }
      
      await updateDoc(doc(db, "ad_campaigns", bannerId), updates);
    } catch (e) {
      console.error("Error tracking impression", e);
    }
  };

  return { banners, loading, getBannersForPlacement, trackClick, trackImpression };
}
