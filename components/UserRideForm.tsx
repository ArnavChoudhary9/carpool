'use client';

import { useState, useEffect } from "react";
import { useRide } from "@/components/RideContext";
import { InputSuggested } from "@/components/ui/inputSuggestions";

const DEBOUNCE_DELAY = 300; // milliseconds

export default function UserRideForm() {
  const {
    pickup, setPickup,
    dropoff, setDropoff,
    setPickupLatLng, setDropoffLatLng
  } = useRide();

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);

  const fetchPlaces = async (input: string) => {
    if (!input) return [];
    const res = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
    const data = await res.json();
    return data.predictions || [];
  };

  // Fetch geocode for pickup
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (pickup) {
      timeout = setTimeout(async () => {
        const res = await fetch(`/api/geocode/forward?address=${encodeURIComponent(pickup)}`);
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setPickupLatLng({ lat, lng });
        } else {
          setPickupLatLng(null);
        }
        const pickupMatches = await fetchPlaces(pickup);
        setPickupSuggestions(pickupMatches.map((place: any) => place.description));
      }, DEBOUNCE_DELAY);
    } else {
      setPickupLatLng(null);
      setPickupSuggestions([]);
    }
    return () => { if (timeout) clearTimeout(timeout); };
  }, [pickup, setPickupLatLng]);

  // Fetch geocode for dropoff
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (dropoff) {
      timeout = setTimeout(async () => {
        const res = await fetch(`/api/geocode/forward?address=${encodeURIComponent(dropoff)}`);
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setDropoffLatLng({ lat, lng });
        } else {
          setDropoffLatLng(null);
        }
        const dropoffMatches = await fetchPlaces(dropoff);
        setDropoffSuggestions(dropoffMatches.map((place: any) => place.description));
      }, DEBOUNCE_DELAY);
    } else {
      setDropoffLatLng(null);
      setDropoffSuggestions([]);
    }
    return () => { if (timeout) clearTimeout(timeout); };
  }, [dropoff, setDropoffLatLng]);

  return (
    <form className="flex flex-col w-full max-w-96 sm:min-w-96 sm:max-w-96 mx-auto">
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <InputSuggested
          name="pickup"
          placeholder="Pickup Location"
          required
          suggestions={pickupSuggestions}
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <InputSuggested
          name="dropoff"
          placeholder="Dropoff Location"
          required
          suggestions={dropoffSuggestions}
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />
      </div>
    </form>
  );
}
