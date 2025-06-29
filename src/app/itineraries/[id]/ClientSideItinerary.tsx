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

// Helper function to parse date strings safely in local timezone
const parseLocalDate = (dateStr: string): Date => {
  // Parse YYYY-MM-DD format in local timezone instead of UTC
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

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
  const [isHydrated, setIsHydrated] = useState(false);

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

    // Check for search parameters for group size
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const adults = urlParams.get('adults');
      const children = urlParams.get('children');
      
      if (adults) {
        setSelectedAdults(parseInt(adults) || 2);
      }
      if (children) {
        setSelectedChildren(parseInt(children) || 0);
      }
    }
    
    setIsHydrated(true);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itineraryData, setItineraryData] = useState<ItineraryData>(initialData);
  const [dateRange, setDateRange] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [tripStartDate, setTripStartDate] = useState<string | null>(null);
  const [tripEndDate, setTripEndDate] = useState<string | null>(null);
  const [selectedAdults, setSelectedAdults] = useState<number>(2);
  const [selectedChildren, setSelectedChildren] = useState<number>(0);
  const [showGroupSelector, setShowGroupSelector] = useState<boolean>(false);

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

  // Close group selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showGroupSelector) {
        const target = event.target as Element;
        if (!target.closest('.group-selector-container')) {
          setShowGroupSelector(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGroupSelector]);

  const totalPeople = selectedAdults + selectedChildren;
  const basePrice = (itineraryData?.person_cost ?? 0) * totalPeople;
  
  // Use actual costs from backend, scaled by group size
  const activityCost = (itineraryData?.activity_cost || 0) * totalPeople;
  const lodgingCost = (itineraryData?.lodging_cost || 0) * totalPeople;
  const transportCost = (itineraryData?.transport_cost || 0) * totalPeople;
  const serviceFee = (itineraryData?.service_fee || 0) * totalPeople;
  
  // Calculate total by adding up all components
  const calculatedTotal = activityCost + lodgingCost + transportCost + serviceFee;


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
    if (!date) return 'Select dates';
    try {
      return parseLocalDate(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Select dates';
    }
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

  // Prevent hydration mismatch by not rendering until client state is set
  if (!isHydrated) {
    return (
      <div className='min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0A0A0A] text-white'>
      {/* Hero Section with Background Image */}
      <div className='relative h-[400px] md:h-[600px] overflow-hidden'>
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
        <div className='relative z-10 pt-20 md:pt-24 px-4 md:px-6'>
          <div className='flex items-center gap-2 text-sm text-white/70'>
            <ArrowLeftIcon 
              className="h-4 w-4 cursor-pointer hover:text-white transition-colors" 
              onClick={() => router.back()} 
            />
            <span>Itineraries</span>
            <span>/</span>
            <span className='text-white'>{itineraryData.trip_name}</span>
          </div>
        </div>
        
        {/* Title */}
        <div className='absolute bottom-20 md:bottom-24 left-0 right-0 px-4 md:px-6'>
          <h1 className='text-3xl md:text-5xl font-bold mb-2'>{itineraryData.trip_name}</h1>
        </div>
        
        {/* Action Buttons */}
        <div className='absolute bottom-4 md:bottom-6 right-4 md:right-6 flex items-center gap-2 md:gap-3'>
          <LikeDislike 
            className='border border-white/20 rounded-full h-9 w-9 md:h-10 md:w-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all' 
            liked={itineraryData?.is_favorite || false} 
            favoriteId={itineraryData?._id.$oid} 
          />
          <Button 
            onClick={() => router.push(`?modal=shareModal&itineraryId=${itineraryData._id.$oid}`)} 
            variant="simple" 
            className='text-white hover:text-white/80 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2'
          >
            Share
          </Button>
          <Button 
            variant="simple" 
            className='text-white hover:text-white/80 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 hidden sm:block'
          >
            Manage Members
          </Button>
        </div>
        
        {/* Image Thumbnails */}
        {itineraryData?.images?.length > 1 && (
          <div className='absolute bottom-4 md:bottom-6 left-4 md:left-6 flex gap-1 md:gap-2'>
            {itineraryData.images.slice(0, 8).map((image, index) => (
              <div 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded cursor-pointer overflow-hidden transition-all ${
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
              <div className='w-10 h-10 md:w-12 md:h-12 rounded bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs'>
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
        <div className='absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs'>
          {currentIndex + 1} of {itineraryData.images?.length || 1}
        </div>
      </div>

      {/* Main Content */}
      <section className='max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8'>
        <div className='flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8'>
          {/* Left Column */}
          <div className='space-y-6 order-1 lg:order-1'>
            {/* Overview Section */}
            <div className='bg-[#141414] rounded-xl md:rounded-2xl p-6 md:p-8'>
              <h2 className='text-xl md:text-2xl font-semibold mb-6 md:mb-8'>Overview</h2>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8'>
                <div className='flex items-start gap-3 md:gap-4'>
                  <div className='w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/20'>
                    <CalendarIcon className='h-5 w-5 md:h-6 md:w-6 text-blue-400' />
                  </div>
                  <div>
                    <p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-1'>Duration</p>
                    <p className='text-sm md:text-base font-semibold text-white'>{itineraryData.length_days} Days</p>
                  </div>
                </div>
                
                <div className='flex items-start gap-3 md:gap-4 relative group-selector-container'>
                  <div className='w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/20'>
                    <LuUsers className='h-5 w-5 md:h-6 md:w-6 text-green-400' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-1'>Group Size</p>
                    <button 
                      onClick={() => setShowGroupSelector(!showGroupSelector)}
                      className='text-sm md:text-base font-semibold text-white hover:text-green-400 transition-colors text-left'
                    >
                      {selectedAdults + selectedChildren} {selectedAdults + selectedChildren === 1 ? 'Person' : 'People'}
                    </button>
                    <p className='text-[10px] md:text-xs text-gray-500 mt-0.5'>
                      {selectedAdults} Adult{selectedAdults !== 1 ? 's' : ''}{selectedChildren > 0 ? `, ${selectedChildren} Child${selectedChildren !== 1 ? 'ren' : ''}` : ''}
                    </p>
                    
                    {/* Group Size Selector Dropdown */}
                    {showGroupSelector && (
                      <div className='absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 w-72 z-10 shadow-xl'>
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-300'>Adults</span>
                            <div className='flex items-center gap-3'>
                              <button 
                                onClick={() => setSelectedAdults(Math.max(1, selectedAdults - 1))}
                                className='w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white'
                                disabled={selectedAdults <= 1}
                              >
                                -
                              </button>
                              <span className='w-8 text-center text-white'>{selectedAdults}</span>
                              <button 
                                onClick={() => setSelectedAdults(Math.min(itineraryData.max_group, selectedAdults + 1))}
                                className='w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white'
                                disabled={selectedAdults + selectedChildren >= itineraryData.max_group}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-300'>Children</span>
                            <div className='flex items-center gap-3'>
                              <button 
                                onClick={() => setSelectedChildren(Math.max(0, selectedChildren - 1))}
                                className='w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white'
                                disabled={selectedChildren <= 0}
                              >
                                -
                              </button>
                              <span className='w-8 text-center text-white'>{selectedChildren}</span>
                              <button 
                                onClick={() => setSelectedChildren(Math.min(itineraryData.max_group - selectedAdults, selectedChildren + 1))}
                                className='w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white'
                                disabled={selectedAdults + selectedChildren >= itineraryData.max_group}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className='pt-2 border-t border-gray-700'>
                            <p className='text-xs text-gray-400'>
                              Group size: {itineraryData.min_group}-{itineraryData.max_group} people
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className='flex items-start gap-3 md:gap-4'>
                  <div className='w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/20'>
                    <PiClockDuotone className='h-5 w-5 md:h-6 md:w-6 text-purple-400' />
                  </div>
                  <div>
                    <p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-1'>Schedule</p>
                    <p className='text-sm md:text-base font-semibold text-white'>
                      {tripStartDate && tripEndDate ? (
                        `${formatDate(tripStartDate)}`
                      ) : (
                        'Flexible'
                      )}
                    </p>
                    <p className='text-[10px] md:text-xs text-gray-500 mt-0.5'>
                      {tripStartDate && tripEndDate ? (
                        `${itineraryData.length_days} day${itineraryData.length_days !== 1 ? 's' : ''} selected`
                      ) : (
                        'Choose your dates'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className='flex items-start gap-3 md:gap-4'>
                  <div className='w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/20'>
                    <RiMapPinLine className='h-5 w-5 md:h-6 md:w-6 text-orange-400' />
                  </div>
                  <div>
                    <p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-1'>Route</p>
                    <p className='text-xs md:text-sm lg:text-base font-semibold text-white'>
                      {itineraryData.start_location?.city === itineraryData.end_location?.city 
                        ? itineraryData.start_location?.city 
                        : `${itineraryData.start_location?.city} → ${itineraryData.end_location?.city}`
                      }
                    </p>
                    <p className='text-[10px] md:text-xs text-gray-500 mt-0.5'>Colorado</p>
                  </div>
                </div>
              </div>
              
              {/* Activity Tags */}
              <div className='mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-800'>
                <h3 className='text-xs md:text-sm font-medium text-gray-400 mb-3 md:mb-4'>Activities Included</h3>
                <div className='flex flex-wrap gap-1.5 md:gap-2'>
                  {itineraryData?.activities?.map((activity, i) => {
                    // Map activities to color schemes
                    const activityColors: Record<string, { bg: string, text: string, border: string }> = {
                      'hiking': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
                      'camping': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
                      'sightseeing': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
                      'gold mine tours': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                      'hot springs': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
                      'default': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' }
                    };
                    
                    const activityKey = activity.label.toLowerCase();
                    const colors = activityColors[activityKey] || activityColors['default'];
                    
                    return (
                      <span key={i} className={`px-3 md:px-4 py-1.5 md:py-2 ${colors.bg} ${colors.text} ${colors.border} border rounded-md md:rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2`}>
                        <MdOutlineExplore className='h-3 w-3 md:h-4 md:w-4' />
                        {activity.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className='order-2 lg:order-1'>
              <h2 className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>About</h2>
              <p className='text-sm md:text-base text-gray-400 leading-relaxed'>{itineraryData.description}</p>
            </div>
            
          </div>
          {/* Booking Sidebar */}
          <div className='order-3 lg:order-2 w-full lg:w-auto'>
            <div className='lg:sticky lg:top-8'>
              <div className='bg-[#141414] rounded-xl p-5 md:p-6'>
                <h3 className='text-base md:text-lg font-semibold mb-4 md:mb-6'>Reservation Details</h3>
                
                {/* Date Selection */}
                <div className="mb-4 md:mb-6">
                  <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full cursor-pointer border border-gray-700 bg-gray-800/50 text-white rounded-lg p-3 flex items-center justify-between hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <span className='text-sm md:text-base'>{dateRange ? dateRange.split('|')[0] : 'Select dates'}</span>
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
                        allowManualDateRange={false}
                      />
                    </div>
                  )}
                </div>
                
                {/* Cost Breakdown */}
                <div className='space-y-3 md:space-y-4 mb-4 md:mb-6'>
                  <div className='flex justify-between text-xs md:text-sm'>
                    <span className='text-gray-400'>Activity costs</span>
                    <span className='font-medium'>${activityCost}.00</span>
                  </div>
                  <div className='flex justify-between text-xs md:text-sm'>
                    <span className='text-gray-400'>Lodging costs</span>
                    <span className='font-medium'>${lodgingCost}.00</span>
                  </div>
                  <div className='flex justify-between text-xs md:text-sm'>
                    <span className='text-gray-400'>Transport costs</span>
                    <span className='font-medium'>${transportCost}.00</span>
                  </div>
                  <div className='flex justify-between text-xs md:text-sm'>
                    <span className='text-gray-400'>Service fee</span>
                    <span className='font-medium'>${serviceFee}.00</span>
                  </div>
                  <div className="h-px bg-gray-800 my-4"></div>
                  <div className='flex justify-between text-base md:text-lg font-semibold'>
                    <span>Total amount</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {clientIsAuthenticated ? (
                  <>
                    <Button 
                      onClick={handleBooking} 
                      variant='primary' 
                      className='w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium md:font-semibold py-2.5 md:py-3 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base'
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
                    className='w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium md:font-semibold py-2.5 md:py-3 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base'
                  >
                    <span>Login to Book</span>
                    <ArrowRightIcon className='h-5 w-5' />
                  </Button>
                )}
              </div>
              
              {/* Itinerary Members */}
              <div className='bg-[#141414] rounded-xl p-5 md:p-6 mt-4'>
                <div className='flex items-center justify-between mb-3 md:mb-4'>
                  <h3 className='text-xs md:text-sm font-semibold'>Itinerary Members</h3>
                  <button className='text-[10px] md:text-xs text-gray-400 hover:text-white' disabled={!clientIsAuthenticated}>Copy Invite Link</button>
                </div>
                
                <div className={`space-y-3 ${!clientIsAuthenticated ? 'blur-sm select-none' : ''}`}>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium'>
                      JJ
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs md:text-sm font-medium'>John James (You)</p>
                      <p className='text-[10px] md:text-xs text-gray-400'>Trip Leader</p>
                    </div>
                  </div>
                  
                  <button className='w-full py-2 border border-gray-700 rounded-lg text-xs md:text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors' disabled={!clientIsAuthenticated}>
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
          itineraryData={{
            ...itineraryData,
            activity_cost: activityCost,
            lodging_cost: lodgingCost,
            transport_cost: transportCost,
            service_fee: serviceFee
          }}
          basePrice={calculatedTotal}
          clientIsAuthenticated={clientIsAuthenticated}
          onBooking={handleBooking}
          onLogin={() => router.push('/auth/signin')}
        />
      </section>
    </div>
  );
}
