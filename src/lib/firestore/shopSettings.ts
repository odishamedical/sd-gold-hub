import { db } from "../firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

export type MetalRate = { id: string; name: string; rate: number; isDefault?: boolean };
export type MakingCharge = { id: string; name: string; type: 'percentage' | 'per_gram' | 'flat'; value: number; isDefault?: boolean };

export interface ShopSettings {
  metals: MetalRate[];
  makingCharges: MakingCharge[];
  gstRate: number;
  huidFee: number;
  updatedAt?: any;
}

const DEFAULT_METALS: MetalRate[] = [
  { id: 'm1', name: '24K Pure Gold', rate: 7850, isDefault: true },
  { id: 'm2', name: '22K Standard Gold', rate: 7250, isDefault: true },
  { id: 'm3', name: '18K Rose/White Gold', rate: 5850, isDefault: true },
  { id: 'm4', name: '999 Fine Silver', rate: 85, isDefault: true },
  { id: 'm5', name: '925 Sterling Silver', rate: 78, isDefault: true }
];

const DEFAULT_CHARGES: MakingCharge[] = [
  { id: 'c1', name: 'Casting', type: 'percentage', value: 10, isDefault: true },
  { id: 'c2', name: 'Fancy', type: 'percentage', value: 12, isDefault: true },
  { id: 'c3', name: 'Dubai', type: 'percentage', value: 15, isDefault: true },
  { id: 'c4', name: 'Manipuri', type: 'percentage', value: 16, isDefault: true },
  { id: 'c5', name: 'Kataki', type: 'percentage', value: 18, isDefault: true },
  { id: 'c6', name: 'Rajastani', type: 'percentage', value: 20, isDefault: true },
  { id: 'c7', name: 'Basic Silver', type: 'per_gram', value: 50, isDefault: true }
];

export async function getShopSettings(shopId: string): Promise<ShopSettings> {
  if (!shopId) throw new Error("shopId is required");
  
  try {
    const docRef = doc(db, `shops/${shopId}/settings`, "pricing");
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      return snap.data() as ShopSettings;
    }
  } catch (error) {
    console.warn("Failed to fetch shop settings from firestore, returning mock:", error);
  }

  // Return default settings if doc doesn't exist or if Firestore fails
  return {
    metals: DEFAULT_METALS,
    makingCharges: DEFAULT_CHARGES,
    gstRate: 3,
    huidFee: 45
  };
}

export async function updateShopSettings(shopId: string, updates: Partial<ShopSettings>): Promise<void> {
  if (!shopId) throw new Error("shopId is required");
  const docRef = doc(db, `shops/${shopId}/settings`, "pricing");
  
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  } else {
    // Initial creation
    const current = await getShopSettings(shopId); // Get defaults
    await setDoc(docRef, { ...current, ...updates, updatedAt: serverTimestamp() });
  }
}
