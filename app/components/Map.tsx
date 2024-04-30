import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet's icon loading issue
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[];
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  const defaultCenter = [39.7392, -104.9903]; // Colorado Center
  const defaultZoom = zoom || 11;

  return (
      <MapContainer 
        center={center || defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={false} 
        className="h-[35vh] rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {center && (
          <Marker position={center as L.LatLngExpression} />
        )}
      </MapContainer>
  )
}

export default Map;
