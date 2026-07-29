"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function CallbackLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying token...");

  useEffect(() => {
    const token = searchParams.get("token");
    const ssoEmail = searchParams.get("sso_email");
    const ssoName = searchParams.get("sso_name");
    const ssoRole = searchParams.get("sso_role");

    if (!token) {
      setStatus("Error: No authentication token found.");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    const authenticate = async () => {
      try {
        // Sign in with the Custom Token provided by Auth Center
        const userCredential = await signInWithCustomToken(auth, token);
        const user = userCredential.user;

        setStatus("Authentication successful! Loading your profile...");

        // Ensure user document exists in Gold Hub's local Firestore if needed
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: ssoEmail || user.email,
            name: ssoName || user.displayName || "User",
            role: ssoRole || "customer",
            createdAt: new Date().toISOString()
          }, { merge: true });
        }

        // Redirect to dashboard or previous page
        setTimeout(() => router.push("/dashboard"), 1000);

      } catch (error: any) {
        console.error("SSO Callback Error:", error);
        setStatus("Authentication failed: " + error.message);
      }
    };

    authenticate();
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Secure SSO Login</h2>
      <p className="text-gray-400">{status}</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
      <Suspense fallback={
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Secure SSO Login</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      }>
        <CallbackLogic />
      </Suspense>
    </div>
  );
}
