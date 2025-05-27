import React, { useState, useRef, useEffect } from "react";
import { GrLocation } from "react-icons/gr";
import Button from "../figma/Button";
import MapPage from "../MapPage";
import Input from "../figma/Input";

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
}

export default function LocationMenu({ updateSearchValue, locationValue, className }: LocationMenuProps) {
  const [searchTerm, setSearchTerm] = useState(locationValue || "");
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

    const autoCompleteService = new google.maps.places.AutocompleteService();
    const geocoder = new google.maps.Geocoder();

    // Removed restrictions to allow all types of places worldwide
    autoCompleteService.getPlacePredictions(
      {
        input: query,
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
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

                      // Updated component mapping to handle different location types
                      addressComponents.forEach((component) => {
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

                      resolve({ city, state, lat, lng, country: result.formatted_address.split(',').pop()?.trim() || "" });
                    } else {
                      resolve({ city: "", state: "", lat: 0, lng: 0, country: "" });
                    }
                  }
                );
              });
            })
          ).then((locations) => {
            // Filter only locations that have at least a city name
            setResults(locations.filter((loc) => loc.city));
          });
        } else {
          setResults([]);
        }
      }
    );
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
    }
  };

  return (
    <section className={`flex flex-col max-lg:backdrop-blur-none lg:backdrop-blur-md gap-4 lg:gap-6 py-4 lg:py-6 w-full max-w-[584px] z-20 p-4 max-lg:border-0 lg:border-2 border-border-primary rounded-3xl ${className}`} >
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
                      <div className="text-sm text-gray-300">{location.state} {location.country}</div>
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
      <Button
        variant="primary"
        className="bg-white text-black h-14 w-full flex-shrink-0"
        disabled={!selectedLocation}
        onClick={handleConfirmLocation}
      >
        <p>Confirm Location</p>
      </Button>
    </section >
  );
}
