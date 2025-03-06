'use client';
import React, { useState, useCallback } from 'react';
import { BiSolidMap } from 'react-icons/bi';
import { GoogleMap, Polyline, Marker, LoadScript } from '@react-google-maps/api';
import { BsCalendar4 } from 'react-icons/bs';
import { MdOutlineExplore } from 'react-icons/md';
import Button from '@/src/components/figma/Button';
import ActivityCard from '@/src/components/ActivityCard';
import FeedbackDrawer from '@/src/components/FeedbackDrawer';
import DrawerModal from '@/src/components/DrawerModal';

// Add this constant for the API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

interface Location {
	name: string;
	coordinates: number[];
}

interface Activity {
	time: string;
	location: Location;
	type: string;
	name: string;
}

interface ListingData {
	_id: { $oid: string };
	trip_name: string;
	length_days: number;
	start_location: {
		city: string;
		state: string;
		coordinates: number[];
	};
	end_location: {
		city: string;
		state: string;
		coordinates: number[];
	};
	days: {
		[key: string]: Activity[];
	};
	start_date?: string;
}

interface DayViewProps {
	listing: ListingData;
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

export default function DayView({ listing }: DayViewProps) {
	const [selectedView, setSelectedView] = useState<'map' | 'day'>('map');
	const [selectedDay, setSelectedDay] = useState(1);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [map, setMap] = useState<google.maps.Map | null>(null);

	const onLoad = useCallback((map: google.maps.Map) => {
		setMap(map);
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

	// Get icon for activity type
	const getActivityIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'hiking':
				return <MdOutlineExplore className="w-5 h-5 text-white" />;
			case 'sightseeing':
				return <BiSolidMap className="w-5 h-5 text-white" />;
			case 'safari':
				return <MdOutlineExplore className="w-5 h-5 text-white" />;
			default:
				return <BiSolidMap className="w-5 h-5 text-white" />;
		}
	};

	// Get coordinates for the selected day's activities
	const getDayCoordinates = () => {
		const dayActivities = listing.days[selectedDay.toString()] || [];
		const coordinates = [];

		// Add start location if it's day 1
		if (selectedDay === 1) {
			coordinates.push({
				lat: listing.start_location.coordinates[1],
				lng: listing.start_location.coordinates[0]
			});
		}

		// Add activity locations
		dayActivities.forEach(activity => {
			coordinates.push({
				lat: activity.location.coordinates[1],
				lng: activity.location.coordinates[0]
			});
		});

		// Add end location if it's the last day
		if (selectedDay === listing.length_days) {
			coordinates.push({
				lat: listing.end_location.coordinates[1],
				lng: listing.end_location.coordinates[0]
			});
		}

		return coordinates;
	};

	const pathCoordinates = getDayCoordinates();

	// Calculate map center based on coordinates
	const getMapCenter = () => {
		if (pathCoordinates.length === 0) return defaultCenter;

		const lats = pathCoordinates.map(coord => coord.lat);
		const lngs = pathCoordinates.map(coord => coord.lng);

		return {
			lat: (Math.max(...lats) + Math.min(...lats)) / 2,
			lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
		};
	};

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
					<div className="w-[320px] bg-[#141414] rounded-2xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<BsCalendar4 className="text-white" />
							<span className="text-white">{formatDate(listing?.start_date)}</span>
							<span className="text-gray-400 ml-auto">Day {selectedDay}</span>
						</div>

						<div className="space-y-6">
							{currentDayActivities.map((activity, index, array) => (
								<React.Fragment key={index}>
									<div className="flex gap-3">
										<div className="rounded-full bg-[#262626] p-2">
											{getActivityIcon(activity.name)}
										</div>
										<div className="flex-1">
											<h3 className="text-white text-sm">{activity.name}</h3>
											<p className="text-gray-400 text-sm">{activity.location.name}</p>
											<p className="text-gray-400 text-sm">{formatTime(activity.time)}</p>
										</div>
									</div>
									{index < array.length - 1 && (
										<div className="w-[1px] h-4 bg-gray-600 ml-[22px]"></div>
									)}
								</React.Fragment>
							))}
						</div>
					</div>

					{/* Right Side - Map */}
					<div className="flex-1">
						<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
							<div className="w-full h-[800px] rounded-xl overflow-hidden">
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
									<Polyline
										path={pathCoordinates}
										options={{
											strokeColor: '#FEDB25',
											strokeOpacity: 1,
											strokeWeight: 3,
										}}
									/>
									{pathCoordinates.map((position, index) => (
										<Marker
											key={index}
											position={position}
										/>
									))}
								</GoogleMap>
							</div>
						</LoadScript>
					</div>
				</div>
			) : (
				<div className="space-y-4 border-l-2 border-dashed border-border-primary ps-6 ms-6">
					{currentDayActivities.map((activity: Activity, index) => (
						<ActivityCard
							key={index}
							activity={activity}
							formatTime={formatTime}
							getActivityIcon={getActivityIcon}
							setIsFeedbackDrawerOpen={setIsDrawerOpen}
						/>
					))}
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
