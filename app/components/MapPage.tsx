import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Location } from '@/db/models/itinerary';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = { lat: 39.7392, lng: -104.9903 }; // Denver, CO

interface MapProps {
  mapLocation?: Location;
  setMapLocation?: React.Dispatch<React.SetStateAction<Location>>;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ mapLocation, setMapLocation, zoom = 11 }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map && mapLocation) {
      const newCenter = {
        lat: mapLocation.coordinates[1],
        lng: mapLocation.coordinates[0]
      };
      map.panTo(newCenter);
    }
  }, [mapLocation, map]);

  useEffect(() => {
    console.log('Map loaded', mapLocation);
  }, [mapLocation]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapLocation ? { lat: mapLocation.coordinates[1], lng: mapLocation.coordinates[0] } : defaultCenter}
      zoom={zoom}
      mapContainerClassName='rounded-lg'
      onLoad={(map) => setMap(map)}
    >
      <Marker
        position={mapLocation ? { lat: mapLocation.coordinates[1], lng: mapLocation.coordinates[0] } : defaultCenter}
        title={mapLocation ? `${mapLocation.city}, ${mapLocation.state}` : 'Denver, CO'}
      />
    </GoogleMap>
  );
};

interface MapPageProps {
  visible: boolean;
  mapLocation?: Location;
  setMapLocation?: React.Dispatch<React.SetStateAction<Location>>;
}

function MapPage({ visible, mapLocation, setMapLocation }: MapPageProps) {
  return (
    <div>
      {visible && (
        <Map
          mapLocation={mapLocation}
          setMapLocation={setMapLocation}
        />
      )}
    </div>
  );
}

export default MapPage;
