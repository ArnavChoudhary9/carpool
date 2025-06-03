'use client';

import { LoadScript } from '@react-google-maps/api';

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
