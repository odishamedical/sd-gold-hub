"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";

export default function SsoBridge() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        // We received a Custom Token from SD Auth Center!
        // We might have a mock token prefix for local testing without Firebase Admin
        if (token.startsWith("mock_token_")) {
          const uid = token.replace("mock_token_", "");
          localStorage.setItem("sd_current_user_uid", uid);
          localStorage.setItem("sd_current_user_role", "user");
          window.dispatchEvent(new Event("sd_auth_change"));
          
          // Clean the URL
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } else {
          // It's a real Firebase Custom Token!
          signInWithCustomToken(auth, token)
            .then((userCredential) => {
              const user = userCredential.user;
              localStorage.setItem("sd_current_user_email", user.email || "");
              localStorage.setItem("sd_current_user_name", user.displayName || "");
              localStorage.setItem("sd_current_user_uid", user.uid);
              window.dispatchEvent(new Event("sd_auth_change"));

              // Clean the URL
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            })
            .catch((error) => {
              console.error("SSO Token Bridge Failed:", error);
            });
        }
      }
    }
  }, []);

  return null;
}
