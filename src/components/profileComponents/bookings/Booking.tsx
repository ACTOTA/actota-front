"use client";
import React, { useState } from "react";
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
  const { data: bookings } = useBookings();

  const tabs = [
    {
      id: "all",
      label: "All",
    },
    {
      id: "ongoing",
      label: "Ongoing",
    },
    {
      id: "upcoming",
      label: "Upcoming",
    },
    {
      id: "completed",
      label: "Completed",
    },
  ];

  // Filter bookings based on active tab
  const filteredBookings = bookings?.filter((booking) => booking.status === activeTab || activeTab === "all") || [];

  const renderContent = () => {
    if (!bookings || bookings.length === 0) {
      return <div className="text-white text-center p-4">No bookings found</div>;
    }

    return (
      <>
        {filteredBookings.map((booking) => {
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

  const ClientBookingCard = ({ booking }: { booking: BookingType }) => {
    console.log("Booking:", booking);
    const itineraryId = (booking.itinerary_id as { $oid: string })?.$oid;
    const { data: itinerary } = useItineraryById(itineraryId || '');


    return (
      <BookingCard
        dataBooking={booking}
        dataItinerary={itinerary}
      />
    );
  };

  return (
    <ClientOnly>
      <div className="flex flex-col gap-8">
        {/* header section */}
        <div className="flex flex-col gap-4">
          <div className="font-bold flex items-center justify-between gap-2 text-2xl"><p className="">Bookings</p>
            <Link
              href="/profile/bookings"
              className="text-base border-b-2 border-[#BBD4FB] text-[#BBD4FB] md:hidden"
            >
              Can't find your booking?
            </Link></div>
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="outline"
                  size="sm"
                  className={
                    activeTab === tab.id
                      ? "!border-white !text-white"
                      : "!border-border-primary !text-border-primary"
                  }
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            <Link
              href="/profile/bookings"
              className="text-base border-b-2 border-[#BBD4FB] text-[#BBD4FB] max-md:hidden"
            >
              Can't find your booking?
            </Link>
          </div>
        </div>
        {/* body section */}
        <div>
          <div className="mb-4 flex gap-2">
            <div className="w-full">
              <Input
                placeholder="Select Your Bookings"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                icon={<FiSearch className="w-5 h-5" />}
                className="px-3 py-2.5 "
              />
            </div>
            <div className="inline-flex">
              <Dropdown
                options={["Newest", "Oldest"]}
                onSelect={() => { }}
                className="border-none !bg-[#141414]"
                placeholder="Newest"
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
