'use client';

import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

const containerStyle = {
  width: '100%',
  height: '24em',
};

const CreateRide = () => {
  const searchParams = useSearchParams();

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  // State for estimated time
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  // Parse pickup and dropoff coordinates from comma-separated search params using useMemo
  const pickupLatLng = useMemo(() => {
    const pickupParam = searchParams.get('pickup');
    if (pickupParam) {
      const [latStr, lngStr] = pickupParam.split(',');
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return undefined;
  }, [searchParams]);

  const dropoffLatLng = useMemo(() => {
    const dropoffParam = searchParams.get('dropoff');
    if (dropoffParam) {
      const [latStr, lngStr] = dropoffParam.split(',');
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return undefined;
  }, [searchParams]);

  // Set map center and zoom
  const center = pickupLatLng || { lat: 0, lng: 0 };

  // Fit map to bounds when both pickup and dropoff are available
  useEffect(() => {
    if (mapRef && pickupLatLng && dropoffLatLng) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(pickupLatLng);
      bounds.extend(dropoffLatLng);
      mapRef.fitBounds(bounds);
    }
  }, [mapRef, pickupLatLng, dropoffLatLng]);

  useEffect(() => {
    if (mapLoaded && pickupLatLng && dropoffLatLng && window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLatLng,
          destination: dropoffLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections(result);
            // Extract estimated time (duration) from the directions result
            if (result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
              setEstimatedTime(result.routes[0].legs[0].duration?.text || null);
            } else {
              setEstimatedTime(null);
            }
          } else {
            setDirections(null);
            setEstimatedTime(null);
          }
        }
      );
    } else {
      setDirections(null);
      setEstimatedTime(null);
    }
  }, [pickupLatLng, dropoffLatLng, mapLoaded]);

  return (
    <>
      <div className="w-full">
        <GoogleMapsProvider>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            onLoad={map => {
              setMapLoaded(true);
              setMapRef(map);
            }}
          >
            {mapLoaded && pickupLatLng && dropoffLatLng && directions && (
              <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />
            )}
          </GoogleMap>
        </GoogleMapsProvider>
      </div>

      <div className="flex flex-col w-full max-w-96 sm:min-w-96 sm:max-w-96 mx-auto">
        {estimatedTime && (
          <div className="text-start text-sm">
            Estimated time: <span className="font-semibold">{estimatedTime}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default CreateRide;
