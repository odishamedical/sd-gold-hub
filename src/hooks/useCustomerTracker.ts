import { useEffect } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { logCustomerActivity, CustomerActionType } from '@/lib/firestore/customer_activity';

let cachedIp: string | null = null;

export function useCustomerTracker() {
  const { profile } = useCustomer();

  const trackAction = async (actionType: CustomerActionType, details: string, metadata: Record<string, any> = {}) => {
    if (profile) {
      try {
        if (!cachedIp) {
          try {
            const res = await fetch('/api/get-ip');
            const data = await res.json();
            cachedIp = data.ip;
          } catch(e) {
            cachedIp = "Unknown IP";
          }
        }
        
        await logCustomerActivity(profile, actionType, details, { ...metadata, ipAddress: cachedIp });
      } catch (error) {
        console.error("Failed to track activity:", error);
      }
    }
  };

  return { trackAction };
}

// Helper hook to automatically track page views on mount
export function useTrackPageView(
  actionType: CustomerActionType, 
  details: string, 
  metadata: Record<string, any> = {},
  dependencies: any[] = [] // Optional dependencies if details/metadata load asynchronously
) {
  const { trackAction } = useCustomerTracker();
  const { profile } = useCustomer();

  useEffect(() => {
    // Only track once the dependencies are truthy and profile is loaded
    if (profile && details) {
      trackAction(actionType, details, metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, ...dependencies]);
}
