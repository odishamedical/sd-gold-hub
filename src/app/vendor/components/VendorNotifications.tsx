import React, { useState, useEffect } from 'react';
import { getShopNotifications, markNotificationRead, ShopNotification } from '@/lib/firestore/notifications';
import { Bell, CheckCircle, Info, XCircle, AlertCircle } from 'lucide-react';

export default function VendorNotifications({ shopId }: { shopId: string }) {
  const [notifications, setNotifications] = useState<ShopNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      if (!shopId) return;
      const data = await getShopNotifications(shopId);
      setNotifications(data.filter(n => !n.isRead)); // Only show unread notifications in this banner
      setLoading(false);
    }
    loadNotifs();
  }, [shopId]);

  const handleDismiss = async (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    await markNotificationRead(id);
  };

  if (loading || notifications.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {notifications.map(notification => {
        let bgColor = 'bg-blue-50';
        let borderColor = 'border-blue-200';
        let textColor = 'text-blue-800';
        let Icon = Info;
        
        if (notification.type === 'approved') {
          bgColor = 'bg-green-50';
          borderColor = 'border-green-200';
          textColor = 'text-green-800';
          Icon = CheckCircle;
        } else if (notification.type === 'rejected') {
          bgColor = 'bg-red-50';
          borderColor = 'border-red-200';
          textColor = 'text-red-800';
          Icon = XCircle;
        } else if (notification.type === 'info_requested') {
          bgColor = 'bg-yellow-50';
          borderColor = 'border-yellow-200';
          textColor = 'text-yellow-800';
          Icon = AlertCircle;
        }

        return (
          <div key={notification.id} className={`flex items-start justify-between p-4 rounded-xl border shadow-sm ${bgColor} ${borderColor}`}>
            <div className={`flex gap-3 ${textColor}`}>
              <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wide">
                  {notification.type === 'info_requested' ? 'Action Required' : 'Admin Notice'}
                </h4>
                <p className="text-sm font-medium opacity-90">{notification.message}</p>
              </div>
            </div>
            <button 
              onClick={() => notification.id && handleDismiss(notification.id)}
              className={`text-sm font-bold opacity-60 hover:opacity-100 transition-opacity ${textColor}`}
            >
              Dismiss
            </button>
          </div>
        );
      })}
    </div>
  );
}
