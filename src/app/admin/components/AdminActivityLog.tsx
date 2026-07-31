import React, { useState, useEffect } from 'react';
import { getRecentAdminActivities, AdminActivity } from '@/lib/firestore/admin_activities';
import { ShieldAlert, Clock, User, FileText } from 'lucide-react';

export default function AdminActivityLog() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getRecentAdminActivities();
      setActivities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities: { [date: string]: AdminActivity[] } = {};
  activities.forEach(act => {
    const dateObj = new Date(act.timestamp);
    const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!groupedActivities[dateStr]) groupedActivities[dateStr] = [];
    groupedActivities[dateStr].push(act);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Platform Activity Log
          </h3>
          <p className="text-sm text-gray-500 mt-1">Audit trail of all actions performed by staff in the Admin Panel.</p>
        </div>
        <button 
          onClick={fetchActivities}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh Log
        </button>
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
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-gray-900">{act.adminName} <span className="text-gray-400 font-normal">({act.adminEmail})</span></p>
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
                            {new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-red-600 mt-1">{act.action}</p>
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
