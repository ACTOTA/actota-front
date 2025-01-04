import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = { lat: 39.7392, lng: -104.9903 }; // Denver, CO

interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface MapProps {
  location?: Location;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ location, center = defaultCenter, zoom = 11 }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);


  const safeCenter = location ? {
    lat: location.coordinates[1],
    lng: location.coordinates[0]
  } : {
    lat: center.lat ?? defaultCenter.lat,
    lng: center.lng ?? defaultCenter.lng
  };

  useEffect(() => {
    if (map && location) {
      map.panTo(safeCenter);
      map.setZoom(zoom);
    }
  }, [location, map, safeCenter, zoom]);


  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={safeCenter}
      zoom={zoom}
      mapContainerClassName='rounded-lg'
      onLoad={(map) => setMap(map)}
    >
      <Marker
        position={safeCenter}
        title={location?.name || "Denver"}
      />
    </GoogleMap>
  );
};

interface MapPageProps {
  visible: boolean;
  location?: Location;
}

function MapPage({ visible, location }: MapPageProps) {
  return (
    <div>
      {visible && (
        <Map
          key={location ? `${location.coordinates[0]}-${location.coordinates[1]}` : 'default'}
          location={location}
        />
      )}
    </div>
  );
}

export default MapPage;

