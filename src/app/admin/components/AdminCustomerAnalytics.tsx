import React, { useState, useEffect } from 'react';
import { getGlobalCustomerActivities, CustomerActivityLog } from '@/lib/firestore/customer_activity';
import { Activity, Search, Eye, Store, User, Clock, FileText } from 'lucide-react';

export default function AdminCustomerAnalytics() {
  const [activities, setActivities] = useState<CustomerActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const logs = await getGlobalCustomerActivities(200);
      setActivities(logs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'SEARCH': return <Search className="w-5 h-5 text-purple-600" />;
      case 'VIEW_PRODUCT': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'VIEW_SHOP': return <Store className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'SEARCH': return "bg-purple-100 border-purple-200 text-purple-800";
      case 'VIEW_PRODUCT': return "bg-blue-100 border-blue-200 text-blue-800";
      case 'VIEW_SHOP': return "bg-green-100 border-green-200 text-green-800";
      default: return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex justify-center h-full items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)] relative">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#C5A059]" />
            Customer Analytics & Browsing History
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real-time telemetry of what logged-in users are searching for and viewing.</p>
        </div>
        <button 
          onClick={fetchAnalytics}
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
            <p className="text-gray-500 font-medium">No recent customer activity found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(act => (
              <div key={act.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(act.actionType)} border bg-opacity-30`}>
                  {getActivityIcon(act.actionType)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {act.customerName}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {act.customerPhone || 'No Phone'} • {act.customerEmail || 'No Email'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
                      {new Date(act.timestamp?.seconds * 1000).toLocaleString('en-IN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className={`mt-3 p-3 rounded-lg border flex flex-col gap-1.5 ${getActivityColor(act.actionType)}`}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">{act.actionType.replace('_', ' ')}</p>
                    <p className="text-sm font-semibold flex items-start gap-1.5">
                      <FileText className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                      {act.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
