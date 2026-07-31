import { db } from './firebase';
import { collection, doc, setDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';

export async function logShopActivity(
  shopId: string, 
  actorName: string, 
  actorEmail: string, 
  action: string, 
  details: string
) {
  if (!shopId || shopId === 'test_vendor') return;

  try {
    const timestamp = Date.now();
    const activityId = timestamp.toString() + '-' + Math.random().toString(36).substr(2, 5);
    
    const activityRef = doc(db, 'shops', shopId, 'activities', activityId);
    
    await setDoc(activityRef, {
      id: activityId,
      shopId,
      actorName,
      actorEmail,
      action,
      details,
      timestamp
    });

    // Fire and forget pruning of old logs
    pruneOldActivities(shopId);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

async function pruneOldActivities(shopId: string) {
  try {
    // 90 days ago in milliseconds
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    
    const activitiesRef = collection(db, 'shops', shopId, 'activities');
    const q = query(activitiesRef, where('timestamp', '<', ninetyDaysAgo));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Failed to prune old activities:", error);
  }
}
