"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useUserLocation, UserLocation } from "@/hooks/useUserLocation";

const LocationContext = createContext<UserLocation | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const location = useUserLocation();

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
}
