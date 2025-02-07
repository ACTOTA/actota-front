'use client';

import React from 'react';
import { CiCalendar } from 'react-icons/ci';
import { FaPersonWalking, FaRegHeart } from 'react-icons/fa6';
import { GoHome } from 'react-icons/go';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { GrLocation } from 'react-icons/gr';

const PaymentPageCard = ({
    tripName = 'Fourteeners & Forests',
    dateRange = '22-27 May 2025',
    days = 6,
    nights = 5,
    guests = 3,
    location = 'Denver CO; Aspen CO',
    activities = 6,
    imageSrc = '/images/hero-bg.jpg',
}) => {
    return (
        <div className="!p-4 !rounded-2xl max-w-[843px] flex justify-between items-end hover:cursor-pointer mt-4 bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 border border-primary-gray">
            <div className="flex justify-between gap-4 w-full">
                <div className="flex flex-col justify-between text-white">
                    <div>
                        <div className="inline-flex items-center gap-1 mb-2 bg-black rounded-full p-2 pr-4">
                            <Image src="/svg-icons/diamond.svg" alt="rare find" width={24} height={24} />
                            <span className="">Rare Find!</span>
                        </div>
                        <h3 className="text-2xl font-bold">{tripName}</h3>
                    </div>

                    <div className="flex justify-between gap-4 mt-2 text-sm">
                        <div className='flex flex-col gap-1'>

                            <div className="flex items-center gap-1">
                                <CiCalendar className="h-5 w-5" />
                                <span>{dateRange}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LuUsers className="h-5 w-5" />
                                <span>{days} days {nights} nights</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LuUsers className="h-5 w-5" />
                                <span>{guests} Adults</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GrLocation className="h-5 w-5" />
                                <span>{location}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>


                            <div className="flex items-center gap-1">
                                <CiCalendar className="h-5 w-5" />
                                <span>{dateRange}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaPersonWalking className="h-5 w-5" />
                                <span>{days} days {nights} nights</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LuUsers className="h-5 w-5" />
                                <span>{guests} Adults</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MdOutlineDirectionsCarFilled className="h-5 w-5" />
                                <span>{activities} Activities</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Image
                        src={imageSrc}
                        alt="Trip Image"
                        height={200}
                        width={300}
                        objectFit="cover"
                        className="rounded-lg"
                    />

                </div>
            </div>
        </div>
    );
};

export default PaymentPageCard;
