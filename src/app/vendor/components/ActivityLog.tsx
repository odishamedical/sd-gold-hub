import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { ShopActivity } from '@/types/gold-hub';
import { Activity, Clock, User, FileText } from 'lucide-react';

export default function ActivityLog({ shopId }: { shopId: string }) {
  const [activities, setActivities] = useState<ShopActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'shops', shopId, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const acts: ShopActivity[] = [];
      snapshot.forEach(doc => {
        acts.push(doc.data() as ShopActivity);
      });
      setActivities(acts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [shopId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex justify-center">
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C5A059]" />
              Staff Activity Log
            </h3>
            <p className="text-sm text-gray-500 mt-1">Audit trail of all actions performed by you and your staff (kept for 90 days).</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-gray-500 font-medium">No recent activity found.</p>
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
                          <p className="text-sm font-bold text-gray-900">{act.actorName} <span className="text-gray-400 font-normal">({act.actorEmail})</span></p>
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
                            {new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-blue-600 mt-1">{act.action}</p>
                        <p className="text-sm text-gray-600 mt-1 flex items-start gap-1.5">
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
