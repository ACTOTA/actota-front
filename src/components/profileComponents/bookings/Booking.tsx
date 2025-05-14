"use client";
import React, { useState, useEffect } from "react";
import Button from "../../figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";
import BookingCard from "./BookingCard";
import Dropdown from "../../figma/Dropdown";
import { useBookings } from "@/src/hooks/queries/account/useBookingsQuery";
import { useItineraryById } from "@/src/hooks/queries/itinerarieById/useItineraryByIdQuery";
import { BookingType } from "../../models/Itinerary";
import ClientOnly from "@/src/components/ClientOnly";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { data: bookings } = useBookings();

  // Store fetched itinerary data to search through
  const [itineraryData, setItineraryData] = useState<Record<string, any>>({});

  // const tabs = [
  //   {
  //     id: "all",
  //     label: "All",
  //   },
  //   {
  //     id: "ongoing",
  //     label: "Ongoing",
  //   },
  //   {
  //     id: "upcoming",
  //     label: "Upcoming",
  //   },
  //   {
  //     id: "completed",
  //     label: "Completed",
  //   },
  // ];

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings?.filter((booking) => {
    // Filter by tab
    const matchesTab = booking.status === activeTab || activeTab === "all";

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

    return matchesTab && matchesSearch;
  }) || [];

  // Sort bookings by created_at date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

    console.log("dateA: ", dateA);
    console.log("dateB: ", dateB);

    // Sort by newest (descending) or oldest (ascending)
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Log the sorted bookings for verification
  useEffect(() => {
    console.log("Sorting order:", sortOrder);
    console.log("Sorted bookings:", sortedBookings.map(booking => ({
      id: booking._id,
      created_at: booking.created_at,
      status: booking.status
    })));
  }, []);

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

  return (
    <ClientOnly>
      <div className="flex flex-col gap-8">
        {/* header section */}
        <div className="flex flex-col gap-4">
          <div className="font-bold flex items-center justify-between gap-2 text-2xl"><p className="">Bookings</p></div>
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
            </div>
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
            <div className="inline-flex">
              <Dropdown
                options={["Newest", "Oldest"]}
                onSelect={(option: any) => {
                  setSortOrder(option.toLowerCase() as "newest" | "oldest");
                }}
                className="border-none !bg-[#141414]"
                placeholder={sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
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
