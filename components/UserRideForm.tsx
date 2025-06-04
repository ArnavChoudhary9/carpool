'use client';

import { useState, useEffect, use } from "react";
import { InputSuggested } from "@/components/ui/inputSuggestions";

const DEBOUNCE_DELAY = 300; // milliseconds

export default function UserRideForm({ pickup, setPickup, dropoff, setDropoff }: {
  pickup: string;
  setPickup: (val: string) => void;
  dropoff: string;
  setDropoff: (val: string) => void;
}) {
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);

  const fetchPlaces = async (input: string) => {
    if (!input) return [];
    const res = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
    const data = await res.json();
    return data.predictions || [];
  };

  useEffect(() => {
    let pickupTimeout: NodeJS.Timeout | undefined;

    if (pickup) {
      pickupTimeout = setTimeout(async () => {
        const pickupMatches = await fetchPlaces(pickup);
        setPickupSuggestions(pickupMatches.map((place: any) => place.description));
      }, DEBOUNCE_DELAY);
    } else {
      setPickupSuggestions([]);
    }

    return () => {
      if (pickupTimeout) clearTimeout(pickupTimeout);
    };
  }, [pickup]);

  useEffect(() => {
    let dropoffTimeout: NodeJS.Timeout | undefined;

    if (dropoff) {
      dropoffTimeout = setTimeout(async () => {
        const dropoffMatches = await fetchPlaces(dropoff);
        setDropoffSuggestions(dropoffMatches.map((place: any) => place.description));
      }, DEBOUNCE_DELAY);
    } else {
      setDropoffSuggestions([]);
    }

    return () => {
      if (dropoffTimeout) clearTimeout(dropoffTimeout);
    };
  }, [dropoff]);

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
