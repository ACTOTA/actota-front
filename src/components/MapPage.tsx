import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
interface Location {
  city: string;
  state: string;
  lat: number;
  lng: number;
}
const containerStyle = {
  width: '100%',
  height: '400px',
};

const mobileContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = { lat: 39.7392, lng: -104.9903 }; // Default to Denver, CO

const darkMapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6b9a76" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9ca5b3" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1f2835" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#f3d19c" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#17263c" }]
  }
];

interface MapProps {
  location?: {
    lat: number;
    lng: number;
  } | null;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ location, zoom = 11 }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={isMobile ? mobileContainerStyle : containerStyle}
      center={location || defaultCenter}
      zoom={zoom}
      mapContainerClassName='rounded-lg'
      options={{
        styles: darkMapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
      }}
    >
      {location && <Marker position={location} />}
    </GoogleMap>
  );
};

interface MapPageProps {
  visible: boolean;
  location?: Location | null;
}

function MapPage({ visible, location }: MapPageProps) {
  const mapLocation = location ? { lat: location.lat, lng: location.lng } : undefined;
  return <div className="w-full h-full">{visible && <Map location={mapLocation} />}</div>;
}

export default MapPage;
