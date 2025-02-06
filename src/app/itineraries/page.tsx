'use client'
import React from 'react'
import { FeaturedVacation } from "@/db/models/itinerary";
import ItineraryCard from '@/src/components/ItineraryCard';
import Button from '@/src/components/figma/Button';
import Newsletter from '@/src/components/Newsletter';
import Footer from '@/src/components/Footer';
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
    return (
        <div className="max-w-[1440px] mx-auto ">

            <div className="grid grid-cols-3 gap-8 p-[80px]">
                <div className="col-span-2 ">
                    <h2 className="text-[40px] font-bold text-white">Itineraries for You</h2>
                    <p className="text-white">Itineraries found.</p>
                    {listings.map((listing) => (
                        <ItineraryCard data={listing} />
                    ))}
                    <div className="flex justify-center flex-col items-center pt-6">
                        <p className="text-white text-xl font-bold">See More Itineraries</p>
                        <Button variant="primary" className="bg-white text-black mt-4 ">Load More</Button>
                    </div>
                </div>
                <div className="col-span-1">
                    <p className=' sticky top-20  mt-4 bg-red-500'>hello</p>
                </div>
            </div>
            <Newsletter />
            <Footer />
        </div>

    )
}

export default Itineraries
