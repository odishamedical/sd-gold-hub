export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  desc: string;
  longDesc?: string;
  price: string;
  mrp?: string;
  
  // Gold Hub Specific Fields
  metalType?: "Gold" | "Silver" | "Platinum" | "Diamond" | "Artificial";
  purity?: string; // e.g. "22K", "18K", "92.5"
  grossWeight?: string; // e.g. "15.5g"
  netWeight?: string; // e.g. "14.2g"
  makingCharges?: string; // e.g. "8%" or "₹1500/g"
  stoneDetails?: string; // e.g. "VVS1 Diamonds, Ruby drops"
  certification?: string; // e.g. "BIS Hallmark", "IGI Certified"
  
  // Logistics & Status
  inStock: boolean;
  stockQuantity?: number;
  sellerId?: string; // Links product to a specific Shop
  sellerType?: "retail" | "wholesale" | "franchise";
  storeName?: string;
  status?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  
  // Media
  img: string; // Primary image
  img2?: string;
  img3?: string;
  img4?: string;
  images?: string[];
  imageCaptions?: string[];
  youtubeUrl?: string;
  
  // Marketplace Features
  rating?: string;
  allowWholesale?: boolean;
  wholesalePrice?: string;
  minimumOrderQuantity?: number;
}
