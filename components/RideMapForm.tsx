'use client';

import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import Map from "@/components/map";
import UserRideForm from "@/components/UserRideForm";
import { RideProvider } from "@/components/RideContext";

export default function RideMapForm() {
  return (
    <RideProvider>
      <div className="w-full">
        <GoogleMapsProvider>
          <Map />
        </GoogleMapsProvider>
      </div>
      <UserRideForm />
    </RideProvider>
  );
}