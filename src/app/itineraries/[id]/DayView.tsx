'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';
import { BsCalendar4 } from 'react-icons/bs';
import { FaCar, FaBed } from 'react-icons/fa';
import { MdOutlineExplore } from 'react-icons/md';

import Button from '@/src/components/figma/Button';
import ActivityCard, { CardType } from '@/src/components/ActivityCard';
import FeedbackDrawer from '@/src/components/FeedbackDrawer';
import DrawerModal from '@/src/components/DrawerModal';
import { 
  ItineraryData, 
  PopulatedDayItem,
  isActivity, 
  isAccommodation, 
  isTransportation 
} from '@/src/types/itineraries';

// Add this constant for the API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface DayViewProps {
	listing: ItineraryData;
	isAuthenticated?: boolean;
}

const defaultCenter = {
	lat: 39.7392,
	lng: -104.9903
};

const mapOptions = {
	styles: [
		{
			featureType: 'all',
			elementType: 'all',
			stylers: [
				{ invert_lightness: true },
				{ saturation: 10 },
				{ lightness: 30 },
				{ gamma: 0.5 },
				{ hue: '#435158' }
			]
		}
	],
	disableDefaultUI: true,
	zoomControl: true,
};

export default function DayView({ listing, isAuthenticated = true }: DayViewProps) {
	const [selectedView, setSelectedView] = useState<'map' | 'day'>('map');
	const [selectedDay, setSelectedDay] = useState(1);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
	const [directionsError, setDirectionsError] = useState<string | null>(null);
	const [geocodedLocations, setGeocodedLocations] = useState<Record<string, { lat: number, lng: number }>>({}); 
	const [isGeocodingComplete, setIsGeocodingComplete] = useState(false);
	const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });
	const [selectedActivityIndex, setSelectedActivityIndex] = useState<number | null>(null);

	// Use the hook to load Google Maps
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
		libraries: ['places', 'geometry'],
	});

	// Log API key for debugging (only first and last few characters)
	useEffect(() => {
		if (GOOGLE_MAPS_API_KEY) {
			const keyLength = GOOGLE_MAPS_API_KEY.length;
			const maskedKey = keyLength > 8
				? `${GOOGLE_MAPS_API_KEY.substring(0, 4)}...${GOOGLE_MAPS_API_KEY.substring(keyLength - 4)}`
				: '****';
			console.log(`Google Maps API Key available (masked): ${maskedKey}, length: ${keyLength}`);
		} else {
			console.error('Google Maps API Key is missing');
		}
	}, []);

	// Reset directions and selection when day changes
	useEffect(() => {
		setDirections(null);
		setDirectionsError(null);
		setIsGeocodingComplete(false);
		setSelectedActivityIndex(null);
	}, [selectedDay]);

	// Helper function to generate fallback coordinates
	const generateFallbackCoordinates = useCallback((index: number, total: number) => {
		// Start from Denver area center and create a small spiral pattern
		const centerLat = 39.7392;
		const centerLng = -104.9903;
		const baseRadius = 0.015; // Base radius for nearby points
		const spiralTightness = 0.5; // How tight the spiral is
		
		// Create a logarithmic spiral to avoid overlapping
		const angle = (index / total) * 2 * Math.PI * 2; // Two full rotations
		const radius = baseRadius * (1 + spiralTightness * index);
		
		return {
			lat: centerLat + radius * Math.sin(angle),
			lng: centerLng + radius * Math.cos(angle)
		};
	}, []);

	// Enhanced geocoding function with retry logic and better error handling
	const geocodeAddress = useCallback(async (address: string, key: string, retries = 2): Promise<{ lat: number, lng: number } | null> => {
		if (!window.google) return null;

		const geocoder = new window.google.maps.Geocoder();
		
		for (let attempt = 0; attempt <= retries; attempt++) {
			try {
				const result = await new Promise<{ lat: number, lng: number } | null>((resolve) => {
					console.log(`Geocoding attempt ${attempt + 1} for ${key}: ${address}`);
					
					geocoder.geocode({ address }, (results, status) => {
						if (status === 'OK' && results && results[0]) {
							const location = results[0].geometry.location;
							const coords = { lat: location.lat(), lng: location.lng() };
							console.log(`Geocoded ${key}: ${address} -> ${coords.lat}, ${coords.lng}`);
							resolve(coords);
						} else if (status === 'OVER_QUERY_LIMIT') {
							console.warn(`Query limit exceeded for ${key}, attempt ${attempt + 1}`);
							resolve(null);
						} else {
							console.error(`Geocoding failed for ${key}: ${address} - ${status}`);
							resolve(null);
						}
					});
				});

				if (result) {
					return result;
				}

				// If we hit query limit, wait before retrying
				if (attempt < retries) {
					const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
					console.log(`Waiting ${delay}ms before retry...`);
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			} catch (error) {
				console.error(`Error during geocoding attempt ${attempt + 1} for ${key}:`, error);
			}
		}

		return null;
	}, []);

	// Improved geocoding effect with progress tracking
	useEffect(() => {
		if (!isLoaded || !window.google) return;

		const geocodeAllAddresses = async () => {
			const dayActivities = listing.days[selectedDay.toString()] || [];
			const addressesToGeocode: Array<{ address: string, key: string }> = [];


				// Geocode all activities that need it
				dayActivities.forEach((activity, idx) => {
										console.log(`Checking geocoding needs for activity ${idx + 1}:`, {
						type: activity.type,
						name: isActivity(activity) ? activity.title : activity.name,
						hasExistingCoords: !!activity.location?.coordinates
					});

					// Skip if already has coordinates
					if (activity.location?.coordinates) {
						console.log(`Activity ${idx + 1} already has coordinates, skipping geocoding`);
						return;
					}

					// For activities with addresses
					if (activity.type === 'activity' && 'address' in activity && activity.address) {
						const { street, city, state, zip } = activity.address;
						const fullAddress = `${street}, ${city}, ${state} ${zip}`;
						addressesToGeocode.push({ address: fullAddress, key: `activity-${idx}` });
						console.log(`Activity ${idx + 1} needs geocoding from address:`, fullAddress);
					} 
					// For accommodations/transportation with location names
					else if (activity.location && activity.location.name) {
						addressesToGeocode.push({ address: activity.location.name, key: `activity-${idx}` });
						console.log(`Activity ${idx + 1} needs geocoding from location name:`, activity.location.name);
					}
					// For any other activity without coordinates
					else {
						// Try to use the activity name as a last resort
						const activityName = isActivity(activity) ? activity.title : activity.name;
						if (activityName && activityName !== "Unknown") {
							addressesToGeocode.push({ address: `${activityName}, Denver, Colorado`, key: `activity-${idx}` });
							console.log(`Activity ${idx + 1} needs geocoding from activity name:`, activityName);
						} else {
							console.warn(`Activity ${idx + 1} has no geocodable information`);
						}
					}
				});
			if (addressesToGeocode.length === 0) {
				console.log('No geocoding needed, all locations have coordinates');
				setIsGeocodingComplete(true);
				return;
			}

			// Set progress tracking
			setGeocodingProgress({ current: 0, total: addressesToGeocode.length });
			console.log(`Starting geocoding for ${addressesToGeocode.length} addresses`);

			// Process geocoding with rate limiting (one at a time to avoid quota issues)
			for (let i = 0; i < addressesToGeocode.length; i++) {
				const { address, key } = addressesToGeocode[i];
				setGeocodingProgress({ current: i + 1, total: addressesToGeocode.length });

				const coords = await geocodeAddress(address, key);
				if (coords) {
					setGeocodedLocations(prev => {
						const updated = { ...prev, [key]: coords };
						console.log('Updated geocodedLocations:', updated);
						return updated;
					});
				} else {
					// Fallback: generate a slightly offset position based on index
					console.warn(`Failed to geocode ${key}, using fallback position`);
					const fallbackCoords = generateFallbackCoordinates(i, addressesToGeocode.length);
					setGeocodedLocations(prev => {
						const updated = { ...prev, [key]: fallbackCoords };
						console.log('Added fallback coordinates for', key, fallbackCoords);
						return updated;
					});
				}

				// Add a small delay between requests to respect rate limits
				if (i < addressesToGeocode.length - 1) {
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			}

			console.log('All geocoding completed');
			setIsGeocodingComplete(true);
		};

		geocodeAllAddresses().catch(error => {
			console.error('Error during batch geocoding:', error);
			setIsGeocodingComplete(true);
		});
	}, [selectedDay, isLoaded, listing, geocodeAddress]);

	const onLoad = useCallback((map: google.maps.Map) => {
		console.log('Google Map loaded successfully');
		setMap(map);
	}, []);

	// Handle directions response
	const directionsCallback = useCallback((
		result: google.maps.DirectionsResult | null,
		status: google.maps.DirectionsStatus
	) => {
		if (status === 'OK' && result) {
			setDirections(result);
			setDirectionsError(null);
			console.log('Directions service successful');
		} else {
			// Don't set error for ZERO_RESULTS since we have a fallback
			if (status === 'ZERO_RESULTS') {
				console.log('No driving route found, using straight lines');
				setDirectionsError(null);
			} else {
				setDirectionsError(`Directions request failed: ${status}`);
				console.error('Directions service failed:', status);
			}
		}
	}, []);

	const formatTime = (time: string) => {
		try {
			const [hours, minutes] = time.split(':');
			const parsedHours = parseInt(hours);
			const period = parsedHours >= 12 ? 'PM' : 'AM';
			const displayHours = parsedHours > 12 ? parsedHours - 12 : parsedHours;
			return `${displayHours}:${minutes}${period}`;
		} catch (error) {
			return time;
		}
	};

	// Format date helper
	const formatDate = (date: string | Date | undefined) => {
		if (!date) return '';
		return new Intl.DateTimeFormat('en-US', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(new Date(date));
	};

  

  

	

	
	
	

	// Helper function to validate and fix coordinates
	const validateAndFixCoordinates = (lat: number, lng: number, source: string) => {
		// Reasonable bounds for US (adjust as needed for your use case)
		const isValidLat = lat >= 24 && lat <= 49;
		const isValidLng = lng >= -125 && lng <= -66;
		
		if (isValidLat && isValidLng) {
			console.log(`Valid coordinates for ${source}:`, { lat, lng });
			return { lat, lng };
		}
		
		// Try swapping lat/lng
		const swappedIsValidLat = lng >= 24 && lng <= 49;
		const swappedIsValidLng = lat >= -125 && lat <= -66;
		
		if (swappedIsValidLat && swappedIsValidLng) {
			console.log(`Swapped coordinates for ${source}:`, { lat: lng, lng: lat });
			return { lat: lng, lng: lat };
		}
		
		console.warn(`Invalid coordinates for ${source}:`, { lat, lng });
		return null;
	};

	// Get coordinates for the selected day's activities - FIXED VERSION
	const getDayCoordinates = useCallback(() => {
		try {
			const dayActivities = listing.days[selectedDay.toString()] || [];
			const coordinates: Array<{lat: number, lng: number, label?: string}> = [];

			console.log('=== getDayCoordinates Debug ===');
			console.log('Day activities count:', dayActivities.length);
			console.log('Geocoded locations:', geocodedLocations);

			// Only add activity locations - no separate start/end markers
			dayActivities.forEach((activity, idx) => {
				console.log(`\n--- Processing activity ${idx + 1} ---`);
								console.log('Activity:', {
					type: activity.type,
					name: isActivity(activity) ? activity.title : activity.name,
					hasLocation: !!activity.location,
					locationCoords: activity.location?.coordinates,
					hasAddress: isActivity(activity) && !!activity.address
				});

				let coordinatesAdded = false;

				// Check if activity has location with coordinates (accommodation/transportation)
				if (activity.location?.coordinates) {
					// GeoJSON format: [longitude, latitude] -> convert to { lat, lng }
					const rawCoords = {
						lat: activity.location.coordinates[1], // latitude is second in GeoJSON
						lng: activity.location.coordinates[0]  // longitude is first in GeoJSON
					};
					
					const validCoords = validateAndFixCoordinates(rawCoords.lat, rawCoords.lng, `activity ${idx + 1}`);
					if (validCoords) {
						coordinates.push({
							...validCoords,
							label: isActivity(activity) ? activity.title : activity.name
						});
						console.log(`Added activity ${idx + 1} from location.coordinates:`, validCoords);
						coordinatesAdded = true;
					}
				} 
				
				// Check geocoded locations
				if (!coordinatesAdded && geocodedLocations[`activity-${idx}`]) {
					// Use geocoded coordinates for activities with addresses (these are already in correct format)
					coordinates.push({
						...geocodedLocations[`activity-${idx}`],
						label: isActivity(activity) ? activity.title : activity.name
					});
					console.log(`Added activity ${idx + 1} from geocoding:`, geocodedLocations[`activity-${idx}`]);
					coordinatesAdded = true;
				}
				
				// If still no coordinates, generate fallback
				if (!coordinatesAdded) {
					console.warn(`No coordinates found for activity ${idx + 1}, generating fallback`);
					const fallbackCoords = generateFallbackCoordinates(idx, dayActivities.length);
					coordinates.push({
						...fallbackCoords,
						label: isActivity(activity) ? activity.title : activity.name
					});
					console.log(`Added activity ${idx + 1} with fallback coordinates:`, fallbackCoords);
					
					// Log why we needed fallback
					console.log(`Fallback reason for activity ${idx + 1}:`, {
						type: activity.type,
												name: isActivity(activity) ? activity.title : activity.name,
						hasLocation: !!activity.location,
						hasCoordinates: !!activity.location?.coordinates,
						hasAddress: activity.type === 'activity' && 'address' in activity && !!activity.address,
						geocodingKey: `activity-${idx}`,
						wasGeocoded: !!geocodedLocations[`activity-${idx}`],
						geocodedKeys: Object.keys(geocodedLocations)
					});
				}
			});

			console.log('\n=== Final Results ===');
			console.log('Total coordinates:', coordinates.length);
			console.log('Coordinates array:', coordinates);
			return coordinates;
		} catch (error) {
			console.error("Error getting coordinates:", error);
			return [];
		}
	}, [selectedDay, listing, geocodedLocations, validateAndFixCoordinates, generateFallbackCoordinates])

	// Recalculate coordinates when geocoding changes
	const pathCoordinates = React.useMemo(() => {
		const coords = getDayCoordinates();
		console.log('pathCoordinates recalculated:', coords);
		return coords;
	}, [selectedDay, geocodedLocations, getDayCoordinates]);

	// Pan to selected marker when activity is selected
	useEffect(() => {
		if (selectedActivityIndex !== null && map && pathCoordinates[selectedActivityIndex]) {
			map.panTo(pathCoordinates[selectedActivityIndex]);
		}
	}, [selectedActivityIndex, map, pathCoordinates]);

	// Calculate map center and zoom based on coordinates
	const getMapCenter = () => {
		if (pathCoordinates.length === 0) return defaultCenter;

		const lats = pathCoordinates.map(coord => coord.lat);
		const lngs = pathCoordinates.map(coord => coord.lng);

		return {
			lat: (Math.max(...lats) + Math.min(...lats)) / 2,
			lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
		};
	};

	// Fit map to show all coordinates
	useEffect(() => {
		if (map && pathCoordinates.length > 0) {
			const bounds = new google.maps.LatLngBounds();
			pathCoordinates.forEach(coord => {
				bounds.extend(coord);
			});
			
			// Add some padding around the bounds
			const padding = { top: 50, right: 50, bottom: 50, left: 50 };
			map.fitBounds(bounds, padding);
			
			// Set max zoom to prevent over-zooming on single points
			const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
				const zoom = map.getZoom();
				if (zoom && zoom > 15) {
					map.setZoom(15);
				}
				google.maps.event.removeListener(listener);
			});
		}
	}, [map, pathCoordinates]);

	// Test function to try simplified directions
	const testDirections = () => {
		if (!window.google || pathCoordinates.length < 2) return;
		
		const service = new google.maps.DirectionsService();
		
		// Test with just first two points
		const testRequest = {
			origin: pathCoordinates[0],
			destination: pathCoordinates[1],
			travelMode: google.maps.TravelMode.DRIVING,
		};
		
		console.log('=== Testing simplified directions ===');
		console.log('Test request:', testRequest);
		
		service.route(testRequest, (result, status) => {
			console.log('Test status:', status);
			if (status === 'OK') {
				console.log('Test successful! Route found between first two points');
			} else {
				console.log('Test failed:', status);
				
				// Try with lat/lng objects
				const testRequest2 = {
					origin: new google.maps.LatLng(pathCoordinates[0].lat, pathCoordinates[0].lng),
					destination: new google.maps.LatLng(pathCoordinates[1].lat, pathCoordinates[1].lng),
					travelMode: google.maps.TravelMode.DRIVING,
				};
				
				console.log('Testing with LatLng objects:', testRequest2);
				service.route(testRequest2, (result2, status2) => {
					console.log('LatLng test status:', status2);
				});
			}
		});
	};

	// Run test when coordinates are ready
	useEffect(() => {
		if (pathCoordinates.length >= 2 && isLoaded) {
			// Log all coordinates to verify they're valid
			console.log('=== All Path Coordinates ===');
			pathCoordinates.forEach((coord, idx) => {
				console.log(`Point ${idx + 1}:`, coord);
				// Check if coordinates are in valid range
				if (Math.abs(coord.lat) > 90 || Math.abs(coord.lng) > 180) {
					console.error(`Invalid coordinates at point ${idx + 1}`);
				}
			});
			
			testDirections();
		}
	}, [pathCoordinates, isLoaded]);

	const currentDayActivities = listing.days[selectedDay.toString()] || [];

	return (
		<div className="w-full">
			{/* View Toggle */}
			<div className="inline-flex justify-start gap-2 mb-9 border border-border-primary rounded-full p-1">
				<Button
					onClick={() => setSelectedView('map')}
					className={`border-white px-[50px] !py-2 ${selectedView === 'map' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
					variant={selectedView === 'map' ? 'outline' : 'simple'}
				>
					Map
				</Button>
				<Button
					onClick={() => setSelectedView('day')}
					className={`border-white px-[25px] !py-2 ${selectedView === 'day' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
					variant={selectedView === 'day' ? 'outline' : 'simple'}
				>
					Day by Day
				</Button>
			</div>

			{/* Day Selection */}
			<div className="flex items-center gap-4 mb-6">
				<h2 className="text-xl font-bold text-white">Day</h2>
				<div className="inline-flex justify-start gap-2 border border-border-primary rounded-full p-1">
					{Array.from({ length: listing.length_days }, (_, i) => i + 1).map((day) => (
						<Button
							key={day}
							onClick={() => setSelectedDay(day)}
							className={`border-white px-[25px] !py-2 ${selectedDay === day ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
							variant={selectedDay === day ? 'outline' : 'simple'}
						>
							{day}
						</Button>
					))}
				</div>
			</div>

			{selectedView === 'map' ? (
				<div className="flex gap-6 max-sm:flex-col-reverse">
					{/* Left Side - Day Details */}
					<div className="w-[320px]">
						<div className="flex items-center gap-2 mb-6">
							<BsCalendar4 className="text-white text-sm" />
							<span className="text-white text-sm font-medium">
								{formatDate(listing.start_date)}
							</span>
							<span className="text-gray-400 text-sm ml-auto">Day {selectedDay}</span>
						</div>

						<div className="space-y-3">
							{currentDayActivities.map((activity, index, array) => {
								const isTransport = isTransportation(activity);
								const isAccomm = isAccommodation(activity);
								const isAct = isActivity(activity);
								
								return (
									<React.Fragment key={index}>
										<div className="relative">
											{/* Connection line */}
											{index < array.length - 1 && (
												<div className="absolute top-8 left-[15px] w-[1px] h-[calc(100%+12px)] bg-gray-600"></div>
											)}
											
											{/* Transportation items get special pill styling */}
											{isTransport ? (
												<div 
													className={`bg-[#1A1A1A] rounded-full px-4 py-2 flex items-center gap-3 cursor-pointer transition-all ${
														selectedActivityIndex === index ? 'ring-2 ring-[#FEDB25] bg-[#1A1A1A]/80' : 'hover:bg-[#262626]'
													}`}
													onClick={() => setSelectedActivityIndex(index)}
												>
													{/* Yellow icon circle */}
													<div className="relative z-10 flex-shrink-0">
														<div className="w-8 h-8 rounded-full bg-[#FEDB25] flex items-center justify-center">
															<FaCar className="h-4 w-4 text-black" />
														</div>
													</div>
													
													{/* Content */}
													<div className="flex items-center gap-2 flex-1">
														<h3 className="text-white text-sm font-medium">
															{activity.name}
														</h3>
														
													</div>
												</div>
											) : (
												/* Regular styling for activities and accommodations */
												<div 
													className={`flex items-start gap-3 cursor-pointer transition-all rounded-lg p-2 -m-2 ${
														selectedActivityIndex === index ? 'bg-white/10' : 'hover:bg-white/5'
													}`}
													onClick={() => setSelectedActivityIndex(index)}
												>
													{/* Icon circle */}
													<div className="relative z-10 flex-shrink-0">
														<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
															isAccomm ? 'bg-[#F10E3B]' : 'bg-[#0553CE]'
														}`}>
															{isAccomm ? (
																<FaBed className="h-4 w-4 text-white" />
															) : (
																<MdOutlineExplore className="h-4 w-4 text-white" />
															)}
														</div>
													</div>
													
													{/* Content */}
													<div className="flex-1 pt-1">
														<div className="flex items-baseline gap-2">
															<h3 className="text-white text-sm font-medium leading-tight">
																{isActivity(activity) ? activity.title : activity.name}
															</h3>
															<span className="text-gray-400 text-xs">
																{formatTime(activity.time)}
															</span>
														</div>
														{((activity.type === 'activity' && 'address' in activity && activity.address) || activity.location?.name) ? (
															<p className={`text-gray-500 text-xs mt-0.5 ${!isAuthenticated ? 'blur-sm select-none' : ''}`}>
																{activity.type === 'activity' && 'address' in activity && activity.address
																	? `${activity.address.street}, ${activity.address.city}`
																	: activity.location?.name}
															</p>
														) : null}
													</div>
												</div>
											)}
										</div>
									</React.Fragment>
								);
							})}
						</div>
					</div>

					{/* Right Side - Map */}
					<div className="flex-1">
						{loadError ? (
							<div className="w-full h-[750px] flex items-center justify-center bg-[#141414] rounded-xl">
								<div className="text-white">Error loading Google Maps</div>
							</div>
						) : !isLoaded ? (
							<div className="w-full h-[750px] flex items-center justify-center bg-[#141414] rounded-xl">
								<div className="text-white">Loading map...</div>
							</div>
						) : (
							<>
								{/* Main map container */}
								<div className="w-full h-[750px] rounded-xl overflow-hidden relative">
									{!isGeocodingComplete ? (
										<div className="w-full h-full flex items-center justify-center bg-[#141414] rounded-xl">
											<div className="text-white">
												<div className="text-center">
													<div className="text-lg mb-2">Geocoding addresses...</div>
													<div className="text-sm text-gray-400">
														{geocodingProgress.total > 0 && 
															`Processing ${geocodingProgress.current} of ${geocodingProgress.total} locations`
														}
													</div>
													{geocodingProgress.total > 0 && (
														<div className="w-64 bg-gray-700 rounded-full h-2 mt-3">
															<div 
																className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
																style={{ width: `${(geocodingProgress.current / geocodingProgress.total) * 100}%` }}
															></div>
														</div>
													)}
												</div>
											</div>
										</div>
									) : pathCoordinates.length > 0 ? (
										<GoogleMap
											mapContainerStyle={{
												width: '100%',
												height: '100%',
												borderRadius: '12px'
											}}
											center={getMapCenter()}
											zoom={10}
											options={mapOptions}
											onLoad={onLoad}
										>
											{/* Custom markers for route stops */}
											{pathCoordinates.map((position, index) => {
													const dayActivity = currentDayActivities[index];
													const activityName = dayActivity ? (isActivity(dayActivity) ? dayActivity.title : dayActivity.name) : `Activity ${index + 1}`;
													const isSelected = selectedActivityIndex === index;
													
													// Get color based on activity type
													let markerColor = '#3b82f6'; // Default blue
													if (dayActivity) {
														if (isTransportation(dayActivity)) {
															markerColor = '#FEDB25'; // Yellow
														} else if (isAccommodation(dayActivity)) {
															markerColor = '#F10E3B'; // Red
														} else if (isActivity(dayActivity)) {
															markerColor = '#0553CE'; // Blue
														}
													}
													
													// Make marker larger if selected
													const markerSize = isSelected ? 48 : 32;
													const markerAnchor = isSelected ? 24 : 16;
												return (
													<Marker
														key={`marker-${index}`}
														position={position}
														icon={{
															url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
																<svg width="${markerSize}" height="${markerSize * 1.25}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z" 
																		fill="${markerColor}" stroke="${isSelected ? '#ffffff' : 'none'}" stroke-width="${isSelected ? '2' : '0'}"/>
																	<circle cx="16" cy="16" r="8" fill="white"/>
																	<text x="16" y="20" text-anchor="middle" fill="${markerColor}" 
																		font-family="Arial, sans-serif" font-size="12" font-weight="bold">${index + 1}</text>
																</svg>
															`)}`,
															scaledSize: new google.maps.Size(markerSize, markerSize * 1.25),
															anchor: new google.maps.Point(markerAnchor, markerSize)
														}}
														title={activityName}
														onClick={() => setSelectedActivityIndex(index)}
													/>
												);
											})}

											{/* Try to get directions if we have 2+ points */}
											{pathCoordinates.length >= 2 && !directions && (
												<DirectionsService
													options={{
														origin: pathCoordinates[0],
														destination: pathCoordinates[pathCoordinates.length - 1],
														waypoints: pathCoordinates.length > 2 ? pathCoordinates.slice(1, pathCoordinates.length - 1).map(coord => ({
															location: coord,
															stopover: true
														})) : [],
														travelMode: google.maps.TravelMode.DRIVING,
														optimizeWaypoints: false,
														avoidHighways: false,
														avoidTolls: false
													}}
													callback={(result, status) => {
														console.log('=== Directions API Request ===');
														console.log('Origin:', pathCoordinates[0]);
														console.log('Destination:', pathCoordinates[pathCoordinates.length - 1]);
														if (pathCoordinates.length > 2) {
															console.log('Waypoints:', pathCoordinates.slice(1, pathCoordinates.length - 1));
														} else {
															console.log('No waypoints - direct route');
														}
														console.log('Status:', status);
														if (result) {
															console.log('Result legs:', result.routes[0]?.legs.length);
															console.log('Total distance:', result.routes[0]?.legs.reduce((total, leg) => total + (leg.distance?.value || 0), 0), 'meters');
														}
														directionsCallback(result, status);
													}}
												/>
											)}

											{directions && (
												<DirectionsRenderer
													options={{
														directions: directions,
														suppressMarkers: true, // We'll use custom markers
														polylineOptions: {
															strokeColor: '#FEDB25',
															strokeOpacity: 1,
															strokeWeight: 4
														},
														preserveViewport: false
													}}
												/>
											)}

											{/* Polyline removed per user request - no straight lines between markers */}

											{directionsError && (
												<div className="absolute top-2 left-2 bg-red-500/80 text-white p-2 rounded">
													Error: {directionsError}
												</div>
											)}
										</GoogleMap>
									) : (
										<div className="w-full h-[750px] flex items-center justify-center bg-[#141414] rounded-xl">
											<div className="text-white">No route coordinates available for this day</div>
										</div>
									)}
									
									{/* Blur overlay for unauthenticated users */}
									{!isAuthenticated && (
										<div className="absolute inset-0 bg-black/10 backdrop-blur-md rounded-xl flex items-center justify-center">
											<div className="bg-black/70 px-6 py-4 rounded-lg text-center">
												<p className="text-white font-medium">Login to view route details</p>
											</div>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			) : (
				<div className="space-y-6 relative pl-24">
					{currentDayActivities.map((activity, index) => {
						// Use type guards to determine the card type
						const cardType = isAccommodation(activity) 
							? CardType.ACCOMMODATION 
							: isActivity(activity) 
								? CardType.ACTIVITY 
								: CardType.TRANSPORTATION;
						
						return (
							<ActivityCard
								key={index}
								activity={activity}
								cardType={cardType}
								formatTime={formatTime}
								setIsFeedbackDrawerOpen={setIsDrawerOpen}
							/>
						);
					})}
				</div>
			)}

			<DrawerModal
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			>
				<FeedbackDrawer setIsDrawerOpen={setIsDrawerOpen} />
			</DrawerModal>
		</div>
	);
}

