"use client";

import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    // Determine the base URL of Gold Hub (e.g. localhost:3002 or golddunia.com)
    const goldHubUrl = window.location.origin;
    
    // Auth Center URL (default to localhost for dev if not set)
    const authCenterUrl = process.env.NEXT_PUBLIC_AUTH_CENTER_URL || "http://localhost:3000";
    
    // Construct the callback URL
    const callbackUri = `${goldHubUrl}/auth/callback`;
    
    // Redirect to Auth Center SSO
    window.location.href = `${authCenterUrl}/?redirect_uri=${encodeURIComponent(callbackUri)}`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
      <div className="text-center animate-pulse">
        <h2 className="text-2xl font-bold mb-2">Redirecting to Secure Auth...</h2>
        <p className="text-gray-400">Please wait while we connect to the Central Authentication System.</p>
      </div>
    </div>
  );
}
