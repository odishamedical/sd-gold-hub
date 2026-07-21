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
  title: string;
  description: string;
  huid: string; // Mandatory Government HUID
  karat: '24K' | '22K' | '18K' | '14K';
  grossWeightGrams: number;
  netWeightGrams: number;
  makingChargeType: 'FLAT' | 'PERCENTAGE' | 'PER_GRAM';
  makingChargeValue: number;
  gemstoneValue?: number;
  images: string[];
  category: string;
  createdAt: number;
  updatedAt: number;
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
