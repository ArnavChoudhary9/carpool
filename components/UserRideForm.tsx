'use client';

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";

export default function UserRideForm() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  useEffect(() => {
    const fetchPlaces = async (input: string) => {
      if (!input) return [];
      const res = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
      const data = await res.json();
      return data.predictions || [];
    };

    (async () => {
      if (pickup) {
        const pickupMatches = await fetchPlaces(pickup);
        console.log("Pickup matches:", pickupMatches);
      }
      if (dropoff) {
        const dropoffMatches = await fetchPlaces(dropoff);
        console.log("Dropoff matches:", dropoffMatches);
      }
    })();
  }, [pickup, dropoff]);

  return (
    <form className="flex flex-col w-full max-w-96 sm:min-w-96 sm:max-w-96 mx-auto">
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Input
          name="pickup"
          placeholder="Pickup Location"
          required
          onChange={(e) => setPickup(e.target.value)}
        />
        <Input
          name="dropoff"
          placeholder="Dropoff Location"
          required
          onChange={(e) => setDropoff(e.target.value)}
        />
      </div>
    </form>
  );
}
