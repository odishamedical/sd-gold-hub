export interface LocationHierarchy {
  country: string;
  state: string;
  district: string;
  block: string;
  pincode?: string;
  lat?: number;
  lng?: number;
}

export interface Shop {
  id: string;
  ownerUid?: string; // Firebase Auth UID if claimed
  isVerified: boolean;
  name: string;
  description?: string;
  address: string;
  location: LocationHierarchy;
  phone?: string;
  whatsappNumber?: string;
  googlePlaceId?: string;
  coverImages: string[]; // Up to 4 images
  logoUrl?: string;
  businessHours?: string;
  subscriptionTier: 'FREE' | 'BASIC' | 'PRO' | 'ELITE';
  rating?: number;
  createdAt: number;
  updatedAt: number;
}

export interface LiveGoldRate {
  shopId: string;
  rate24K: number; // Price per gram
  rate22K: number; // Price per gram
  rate18K?: number; // Optional, can be auto-calculated
  lastUpdated: number; // Timestamp for 48h warning
}

export interface Product {
  id: string;
  shopId: string;
  categoryId: string; // e.g. "Neck Jewellery"
  subcategoryId: string; // e.g. "Necklace"
  designName: string; // From Global Pricing Engine
  customDesignName?: string;
  title: string; // Marketing title (e.g. "22K Antique Temple Necklace")
  description: string;
  metalPurityId: string;
  makingChargeId: string;
  images: string[]; // Minimum 4 images enforced in UI
  price: number;
  weightGrams?: number;
  stoneDetails?: {
    hasStones: boolean;
    type?: string; // e.g. "Kundan", "Polki", "Diamond"
    price?: number; // Total stone price
    weightGrams?: number;
  };
  status: 'active' | 'draft';
  createdAt: any;
  updatedAt: any;
}

export interface SubscriptionBilling {
  id: string;
  shopId: string;
  razorpaySubscriptionId: string;
  tier: 'BASIC' | 'PRO' | 'ELITE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
  currentPeriodStart: number;
  currentPeriodEnd: number;
}

export interface AdminVerificationTicket {
  id: string;
  shopId: string;
  ownerUid: string;
  gstDocumentUrl: string;
  tradeLicenseUrl?: string;
  telephonicCallDone: boolean;
  videoCallDone: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CustomerProfile {
  id: string; // Firebase Auth UID
  name: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  email: string;
  savedProducts: string[]; // array of Product IDs
  followedShops: string[]; // array of Shop IDs
  createdAt: number;
  updatedAt: number;
}
