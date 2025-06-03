'use client';

import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '24em',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const Map = () => {
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Map;
