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
import { BookingType}  from "../../models/Itinerary";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  // const [bookings, setBookings] = React.useState<any[]>([{
  //   id: 1,
  //   status: "upcoming",
  //   delay_insurance: true,
  //   trip_name: "Lahore",
  //   fareharbor_id: 1,
  //   person_cost: 100,
  //   min_age: 18,
  //   min_guests: 1,
  //   max_guests: 10,
  //   length_days: 1,
  //   length_hours: 1,
  //   start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
  //   end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
  //   description: "Lahore is a city in Pakistan",
  //   days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
  //   activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
  //   images: ["/images/hero-bg.jpg"],
  //   start_date: new Date(),
  //   end_date: new Date(),
  //   created_at: new Date(),
  //   updated_at: new Date()
  // },
  // {
  //   id: 2,
  //   status: "ongoing",
  //   delay_insurance: true,
  //   trip_name: "Lahore",
  //   fareharbor_id: 1,
  //   person_cost: 100,
  //   min_age: 18,
  //   min_guests: 1,
  //   max_guests: 10,
  //   length_days: 1,
  //   length_hours: 1,
  //   start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
  //   end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
  //   description: "Lahore is a city in Pakistan",
  //   days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
  //   activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
  //   images: ["/images/hero-bg.jpg"],
  //   start_date: new Date(),
  //   end_date: new Date(),
  //   created_at: new Date(),
  //   updated_at: new Date()
  // },
  // {
  //   id: 3,
  //   status: "completed",
  //   delay_insurance: true,
  //   trip_name: "Lahore",
  //   fareharbor_id: 1,
  //   person_cost: 100,
  //   min_age: 18,
  //   min_guests: 1,
  //   max_guests: 10,
  //   length_days: 1,
  //   length_hours: 1,
  //   start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
  //   end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
  //   description: "Lahore is a city in Pakistan",
  //   days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
  //   activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
  //   images: ["/images/hero-bg.jpg"],
  //   start_date: new Date(),
  //   end_date: new Date(),
  //   created_at: new Date(),
  //   updated_at: new Date()
  // },
  // ]);
  const { data: bookings } = useBookings();

  bookings?.map((booking: BookingType) => {
    console.log('booking', booking);
    console.log('booking status', booking.status);

    const { data: Itineraries, isLoading, error } = useItineraryById((booking._id as {$oid: string}).$oid);

  });



  
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

  const renderContent = () => {
    const tab = tabs.find((tab) => tab.id === activeTab);


    const result = bookings?.filter((booking) => booking.status === activeTab || activeTab === "all").map((booking) => {

      const { data: itinerary, isLoading, error } = useItineraryById((booking.itinerary_id as {$oid: string}).$oid);

      return ( <BookingCard  key={(booking?._id as {$oid: string}).$oid} dataBooking={booking}  dataItinerary={itinerary} />)


    })

    return result
    // return (
    //   <div>
    //     {bookings?.filter((booking) => booking.status === activeTab || activeTab === "all").map((booking) => (
    //       <BookingCard  key={(booking?._id as {$oid: string}).$oid} dataBooking={booking}  dataItinerary={Itineraries[0]} />
    //     ))}
    //   </div>
    // )
  };

  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
      <div className="flex flex-col gap-4">
        <div className="font-bold flex items-center justify-between gap-2 text-2xl"><p className="">Bookings</p>
        <Link
            href="/profile/bookings"
            className="text-base border-b-2 border-[#BBD4FB] text-[#BBD4FB] md:hidden"
          >
            Can’t find your booking?
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
            Can’t find your booking?
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
  );
};

export default Booking;
