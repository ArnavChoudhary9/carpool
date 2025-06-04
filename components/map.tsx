'use client';

import { useRide } from '@/components/RideContext';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { UserLocation } from './UserLocation';

const containerStyle = {
  width: '100%',
  height: '24em',
};

const DEFAULT_ZOOM = 16;

type LatLng = { lat: number; lng: number };

interface MapProps {
  // No props needed, will use context
}

const Map = () => {
  const { pickupLatLng, dropoffLatLng } = useRide();
  const [userCenter, setUserCenter] = useState<LatLng | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

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

  // Move map to user location when it becomes available and no pickup/dropoff is set
  useEffect(() => {
    if (mapRef && userCenter && !pickupLatLng && !dropoffLatLng) {
      mapRef.setCenter(userCenter);
      mapRef.setZoom(DEFAULT_ZOOM);
    }
  }, [mapRef, userCenter, pickupLatLng, dropoffLatLng]);

  // Fetch directions when both markers are set
  useEffect(() => {
    if (pickupLatLng && dropoffLatLng && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLatLng,
          destination: dropoffLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            setDirections(null);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [pickupLatLng, dropoffLatLng]);

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
        {pickupLatLng && dropoffLatLng && directions && (
          <DirectionsRenderer directions={directions} />
        )}
      </GoogleMap>
    </>
  );
};

export default Map;
