import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { PageLayout } from "@/types/gold-hub";

const COLLECTION_NAME = "page_layouts";

export async function getPageLayout(pageId: "HOME" | "DIRECTORY" | "JEWELLERY"): Promise<PageLayout | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as PageLayout;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching page layout for ${pageId}:`, error);
    return null;
  }
}

export async function savePageLayout(layout: PageLayout): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, layout.pageId);
    await setDoc(docRef, {
      ...layout,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error saving page layout for ${layout.pageId}:`, error);
    return false;
  }
}
