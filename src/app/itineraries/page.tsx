'use client'
import React, { useState } from 'react'
import { FeaturedVacation } from "@/db/models/itinerary";
import ItineraryCard from '@/src/components/ItineraryCard';
import Button from '@/src/components/figma/Button';
import Newsletter from '@/src/components/Newsletter';
import Footer from '@/src/components/Footer';
import Filter from '@/src/components/DrawerModal';
import ItineraryPageFilter from '@/src/components/ItineraryPageFilter';
import ItineraryPageAdvanceFilter from '@/src/components/ItineraryPageAdvanceFilter';
import Dropdown from '@/src/components/figma/Dropdown';
import Image from 'next/image';
import ListingCard from '@/src/components/ListingCard';
const Itineraries = () => {
    const [listings, setListings] = React.useState<FeaturedVacation[]>([{
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }, {
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }]);
    const [advanceFilter, setAdvanceFilter] = useState(false)

    return (
        <div className="max-w-[1440px] mx-auto ">

            <div className="flex max-md:flex-col-reverse gap-8 p-[80px] max-lg:px-[50px] max-md:px-[25px] max-sm:px-[16px] bg-gradient-to-b from-transparent via-[#080E14] to-[#080E14] ">
                <div className="w-[66%] max-md:w-full ">
                    <h2 className="text-[40px] font-bold text-white max-md:hidden">Itineraries for You</h2>
                    <div className="flex items-center justify-between flex-wrap gap-2">

                        <p className="text-white"> <b>{listings.length}</b> Itineraries found.</p>


                        <div className="flex items-center max-md:justify-between gap-4">
                            <div>

                                <Dropdown label={<div className="flex items-center gap-1">
                                    <Image src="/svg-icons/leaf.svg" alt="dropdown-arrow" width={24} height={24} />
                                    <p className="text-primary-gray text-sm  mr-5">Theme</p>
                                </div>} options={["popular", "new", "old"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />
                            </div>
                            <div>

                                <Dropdown label={<div className="flex items-center gap-1">
                                    <div>

                                        <Image src="/svg-icons/chevron-selector.svg" alt="dropdown-arrow" width={24} height={24} />
                                    </div>
                                </div>} options={["Lowest Price", "Highest Price", "Any Duration"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />

                            </div>


                        </div>




                    </div>
                    <div className='max-sm:hidden'>
                        {listings.map((listing) => (
                            <ItineraryCard data={listing} />
                        ))}
                    </div>
                    <div className='sm:hidden flex flex-col'>
                        {listings.map((listing) => (
                            <ListingCard data={listing} />
                        ))}
                    </div>
                    <div className="flex justify-center flex-col items-center pt-6">
                        <p className="text-white text-xl font-bold">See More Itineraries</p>
                        <Button variant="primary" className="bg-white text-black mt-4 ">Load More</Button>
                    </div>
                </div>
                <div className=" md:pt-14 w-[33%] max-md:w-full">
                    {advanceFilter ?
                        <ItineraryPageAdvanceFilter advanceFilter={advanceFilter} setAdvanceFilter={setAdvanceFilter} />
                        :
                        <ItineraryPageFilter advanceFilter={advanceFilter} setAdvanceFilter={setAdvanceFilter} />
                    }
                </div>
                <h2 className="text-[40px] font-bold text-white md:hidden">Itineraries for You</h2>

            </div>
            <Newsletter />
            <Footer />
        </div>

    )
}

export default Itineraries
