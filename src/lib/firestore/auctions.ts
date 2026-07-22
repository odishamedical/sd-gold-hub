import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  addDoc,
  updateDoc,
  query, 
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { Auction, Bid } from "../../types/gold-hub";

const AUCTIONS_COLLECTION = "auctions";

/**
 * Fetch all auctions
 */
export async function getAuctions(): Promise<Auction[]> {
  try {
    const auctionsRef = collection(db, AUCTIONS_COLLECTION);
    const snapshot = await getDocs(auctionsRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Auction));
    }
  } catch (error) {
    console.warn("Failed to fetch auctions from firestore:", error);
  }
  return [];
}

/**
 * Create a new auction
 */
export async function createAuction(auctionData: Omit<Auction, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const auctionsRef = collection(db, AUCTIONS_COLLECTION);
  const docRef = doc(auctionsRef);
  
  await setDoc(docRef, {
    ...auctionData,
    id: docRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
}

/**
 * Place a bid on an auction
 */
export async function placeBid(auctionId: string, bidData: Omit<Bid, "id" | "auctionId" | "timestamp">): Promise<void> {
  const auctionRef = doc(db, AUCTIONS_COLLECTION, auctionId);
  const bidsRef = collection(auctionRef, "bids");
  
  // 1. Fetch current auction to verify bid is valid
  const auctionSnap = await getDoc(auctionRef);
  if (!auctionSnap.exists()) throw new Error("Auction not found");
  
  const auction = auctionSnap.data() as Auction;
  
  const now = Date.now();
  if (now > auction.endTime || auction.status === 'closed') {
    throw new Error("This auction has closed.");
  }
  if (now < auction.startTime || auction.status === 'upcoming') {
    throw new Error("This auction has not started yet.");
  }
  
  const minRequired = auction.currentBid + auction.minIncrement;
  if (bidData.amount < minRequired) {
    throw new Error(`Minimum bid required is ₹ ${minRequired.toLocaleString('en-IN')}`);
  }

  // 2. Add bid to subcollection
  await addDoc(bidsRef, {
    ...bidData,
    auctionId,
    timestamp: Date.now() // Note: client timestamp for sorting purposes
  });

  // 3. Update main auction document
  await updateDoc(auctionRef, {
    currentBid: bidData.amount,
    totalBids: auction.totalBids + 1,
    updatedAt: serverTimestamp()
  });
}

/**
 * Listen to live auctions and their bids
 * Returns an unsubscribe function
 */
export function listenToAuctions(callback: (auctions: (Auction & { history: Bid[] })[]) => void): () => void {
  const auctionsRef = collection(db, AUCTIONS_COLLECTION);
  
  return onSnapshot(auctionsRef, async (snapshot) => {
    const activeAuctions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Auction));
    
    // For each auction, also fetch the latest bids
    const auctionsWithHistory = await Promise.all(activeAuctions.map(async (auc) => {
      try {
        const bidsRef = collection(db, AUCTIONS_COLLECTION, auc.id, "bids");
        const bidsQuery = query(bidsRef, orderBy("amount", "desc"), limit(10));
        const bidsSnap = await getDocs(bidsQuery);
        const history = bidsSnap.docs.map(b => ({ id: b.id, ...b.data() } as Bid));
        return { ...auc, history };
      } catch (e) {
         console.warn("Failed to fetch bids for auc", auc.id, e);
         return { ...auc, history: [] };
      }
    }));
    
    callback(auctionsWithHistory);
  }, (error) => {
    console.error("Error listening to auctions:", error);
  });
}
