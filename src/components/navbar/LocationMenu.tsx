import React, { useState, useRef, useEffect } from "react";
import { GrLocation } from "react-icons/gr";
import Button from "../figma/Button";
import MapPage from "../MapPage";
import Input from "../figma/Input";
import { LoadScript } from "@react-google-maps/api";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

interface Location {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export default function LocationMenu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API is not loaded.");
    }
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

  const searchLocations = (query: string) => {
    if (!window.google) return;

    // Create AutocompleteService instance for suggestions
    const autoCompleteService = new google.maps.places.AutocompleteService();
    const geocoder = new google.maps.Geocoder();

    // Get predictions first
    autoCompleteService.getPlacePredictions(
      {
        input: query,
        // types: ['(cities)'], // Restrict to cities only
        // componentRestrictions: { country: 'US' } // Restrict to US locations
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Get detailed information for each prediction
          Promise.all(
            predictions.map((prediction) => {
              return new Promise<Location>((resolve) => {
                geocoder.geocode(
                  { placeId: prediction.place_id },
                  (results, geoStatus) => {
                    if (geoStatus === "OK" && results && results[0]) {
                      const result = results[0];
                      const addressComponents = result.address_components;
                      let city = "", state = "";
                      let lat = result.geometry.location.lat();
                      let lng = result.geometry.location.lng();

                      addressComponents.forEach((component) => {
                        if (component.types.includes("locality")) {
                          city = component.long_name;
                        }
                        if (component.types.includes("administrative_area_level_1")) {
                          state = component.short_name; // Using short_name for state abbreviation
                        }
                      });

                      resolve({ city, state, lat, lng });
                    } else {
                      resolve({ city: "", state: "", lat: 0, lng: 0 }); // Fallback
                    }
                  }
                );
              });
            })
          ).then((locations) => {
            setResults(locations.filter((loc) => loc.city && loc.state));
          });
        } else {
          setResults([]);
        }
      }
    );
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchTerm(`${location.city}, ${location.state}`);
    setResults([]);
  };

  return (
   
      <section className="flex flex-col justify-between backdrop-blur-md gap-6 py-6 h-full w-[584px] z-20 p-4 border-2 border-border-primary rounded-3xl">
        <div>
          <div className="h-2" />
          <div className="relative">
            <Input
              placeholder="Search for a city..."
              type="search"
              value={searchTerm}
              onChange={handleInputChange}
              icon={<GrLocation aria-hidden="true" className="size-5 text-white" />}
            />
            {results.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black/30 backdrop-blur-md py-1 text-base shadow-lg ring-1 ring-white/20 focus:outline-none sm:text-sm">
                {results.map((location, index) => (
                  <li
                    key={index}
                    className="relative cursor-pointer py-3 px-4 text-white hover:bg-white/20 transition-colors duration-200"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center gap-3">
                      <GrLocation className="size-4" />
                      <div>
                        <div className="font-medium">{location.city}</div>
                        <div className="text-sm text-gray-300">{location.state}, USA</div>
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
        <Button variant="primary" className="bg-white text-black h-14 w-full" disabled={!selectedLocation}>
          <p>Confirm Location</p>
        </Button>
      </section>

  );
}
