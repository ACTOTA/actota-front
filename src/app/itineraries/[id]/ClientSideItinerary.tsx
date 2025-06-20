'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '@heroicons/react/20/solid';
import Button from '@/src/components/figma/Button';
import DayView from './DayView';
import { CgSoftwareUpload } from 'react-icons/cg';
import { LuUsers } from 'react-icons/lu';
import { PiClockDuotone } from 'react-icons/pi';
import { MdOutlineExplore } from 'react-icons/md';
import { RiMapPinLine } from 'react-icons/ri';
import ActivityTag from '@/src/components/figma/ActivityTag';
import ListingsSlider from '@/src/components/ListingsSlider';
import LikeDislike from '@/src/components/LikeDislike';
import { useItineraryById } from '@/src/hooks/queries/itinerarieById/useItineraryByIdQuery';
import { useFavorites } from '@/src/hooks/queries/account/useFavoritesQuery';
import Image from 'next/image';
import { ItineraryData } from '@/src/types/itineraries';
import DateMenu from '@/src/components/navbar/DateMenu';
import BudgetBreakdown from '@/src/components/BudgetBreakdown';

interface ClientSideItineraryProps {
  initialData: ItineraryData;
  isAuthenticated?: boolean;
}

export default function ClientSideItinerary({ initialData, isAuthenticated = true }: ClientSideItineraryProps) {
  const pathname = usePathname() as string;
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const [clientIsAuthenticated, setClientIsAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    // Access localStorage only on the client side
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setClientIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        setClientIsAuthenticated(false);
      }
    } else {
      setClientIsAuthenticated(false);
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itineraryData, setItineraryData] = useState<ItineraryData>(initialData);
  const [dateRange, setDateRange] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [tripStartDate, setTripStartDate] = useState<string | null>(null);
  const [tripEndDate, setTripEndDate] = useState<string | null>(null);

  const { data: apiResponse, isLoading, error } = useItineraryById(objectId);

  const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();
  useEffect(() => {
    if (apiResponse) {
      const filteredItineraryData = favorites?.some((favorite: any) => favorite._id.$oid === apiResponse._id.$oid) ? { ...apiResponse, isFavorite: true } : apiResponse;
      setItineraryData(filteredItineraryData);
    }
  }, [apiResponse]);

  // Update trip dates when dateRange changes
  useEffect(() => {
    if (dateRange && dateRange.includes('|')) {
      try {
        const jsonPart = dateRange.split('|')[1];
        const dateData = JSON.parse(jsonPart);
        setTripStartDate(dateData.arrival_datetime.split('T')[0]);
        setTripEndDate(dateData.departure_datetime.split('T')[0]);
      } catch (e) {
        console.error('Error parsing dateRange for trip dates:', e);
      }
    }
  }, [dateRange]);

  const basePrice = (itineraryData?.person_cost ?? 0) * (itineraryData?.min_group ?? 1);


  if (error && clientIsAuthenticated) {
    console.error('Error details:', error);
    return <div className='text-white flex justify-center items-center h-screen'>
      Error: {error.message}
    </div>;
  }


  const handleBooking = () => {
    // Parse dates from the dateRange string
    let arrivalDatetime, departureDatetime;
    
    // Check if dateRange contains JSON data (pipe-separated format from DateMenu)
    if (dateRange.includes('|')) {
      try {
        // Extract JSON part after the pipe
        const jsonPart = dateRange.split('|')[1];
        const dateData = JSON.parse(jsonPart);
        arrivalDatetime = dateData.arrival_datetime;
        departureDatetime = dateData.departure_datetime;
      } catch (e) {
        console.error('Error parsing date JSON:', e);
        // Fallback to old parsing method
        const displayPart = dateRange.split('|')[0];
        if (displayPart.includes('-')) {
          const [start, end] = displayPart.split('-').map(d => d.trim());
          // Convert display dates back to datetime strings (approximate)
          const currentYear = new Date().getFullYear();
          arrivalDatetime = new Date(start + `, ${currentYear} 09:00:00`).toISOString();
          departureDatetime = new Date(end.replace(/\s*\(\d+\s+days?\)/, '') + `, ${currentYear} 17:00:00`).toISOString();
        }
      }
    } else if (dateRange.includes('-')) {
      // Old format: "Nov 25 - Nov 30"
      const [start, end] = dateRange.split('-').map(d => d.trim());
      // Convert to ISO datetime strings with default times
      const currentYear = new Date().getFullYear();
      arrivalDatetime = new Date(start + `, ${currentYear} 09:00:00`).toISOString();
      departureDatetime = new Date(end.replace(/\s*\(\d+\s+days?\)/, '') + `, ${currentYear} 17:00:00`).toISOString();
    } else {
      // Single date selected
      const startDate = dateRange.trim();
      const currentYear = new Date().getFullYear();
      arrivalDatetime = new Date(startDate + `, ${currentYear} 09:00:00`).toISOString();
      
      // If only arrival date is selected, use itinerary length to calculate departure
      if (itineraryData.length_days) {
        try {
          const arrivalDateObj = new Date(arrivalDatetime);
          const departureDateObj = new Date(arrivalDateObj);
          departureDateObj.setDate(arrivalDateObj.getDate() + itineraryData.length_days);
          departureDatetime = departureDateObj.toISOString();
        } catch (e) {
          console.error('Error calculating departure date:', e);
          departureDatetime = ''; // Set empty if calculation fails
        }
      }
    }
    
    // Store selected dates in localStorage to use in payment flow
    if (arrivalDatetime && departureDatetime) {
      localStorage.setItem('tripDates', JSON.stringify({ 
        arrival_datetime: arrivalDatetime,
        departure_datetime: departureDatetime
      }));
    }
    
    // Navigate to payment page
    router.push(`/payment/${itineraryData._id.$oid}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Handle date selection from DateMenu component
  const handleDateRangeSelect = (startDate: string | null, endDate: string | null) => {
    setTripStartDate(startDate);
    setTripEndDate(endDate);
    
    if (startDate && endDate) {
      setDateRange(`${startDate} - ${endDate}`);
    } else if (startDate) {
      setDateRange(startDate);
    } else {
      setDateRange('');
    }
  };

  return (
    <div className='min-h-screen bg-[#0A0A0A] text-white'>
      {/* Hero Section with Background Image */}
      <div className='relative h-[500px] overflow-hidden'>
        <div className='absolute inset-0'>
          <Image
            src={itineraryData?.images?.[currentIndex] || itineraryData?.images?.[0] || '/images/default-itinerary.jpeg'}
            alt={itineraryData.trip_name}
            fill
            priority
            className='object-cover'
            sizes='100vw'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80' />
        </div>
        
        {/* Navigation Breadcrumb */}
        <div className='relative z-10 p-6'>
          <div className='flex items-center gap-2 text-sm text-white/70'>
            <ArrowLeftIcon 
              className="h-4 w-4 cursor-pointer hover:text-white transition-colors" 
              onClick={() => router.back()} 
            />
            <span>Itineraries</span>
            <span>/</span>
            <span className='text-white'>Denver Tour</span>
          </div>
        </div>
        
        {/* Title */}
        <div className='absolute bottom-24 left-0 right-0 px-6'>
          <h1 className='text-5xl font-bold mb-2'>{itineraryData.trip_name}</h1>
        </div>
        
        {/* Action Buttons */}
        <div className='absolute bottom-6 right-6 flex items-center gap-3'>
          <LikeDislike 
            className='border border-white/20 rounded-full h-10 w-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all' 
            liked={itineraryData?.is_favorite || false} 
            favoriteId={itineraryData?._id.$oid} 
          />
          <Button 
            onClick={() => router.push(`?modal=shareModal&itineraryId=${itineraryData._id.$oid}`)} 
            variant="simple" 
            className='text-white hover:text-white/80'
          >
            Share
          </Button>
          <Button 
            variant="simple" 
            className='text-white hover:text-white/80'
          >
            Manage Members
          </Button>
        </div>
        
        {/* Image Thumbnails */}
        {itineraryData?.images?.length > 1 && (
          <div className='absolute bottom-6 left-6 flex gap-2'>
            {itineraryData.images.slice(0, 8).map((image, index) => (
              <div 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-12 h-12 rounded cursor-pointer overflow-hidden transition-all ${
                  currentIndex === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className='object-cover'
                  sizes='48px'
                />
              </div>
            ))}
            {itineraryData.images.length > 8 && (
              <div className='w-12 h-12 rounded bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs'>
                +{itineraryData.images.length - 8}
              </div>
            )}
          </div>
        )}
        
        {/* Image Navigation */}
        <button 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all'
        >
          <ArrowLeftIcon className='h-5 w-5' />
        </button>
        <button 
          onClick={() => setCurrentIndex(Math.min(itineraryData.images.length - 1, currentIndex + 1))}
          className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all'
        >
          <ArrowRightIcon className='h-5 w-5' />
        </button>
        
        {/* Image Counter */}
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs'>
          {currentIndex + 1} of {itineraryData.images?.length || 1}
        </div>
      </div>

      {/* Main Content */}
      <section className='max-w-[1400px] mx-auto px-6 py-8'>
        <div className='grid lg:grid-cols-[1fr_400px] gap-8'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Overview Section */}
            <div>
              <h2 className='text-2xl font-semibold mb-6'>Overview</h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center'>
                    <CalendarIcon className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>{formatDate(itineraryData.created_at)}</p>
                    <p className='text-sm font-medium'>{itineraryData.length_days} days</p>
                  </div>
                </div>
                
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center'>
                    <LuUsers className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>3 Adults</p>
                    <p className='text-sm font-medium'>{itineraryData.min_group}-{itineraryData.max_group} People</p>
                  </div>
                </div>
                
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center'>
                    <PiClockDuotone className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>6 days 5 nights</p>
                    <p className='text-sm font-medium'>{itineraryData.length_hours} Hours</p>
                  </div>
                </div>
                
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center'>
                    <RiMapPinLine className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>DESTINATIONS</p>
                    <p className='text-sm font-medium'>
                      {itineraryData.start_location?.city === itineraryData.end_location?.city 
                        ? itineraryData.start_location?.city 
                        : `${itineraryData.start_location?.city} to ${itineraryData.end_location?.city}`
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Destination Tags */}
              <div className='mt-6 flex items-center gap-3'>
                <span className='text-sm text-gray-400'>Destinations:</span>
                <div className='flex flex-wrap gap-2'>
                  <span className='px-3 py-1.5 bg-gray-800 rounded-full text-sm'>
                    {itineraryData.start_location?.city}, {itineraryData.start_location?.state}
                  </span>
                  {itineraryData.end_location?.city !== itineraryData.start_location?.city && (
                    <span className='px-3 py-1.5 bg-gray-800 rounded-full text-sm'>
                      {itineraryData.end_location?.city}, {itineraryData.end_location?.state}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Activity Tags */}
              <div className='mt-4 flex flex-wrap gap-2'>
                {itineraryData?.activities?.map((activity, i) => {
                  // Map activities to color schemes
                  const activityColors: Record<string, { bg: string, text: string }> = {
                    'hiking': { bg: 'bg-blue-900/30', text: 'text-blue-400' },
                    'camping': { bg: 'bg-purple-900/30', text: 'text-purple-400' },
                    'sightseeing': { bg: 'bg-green-900/30', text: 'text-green-400' },
                    'gold mine tours': { bg: 'bg-yellow-900/30', text: 'text-yellow-400' },
                    'hot springs': { bg: 'bg-red-900/30', text: 'text-red-400' },
                    'default': { bg: 'bg-gray-900/30', text: 'text-gray-400' }
                  };
                  
                  const activityKey = activity.label.toLowerCase();
                  const colors = activityColors[activityKey] || activityColors['default'];
                  
                  return (
                    <span key={i} className={`px-3 py-1.5 ${colors.bg} ${colors.text} rounded-full text-sm flex items-center gap-1.5`}>
                      <MdOutlineExplore className='h-4 w-4' />
                      {activity.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* About Section */}
            <div>
              <h2 className='text-2xl font-semibold mb-4'>About</h2>
              <p className='text-gray-400 leading-relaxed'>{itineraryData.description}</p>
            </div>
            
          </div>
          {/* Booking Sidebar */}
          <div>
            <div className='sticky top-8'>
              <div className='bg-[#141414] rounded-xl p-6'>
                <h3 className='text-lg font-semibold mb-6'>Reservation Details</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full cursor-pointer border border-gray-700 bg-gray-800/50 text-white rounded-lg p-3 flex items-center justify-between hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <span className='text-sm'>{dateRange ? dateRange.split('|')[0] : 'Select dates'}</span>
                    </div>
                    <ArrowRightIcon className={`h-4 w-4 text-gray-400 transform transition-transform ${showCalendar ? 'rotate-90' : ''}`} />
                  </div>
                  
                  {showCalendar && (
                    <div className="mt-3 border border-gray-700 rounded-lg overflow-hidden">
                      <DateMenu
                        updateSearchValue={(value) => setDateRange(value)}
                        className="!border-0 !rounded-none !px-3 !py-3 !max-w-full !bg-gray-800"
                        itineraryLength={itineraryData?.length_days || 1}
                        onConfirm={() => setShowCalendar(false)}
                        initialStartDate={tripStartDate}
                        initialEndDate={tripEndDate}
                      />
                    </div>
                  )}
                </div>
                
                {/* Cost Breakdown */}
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Activity costs</span>
                    <span className='font-medium'>${itineraryData?.activity_cost || 0}.00</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Lodging costs</span>
                    <span className='font-medium'>${itineraryData?.lodging_cost || 0}.00</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Transport costs</span>
                    <span className='font-medium'>${itineraryData?.transport_cost || 0}.00</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Service fee</span>
                    <span className='font-medium'>${itineraryData?.service_fee || 0}.00</span>
                  </div>
                  <div className="h-px bg-gray-800 my-4"></div>
                  <div className='flex justify-between text-lg font-semibold'>
                    <span>Total amount</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                </div>
                
                {clientIsAuthenticated ? (
                  <>
                    <Button 
                      onClick={handleBooking} 
                      variant='primary' 
                      className='w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2'
                      disabled={!dateRange}
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRightIcon className='h-5 w-5' />
                    </Button>
                    
                    {!dateRange && (
                      <p className="text-yellow-400 text-xs mt-3 text-center">Please select trip dates to continue</p>
                    )}
                  </>
                ) : (
                  <Button 
                    onClick={() => router.push('/auth/signin')} 
                    variant='primary' 
                    className='w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2'
                  >
                    <span>Login to Book</span>
                    <ArrowRightIcon className='h-5 w-5' />
                  </Button>
                )}
              </div>
              
              {/* Itinerary Members */}
              <div className='bg-[#141414] rounded-xl p-6 mt-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-sm font-semibold'>Itinerary Members</h3>
                  <button className='text-xs text-gray-400 hover:text-white' disabled={!clientIsAuthenticated}>Copy Invite Link</button>
                </div>
                
                <div className={`space-y-3 ${!clientIsAuthenticated ? 'blur-sm select-none' : ''}`}>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium'>
                      JJ
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>John James (You)</p>
                      <p className='text-xs text-gray-400'>Trip Leader</p>
                    </div>
                  </div>
                  
                  <button className='w-full py-2 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors' disabled={!clientIsAuthenticated}>
                    Invite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Day View Section */}
        <div className='col-span-full mt-8'>
          <DayView listing={itineraryData} isAuthenticated={clientIsAuthenticated} />
        </div>
        
        {/* Budget and Breakdown Section */}
        <BudgetBreakdown 
          itineraryData={itineraryData}
          basePrice={basePrice}
          clientIsAuthenticated={clientIsAuthenticated}
          onBooking={handleBooking}
          onLogin={() => router.push('/auth/signin')}
        />
      </section>
    </div>
  );
}
