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

const Map = () => {
  const { pickupLatLng, dropoffLatLng, setPickup, setPickupLatLng, pickup, setDropoff, setDropoffLatLng, dropoff } = useRide();
  const [userCenter, setUserCenter] = useState<LatLng | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

  // Move map to user location when it becomes available and no pickup/dropoff is set
  useEffect(() => {
    if (mapRef && userCenter && !pickupLatLng && !dropoffLatLng) {
      setCenter(userCenter);
      setZoom(DEFAULT_ZOOM);
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

  // When user location is found and no pickup is set, use it as pickup and fetch address
  useEffect(() => {
    if (userCenter && !pickup) {
      setPickupLatLng(userCenter);
      setCenter(userCenter);
      setZoom(DEFAULT_ZOOM);
      // Fetch address from reverse geocode
      const fetchAddress = async () => {
        try {
          const res = await fetch(`/api/geocode/reverse?latlng=${userCenter.lat},${userCenter.lng}`);
          const data = await res.json();
          if (data && data.results && data.results.length > 0) {
            setPickup(data.results[0].formatted_address);
          }
        } catch (e) {
          // ignore
        }
      };
      fetchAddress();
    }
  }, [userCenter, setPickup, setPickupLatLng]);

  // Handler for dragging pickup marker
  const handlePickupDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPickupLatLng({ lat, lng });
      try {
        const res = await fetch(`/api/geocode/reverse?latlng=${lat},${lng}`);
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          setPickup(data.results[0].formatted_address);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  // Handler for dragging dropoff marker
  const handleDropoffDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setDropoffLatLng({ lat, lng });
      try {
        const res = await fetch(`/api/geocode/reverse?latlng=${lat},${lng}`);
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          setDropoff(data.results[0].formatted_address);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <>
      <UserLocation onLocation={setUserCenter} />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={(map) => setMapRef(map)}
      >
        {pickupLatLng && (
          <Marker
            position={pickupLatLng}
            draggable={true}
            onDragEnd={handlePickupDragEnd}
          />
        )}
        {dropoffLatLng && (
          <Marker
            position={dropoffLatLng}
            draggable={true}
            onDragEnd={handleDropoffDragEnd}
          />
        )}
        {pickupLatLng && dropoffLatLng && directions && (
          <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
        )}
      </GoogleMap>
    </>
  );
};

export default Map;
