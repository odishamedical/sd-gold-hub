"use client";

import { useState, useEffect } from "react";

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  country: string | null;
  error: string | null;
  loading: boolean;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    city: null,
    state: null,
    country: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      setLocation((prev) => ({ ...prev, loading: false }));
      return;
    }

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      }));
      return;
    }

    // Try to get from local storage first to avoid asking repeatedly if already asked
    const cachedLoc = localStorage.getItem("sd_user_location");
    if (cachedLoc) {
      try {
        const parsed = JSON.parse(cachedLoc);
        // Only use cache if it's less than 24 hours old
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setLocation({
            ...parsed,
            loading: false,
          });
          return;
        }
      } catch (e) {
        console.error("Error parsing cached location", e);
      }
    }

    const successCallback = async (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        // Reverse Geocoding using Nominatim (OpenStreetMap) - free API
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        const city = data.address.city || data.address.town || data.address.village || null;
        const state = data.address.state || null;
        const country = data.address.country || null;

        const locData = {
          latitude: lat,
          longitude: lng,
          city,
          state,
          country,
          error: null,
          loading: false,
          timestamp: Date.now()
        };

        setLocation(locData);
        localStorage.setItem("sd_user_location", JSON.stringify(locData));
      } catch (error) {
        console.error("Reverse geocoding failed", error);
        const locData = {
          latitude: lat,
          longitude: lng,
          city: null,
          state: null,
          country: null,
          error: "Reverse geocoding failed",
          loading: false,
          timestamp: Date.now()
        };
        setLocation(locData);
        localStorage.setItem("sd_user_location", JSON.stringify(locData));
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMsg = "An unknown error occurred.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMsg = "The request to get user location timed out.";
          break;
      }
      setLocation((prev) => ({ ...prev, error: errorMsg, loading: false }));
    };

    // Prompt user for location. 
    // Usually it's better to trigger this on a button click, but we can do it on mount if requested.
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  return location;
}
