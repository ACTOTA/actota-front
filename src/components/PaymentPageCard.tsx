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
        <div className="md:!p-4 !rounded-2xl max-w-[843px]  hover:cursor-pointer mt-4 bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 border border-primary-gray max-md:!bg-transparent max-md:border-none">
            <div className="relative flex justify-between items-center max-md:flex-col-reverse gap-4 w-full max-md:!bg-transparent">
                <div className="flex flex-col justify-between text-white max-md:w-full max-md:!bg-transparent">
                    <div>

                        <div className=" inline-flex items-center max-md:absolute max-md:top-2 max-md:left-2 gap-1 mb-2 bg-black rounded-full p-2 pr-4">
                           
                            <Image src="/svg-icons/diamond.svg" alt="rare find" width={24} height={24} />
                            <span className="">Rare Find!</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold">{trip_name}</h3>

                    <div className="flex justify-between gap-4 mt-2 text-sm max-md:w-full max-md:!bg-transparent">
                        <div className='flex flex-col gap-1'>

                            <div className="flex items-center gap-1">
                                <CiCalendar className="h-5 w-5" />
                                <span>{dateRange}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src="/svg-icons/clock.svg" alt="duration" width={20} height={20} />
                                <span>{length_days} day{length_days > 1 ? 's' : ''} ({length_hours} hours)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LuUsers className="h-5 w-5" />
                                <span>{min_group}-{max_group} Guests</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GrLocation className="h-5 w-5" />
                                <span>{locationString}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>


                            <div className="flex items-center gap-1">
                                <LuUser className="h-5 w-5" />
                                <span>Guided Tour</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GoHome className="h-5 w-5" />
                                <span>{length_days} day trip</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image 
                                    src="/transportation-icons/sedan.svg" 
                                    alt="transportation" 
                                    width={20} 
                                    height={20} 
                                />
                                <span>Transportation included</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image 
                                    src="/activity-icons/hiking.svg" 
                                    alt="activities" 
                                    width={20} 
                                    height={20} 
                                />
                                <span>{activities?.length} Activities</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Image
                    src={images[0] || '/images/hero-bg.jpg'}
                    alt={trip_name}
                    height={200}
                    width={300}
                    objectFit="cover"
                    className="rounded-lg max-md:w-full"
                />

            </div>
        </div>
    );
};

export default PaymentPageCard;
