import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collectionGroup, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ShopActivity } from '@/types/gold-hub';
import { Activity, Clock, FileText, User } from 'lucide-react';

export default function GlobalVendorActivities() {
  const [activities, setActivities] = useState<ShopActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalActivities();
  }, []);

  const fetchGlobalActivities = async () => {
    setLoading(true);
    try {
      // Use collectionGroup to fetch activities from all 'activities' subcollections
      const q = query(
        collectionGroup(db, 'activities'),
        orderBy('timestamp', 'desc'),
        limit(200) // fetch up to 200 recent actions across all vendors
      );
      
      const snap = await getDocs(q);
      const acts: ShopActivity[] = snap.docs.map(doc => doc.data() as ShopActivity);
      setActivities(acts);
    } catch (e) {
      console.error("Error fetching global vendor activities:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex justify-center h-full items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities: { [date: string]: ShopActivity[] } = {};
  activities.forEach(act => {
    const dateObj = new Date(act.timestamp);
    const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!groupedActivities[dateStr]) groupedActivities[dateStr] = [];
    groupedActivities[dateStr].push(act);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Global Vendor Activity Feed
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real-time oversight of all vendor actions across the platform.</p>
        </div>
        <button 
          onClick={fetchGlobalActivities}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh Feed
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {activities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-gray-500 font-medium">No recent vendor activity found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedActivities).map(dateStr => (
              <div key={dateStr}>
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm py-2 mb-4">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{dateStr}</h4>
                </div>
                <div className="space-y-4">
                  {groupedActivities[dateStr].map(act => (
                    <div key={act.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {act.actorName} <span className="text-gray-400 font-normal">({act.actorEmail})</span>
                            </p>
                            <p className="text-xs text-blue-600 font-medium mt-0.5">Shop ID: {act.shopId}</p>
                          </div>
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
                            {new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-blue-800 mt-2">{act.action}</p>
                        <p className="text-sm text-gray-600 flex items-start gap-1.5 bg-white p-3 rounded-lg border border-gray-100 mt-2">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          {act.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
