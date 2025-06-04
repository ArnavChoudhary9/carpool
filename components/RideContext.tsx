import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LatLng = { lat: number; lng: number } | null;

interface RideContextType {
  pickup: string;
  setPickup: (val: string) => void;
  dropoff: string;
  setDropoff: (val: string) => void;
  pickupLatLng: LatLng;
  setPickupLatLng: (val: LatLng) => void;
  dropoffLatLng: LatLng;
  setDropoffLatLng: (val: LatLng) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error('useRide must be used within a RideProvider');
  return ctx;
}

export function RideProvider({ children }: { children: ReactNode }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupLatLng, setPickupLatLng] = useState<LatLng>(null);
  const [dropoffLatLng, setDropoffLatLng] = useState<LatLng>(null);

  return (
    <RideContext.Provider value={{
      pickup, setPickup,
      dropoff, setDropoff,
      pickupLatLng, setPickupLatLng,
      dropoffLatLng, setDropoffLatLng
    }}>
      {children}
    </RideContext.Provider>
  );
}
