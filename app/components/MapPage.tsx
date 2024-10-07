import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px' 
};

const defaultCenter = { lat: 39.7392, lng: -104.9903 }; // Denver, CO

interface MapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ center = defaultCenter, zoom = 11 }) => {
  const safeCenter = {
    lat: center.lat ?? defaultCenter.lat, 
    lng: center.lng ?? defaultCenter.lng
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={safeCenter}
      zoom={zoom}
    >
      <Marker position={safeCenter} />
    </GoogleMap>
  );
};

interface MapPageProps {
  visible: boolean;
}

function MapPage( { visible }: MapPageProps ) {

  return (
    <div>
      {visible && ( 
        <Map />
      )}
    </div>
  );
}

export default MapPage;
