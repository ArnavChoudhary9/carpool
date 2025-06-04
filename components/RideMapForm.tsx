'use client';

import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import Map from "@/components/map";
import UserRideForm from "@/components/UserRideForm";
import { useState, useEffect } from "react";

export default function RideMapForm() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const [pickupLatLng, setPickupLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffLatLng, setDropoffLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const fetchLatLng = async (address: string, setLatLng: (latLng: { lat: number; lng: number } | null) => void) => {
    if (!address) {
      setLatLng(null);
      return;
    }
    try {
      const res = await fetch(`/api/geocode/forward?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLatLng({ lat, lng });
      } else {
        setLatLng(null);
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
      setLatLng(null);
    }
  };

  useEffect(() => {
    fetchLatLng(pickup, setPickupLatLng);
  }, [pickup]);

  useEffect(() => {
    fetchLatLng(dropoff, setDropoffLatLng);
  }, [dropoff]);

  return (
    <>
      <div className="w-full">
        <GoogleMapsProvider>
          <Map pickupLatLng={pickupLatLng} dropoffLatLng={dropoffLatLng} />
        </GoogleMapsProvider>
      </div>

      <UserRideForm
        pickup={pickup}
        setPickup={setPickup}
        dropoff={dropoff}
        setDropoff={setDropoff}
      />
    </>
  );
}