'use client';

import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { UserLocation } from './UserLocation';

const containerStyle = {
  width: '100%',
  height: '24em',
};

const DEFAULT_ZOOM = 16;

type LatLng = { lat: number; lng: number };

function getBounds(p1: LatLng, p2: LatLng) {
  if (!p1 || !p2) return null;
  return {
    north: Math.max(p1.lat, p2.lat),
    south: Math.min(p1.lat, p2.lat),
    east: Math.max(p1.lng, p2.lng),
    west: Math.min(p1.lng, p2.lng),
  };
}

interface MapProps {
  pickupLatLng?: LatLng | null;
  dropoffLatLng?: LatLng | null;
}

const Map = ({ pickupLatLng, dropoffLatLng }: MapProps) => {
  const [userCenter, setUserCenter] = useState<LatLng | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Calculate center and zoom
  let center = userCenter || { lat: 0, lng: 0 };
  let zoom = DEFAULT_ZOOM;

  if (pickupLatLng && dropoffLatLng) {
    center = {
      lat: (pickupLatLng.lat + dropoffLatLng.lat) / 2,
      lng: (pickupLatLng.lng + dropoffLatLng.lng) / 2,
    };
    zoom = 8;
  } else if (pickupLatLng) {
    center = pickupLatLng;
    zoom = DEFAULT_ZOOM;
  } else if (dropoffLatLng) {
    center = dropoffLatLng;
    zoom = DEFAULT_ZOOM;
  }

  // Fit bounds if both markers exist
  useEffect(() => {
    if (mapRef && pickupLatLng && dropoffLatLng && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(pickupLatLng);
      bounds.extend(dropoffLatLng);
      mapRef.fitBounds(bounds);
    }
  }, [mapRef, pickupLatLng, dropoffLatLng]);

  return (
    <>
      <UserLocation onLocation={setUserCenter} />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={(map) => setMapRef(map)}
      >
        {pickupLatLng && <Marker position={pickupLatLng} />}
        {dropoffLatLng && <Marker position={dropoffLatLng} />}
      </GoogleMap>
    </>
  );
};

export default Map;
