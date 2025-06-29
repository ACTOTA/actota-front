"use client";
import React, { useState, useEffect, useMemo } from "react";
import Button from "../../figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";
import BookingCard from "./BookingCard";
import SortDropdown, { SortOption } from "../../shared/SortDropdown";
import { useBookings } from "@/src/hooks/queries/account/useBookingsQuery";
import { useItineraryById } from "@/src/hooks/queries/itinerarieById/useItineraryByIdQuery";
import { BookingType } from "../../models/Itinerary";
import ClientOnly from "@/src/components/ClientOnly";

const Booking = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("booking-newest");

  const sortOptions: SortOption[] = [
    { id: "booking-newest", name: "Newest Booked First" },
    { id: "booking-oldest", name: "Oldest Booked First" },
    { id: "trip-upcoming", name: "Upcoming Date (Next First)" },
    { id: "trip-past", name: "Upcoming Date (Later First)" }
  ];
  
  const filterOptions = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" }
  ];
  
  const { data: bookings } = useBookings();

  // Store fetched itinerary data to search through
  const [itineraryData, setItineraryData] = useState<Record<string, any>>({});

  // Helper function to parse MongoDB Extended JSON dates
  const parseMongoDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    
    try {
      // If it's already a Date object, return it
      if (dateValue instanceof Date) {
        return dateValue;
      }
      
      // Handle MongoDB Extended JSON format
      if (dateValue.$date) {
        // Handle $numberLong format
        if (dateValue.$date.$numberLong) {
          const timestamp = parseInt(dateValue.$date.$numberLong);
          // TEMPORARY: Add 24 years to test dates from 2001
          // Remove this when your database has correct dates
          const date = new Date(timestamp);
          if (date.getFullYear() < 2020) {
            date.setFullYear(date.getFullYear() + 24);
            console.log('Adjusted old date from', new Date(timestamp), 'to', date);
          }
          return date;
        }
        // Handle direct timestamp
        if (typeof dateValue.$date === 'number') {
          console.log('Parsing $date number:', dateValue.$date, 'as date:', new Date(dateValue.$date));
          return new Date(dateValue.$date);
        }
        // Handle ISO string
        if (typeof dateValue.$date === 'string') {
          console.log('Parsing $date string:', dateValue.$date, 'as date:', new Date(dateValue.$date));
          return new Date(dateValue.$date);
        }
      }
      
      // Handle regular date strings or timestamps
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        const date = new Date(dateValue);
        console.log('Parsing regular value:', dateValue, 'as date:', date);
        return date;
      }
      
      console.log('Could not parse date value:', dateValue);
    } catch (error) {
      console.error('Error parsing date:', error, dateValue);
    }
    
    return null;
  };

  // Helper function to determine trip status based on dates (not payment status)
  const getTripStatus = (booking: BookingType): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'unknown' => {
    // Check if booking is cancelled first
    if (booking.status === 'cancelled' || booking.status === 'refunded') {
      return 'cancelled';
    }
    
    const now = new Date();
    
    // Parse dates handling MongoDB Extended JSON format
    const startDate = parseMongoDate(booking.start_date) || 
                     parseMongoDate(booking.arrival_datetime) || 
                     parseMongoDate((booking as any).arrivalDatetime) ||
                     parseMongoDate((booking as any).arrivalDateTime);
    const endDate = parseMongoDate(booking.end_date) || 
                   parseMongoDate(booking.departure_datetime) || 
                   parseMongoDate((booking as any).departureDatetime) ||
                   parseMongoDate((booking as any).departureDateTime);
    
    if (!startDate) {
      return 'unknown';
    }
    
    if (startDate > now) {
      return 'upcoming'; // Trip hasn't started yet
    } else if (endDate && endDate < now) {
      return 'completed'; // Trip has ended
    } else if (startDate <= now && endDate && endDate >= now) {
      return 'ongoing'; // Trip is currently happening
    } else if (startDate <= now && !endDate) {
      // If no end date and trip has started, assume it's completed
      return 'completed';
    }
    return 'unknown';
  };

  // Filter bookings based on active filter and search term
  const filteredBookings = bookings?.filter((booking) => {
    // Filter by selected filter
    let matchesFilter = true;
    
    if (activeFilter !== "all") {
      const tripStatus = getTripStatus(booking);
      matchesFilter = tripStatus === activeFilter;
    }
    // activeFilter === "all" matches everything

    // For searching through itinerary data
    let itineraryMatches = false;
    const itineraryId = (booking.itinerary_id as { $oid: string })?.$oid;

    if (itineraryId && itineraryData[itineraryId]) {
      const itinerary = itineraryData[itineraryId];
      // Search through relevant itinerary fields
      itineraryMatches =
        (itinerary.trip_name && itinerary.trip_name.toLowerCase().includes(search.toLowerCase())) ||
        (itinerary.description && itinerary.description.toLowerCase().includes(search.toLowerCase()));
    }

    // Filter by search term if provided
    const matchesSearch = search === "" ||
      // Search by booking ID and status
      (booking._id && booking._id.toString().toLowerCase().includes(search.toLowerCase())) ||
      (booking.status && booking.status.toLowerCase().includes(search.toLowerCase())) ||
      // Search by itinerary data
      itineraryMatches;

    return matchesFilter && matchesSearch;
  }) || [];

  // Sort bookings based on selected criteria - using useMemo for proper reactivity
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
    let dateA = 0;
    let dateB = 0;

    if (sortOrder.startsWith("booking-")) {
      // Sort by booking creation date
      dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    } else if (sortOrder.startsWith("trip-")) {
      // Sort by trip start date
      const startDateA = a.start_date || a.arrival_datetime;
      const startDateB = b.start_date || b.arrival_datetime;
      
      dateA = startDateA ? new Date(startDateA).getTime() : 0;
      dateB = startDateB ? new Date(startDateB).getTime() : 0;
    }

    // Sort based on the specific option
    if (sortOrder === "booking-newest") {
      return dateB - dateA; // Newest booked first
    } else if (sortOrder === "booking-oldest") {
      return dateA - dateB; // Oldest booked first
    } else if (sortOrder === "trip-upcoming") {
      return dateA - dateB; // Next trips first (ascending dates)
    } else if (sortOrder === "trip-past") {
      return dateB - dateA; // Later trips first (descending dates)
    }
    
    return 0;
    });
  }, [filteredBookings, sortOrder]);


  const renderContent = () => {
    if (!bookings || bookings.length === 0) {
      return <div className="text-white text-center p-4">No bookings found</div>;
    }

    if (filteredBookings.length === 0) {
      return <div className="text-white text-center p-4">No bookings match your search criteria</div>;
    }

    return (
      <>
        {sortedBookings.map((booking) => {
          return (
            <ClientBookingCard
              key={(booking?._id as { $oid: string }).$oid}
              booking={booking}
            />
          );
        })}
      </>
    );
  };

  const ClientBookingCard = React.memo(({ booking }: { booking: BookingType }) => {
    const itineraryId = (booking.itinerary_id as { $oid: string })?.$oid;
    const { data: itinerary } = useItineraryById(itineraryId || '');

    // Store itinerary data for searching - but only when it changes
    useEffect(() => {
      if (itinerary && itineraryId) {
        setItineraryData(prev => {
          // Only update if the data has changed
          if (prev[itineraryId] === itinerary) {
            return prev;
          }
          return {
            ...prev,
            [itineraryId]: itinerary
          };
        });
      }
    }, [itinerary, itineraryId]);

    return (
      <BookingCard
        dataBooking={booking}
        dataItinerary={itinerary}
      />
    );
  });
  
  ClientBookingCard.displayName = 'ClientBookingCard';

  return (
    <ClientOnly>
      <div className="flex flex-col gap-8">
        {/* header section */}
        <div className="flex flex-col gap-4">
          <div className="font-bold flex items-center justify-between gap-2 text-2xl">
            <p className="">Bookings</p>
          </div>
          
          {/* Filter tags */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((filter) => {
              // Calculate count for each filter
              let count = 0;
              if (bookings) {
                if (filter.id === "all") {
                  count = bookings.length;
                } else {
                  count = bookings.filter(b => getTripStatus(b) === filter.id).length;
                }
              }
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? "bg-yellow-400 text-black"
                      : "bg-[#141414] text-gray-300 hover:bg-[#262626] hover:text-white border border-gray-800"
                  }`}
                >
                  {filter.label}
                  {count > 0 && (
                    <span className="ml-2">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* body section */}
        <div>
          <div className="mb-4 flex gap-2">
            <div className="w-full">
              <div className="relative w-full">
                <Input
                  placeholder="Search bookings by trip name, status, etc."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  value={search}
                  icon={<FiSearch className="w-5 h-5" />}
                  className="px-3 py-2.5"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-gray hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="w-48">
              <SortDropdown
                options={sortOptions}
                onSelect={(option: SortOption) => {
                  setSortOrder(option.id);
                }}
                selectedId={sortOrder}
                showLabel={false}
                className="min-w-[200px]"
              />
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </ClientOnly>
  );
};

export default Booking;
