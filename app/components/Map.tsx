import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'  // Ensure you have a set height for visibility
};

const defaultCenter = { lat: 39.7392, lng: -104.9903 };

interface MapProps {
  center?: {
    lat: number,
    lng: number
  };
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ center = defaultCenter, zoom = 11 }) => {
  // Ensure that the center values are numbers and valid
  const safeCenter = {
    lat: isNaN(center.lat) ? defaultCenter.lat : center.lat,
    lng: isNaN(center.lng) ? defaultCenter.lng : center.lng
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAWYB3EXLSD-3fT8A-NFXX7nG8KBvJQMCw"
      loadingElement={<div>Loading...</div>}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={safeCenter}
        zoom={zoom}
      >
        {/* Ensure Marker is conditionally rendered only if coordinates are valid */}
        <Marker position={safeCenter} />
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
