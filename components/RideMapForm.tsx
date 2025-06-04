'use client';

import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import Map from "@/components/map";
import UserRideForm from "@/components/UserRideForm";
import { useState } from "react";

export default function RideMapForm() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  return (
    <>
      <div className="w-full">
        <GoogleMapsProvider>
          <Map />
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