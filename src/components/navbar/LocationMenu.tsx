import React, { useState, useRef, useEffect } from "react";
import { GrLocation } from "react-icons/gr";
import Button from "../figma/Button";
import MapPage from "../MapPage";
import Input from "../figma/Input";
import GlassPanel from "../figma/GlassPanel";
import { MOBILE_GLASS_PANEL_STYLES, getMobileGlassPanelProps } from "./constants";

interface Location {
  city: string;
  state: string;
  lat: number;
  lng: number;
  country: string;
}

interface LocationMenuProps {
  updateSearchValue?: (value: string) => void;
  locationValue?: string;
  className?: string;
  onConfirm?: () => void;
}

export default function LocationMenu({ updateSearchValue, locationValue, className, onConfirm }: LocationMenuProps) {
  const [searchTerm, setSearchTerm] = useState(locationValue || "");
  const [results, setResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API is not loaded.");
    }
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedLocation(null); // Reset selected location on change

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim()) {
      timeoutRef.current = setTimeout(() => {
        searchLocations(value);
      }, 500);
    } else {
      setResults([]);
    }
  };

  const searchLocations = async (query: string) => {
    try {
      // Use our server-side Places API
      const placesResponse = await fetch(`/api/google-maps/places?input=${encodeURIComponent(query)}&types=address`);
      
      if (!placesResponse.ok) {
        console.error('Places API error:', placesResponse.status);
        setResults([]);
        return;
      }

      const placesData = await placesResponse.json();
      
      if (placesData.status === 'OK' && placesData.predictions) {
        // For each prediction, get the geocoding details
        const locations = await Promise.all(
          placesData.predictions.map(async (prediction: any) => {
            try {
              // Use our server-side Geocoding API
              const geocodeResponse = await fetch(`/api/google-maps/geocode?address=${encodeURIComponent(prediction.description)}`);
              
              if (!geocodeResponse.ok) {
                return null;
              }

              const geocodeData = await geocodeResponse.json();
              
              if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results[0]) {
                const result = geocodeData.results[0];
                const addressComponents = result.address_components;
                let city = "", state = "";
                const lat = result.geometry.location.lat;
                const lng = result.geometry.location.lng;

                // Updated component mapping to handle different location types
                addressComponents.forEach((component: any) => {
                  if (component.types.includes("locality") ||
                    component.types.includes("postal_town") ||
                    component.types.includes("administrative_area_level_3")) {
                    city = component.long_name;
                  }
                  if (component.types.includes("administrative_area_level_1")) {
                    state = component.long_name; // Changed to long_name for full state/province names
                  }
                  // If no city found, use the most specific component
                  if (!city && component.types.includes("political")) {
                    city = component.long_name;
                  }
                });

                // If still no city, use formatted address
                if (!city) {
                  const parts = result.formatted_address.split(',');
                  city = parts[0].trim();
                }

                return { 
                  city, 
                  state, 
                  lat, 
                  lng, 
                  country: result.formatted_address.split(',').pop()?.trim() || "" 
                };
              }
            } catch (error) {
              console.error('Geocoding error for prediction:', error);
            }
            return null;
          })
        );
        
        // Filter out null results and locations without city names
        const validLocations = locations.filter((loc): loc is Location => loc !== null && loc.city !== "");
        setResults(validLocations);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search locations error:', error);
      setResults([]);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    const locationText = `${location.city}, ${location.state}`;
    setSearchTerm(locationText);
    setResults([]);
    updateSearchValue?.(locationText);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      const locationText = `${selectedLocation.city}, ${selectedLocation.state}`;
      updateSearchValue?.(locationText);
      onConfirm?.();
    }
  };

  return (
    <GlassPanel 
      {...getMobileGlassPanelProps(isMobile)}
      className={`flex flex-col gap-4 lg:gap-6 w-full max-w-[584px] z-20 ${isMobile ? MOBILE_GLASS_PANEL_STYLES : ''} ${className}`}
    >
      <div className="flex-shrink-0">
        <div className="relative">
          <Input
            placeholder="Search for a city..."
            type="search"
            value={searchTerm}
            onChange={handleInputChange}
            icon={<GrLocation aria-hidden="true" className="size-5 text-white" />}
          />
          {results.length > 0 && (
            <ul className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-xl bg-black/90 backdrop-blur-xl py-2 text-base shadow-2xl border border-gray-700 focus:outline-none">
              {results.map((location, index) => (
                <li
                  key={index}
                  className="relative cursor-pointer py-3 px-4 text-white hover:bg-white/10 transition-all duration-200 border-b border-gray-800 last:border-0"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <GrLocation className="size-5 text-blue-400" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-white">{location.city}</div>
                      <div className="text-sm text-gray-400">{location.state}{location.country ? `, ${location.country}` : ''}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="w-full">
        <MapPage visible={true} location={selectedLocation} />
      </div>
      <div className="mt-3">
        <button
          onClick={handleConfirmLocation}
          disabled={!selectedLocation}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg ${
            selectedLocation 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-xl transform hover:scale-[1.02]' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm Location
        </button>
      </div>
    </GlassPanel>
  );
}
