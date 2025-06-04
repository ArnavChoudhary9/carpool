import { useEffect } from 'react';

export function UserLocation({ onLocation }: { onLocation: (latLng: { lat: number; lng: number } | null) => void }) {
  useEffect(() => {
    if (!navigator.geolocation) {
      onLocation(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        onLocation(null);
      }
    );
  }, [onLocation]);
  return null;
}
