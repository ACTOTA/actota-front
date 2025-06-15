'use client';

import React from 'react';
import { CiCalendar } from 'react-icons/ci';
import { FaPersonWalking, FaRegHeart } from 'react-icons/fa6';
import { GoHome } from 'react-icons/go';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import { LuUser, LuUsers } from 'react-icons/lu';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { GrLocation } from 'react-icons/gr';
import ListingsSlider from './ListingsSlider';

interface Location {
    city: string;
    state: string;
    coordinates: number[];
}

interface ItineraryData {
    trip_name: string;
    person_cost: number;
    min_group: number;
    max_group: number;
    length_days: number;
    length_hours: number;
    start_location: Location;
    end_location: Location;
    activities: Array<{
        label: string;
        description: string;
        tags: string[];
    }>;
    images: string[];
}

interface PaymentPageCardProps {
    itineraryData: ItineraryData;
}

const PaymentPageCard = ({ itineraryData }: PaymentPageCardProps) => {
    const {
        trip_name,
        length_days,
        length_hours,
        min_group,
        max_group,
        start_location,
        end_location,
        activities,
        images
    } = itineraryData;

    const locationString = `${start_location.city}, ${start_location.state}${
        end_location.city !== start_location.city 
            ? ` to ${end_location.city}, ${end_location.state}`
            : ''
    }`;

    // Format date range (example: showing next available date range)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + length_days);
    const dateRange = `${startDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    })}`;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Section */}
            <div className="lg:w-1/3">
                <Image
                    src={images[0] || '/images/hero-bg.jpg'}
                    alt={trip_name}
                    height={200}
                    width={400}
                    className="rounded-xl w-full h-48 lg:h-full object-cover"
                />
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">{trip_name}</h3>
                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 rounded-full px-3 py-1 text-sm">
                            <Image src="/svg-icons/diamond.svg" alt="rare find" width={16} height={16} />
                            <span className="font-medium">Rare Find!</span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <CiCalendar className="h-5 w-5 text-gray-400" />
                            <span>{dateRange}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Image src="/svg-icons/clock.svg" alt="duration" width={20} height={20} className="opacity-60" />
                            <span>{length_days} day{length_days > 1 ? 's' : ''} ({length_hours} hours)</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <LuUsers className="h-5 w-5 text-gray-400" />
                            <span>{min_group}-{max_group} Guests</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <GrLocation className="h-5 w-5 text-gray-400" />
                            <span>{locationString}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <LuUser className="h-5 w-5 text-gray-400" />
                            <span>Guided Tour</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                                <GoHome className="h-3 w-3 text-red-500" />
                            </div>
                            <span>Accommodation included</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <MdOutlineDirectionsCarFilled className="h-3 w-3 text-yellow-500" />
                            </div>
                            <span>Transportation included</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <FaPersonWalking className="h-3 w-3 text-blue-500" />
                            </div>
                            <span>{activities?.length} Activities</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPageCard;
