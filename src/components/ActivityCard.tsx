'use client';
import React from 'react';
import { BiSolidMap } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDirections, MdOutlineDirectionsCarFilled, MdOutlineExplore } from 'react-icons/md';
import Image from 'next/image';
import { IoLocationOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { LuRoute } from 'react-icons/lu';
import Button from './figma/Button';
interface ActivityCardProps {
    activity: {
        name: string;
        type: string;
        time: string;
        location: {
            name: string;
            coordinates: number[];
        };
    };
    formatTime: (time: string) => string;
    getActivityIcon: (type: string) => JSX.Element;
    setIsFeedbackDrawerOpen?: (isFeedbackDrawerOpen: boolean) => void;
}

const ActivityCard = ({ activity, formatTime, getActivityIcon, setIsFeedbackDrawerOpen }: ActivityCardProps) => {
    return (
        <div className="flex flex-col gap-4 border-border-primary">
            {/* Time Column */}
            <div className="w-fit -ml-16 text-sm bg-gray-900 rounded-full px-2 py-1">
                <span className="text-white">{formatTime(activity.time)}</span>
            </div>

            {/* Activity Card */}
            <div className="flex-1 bg-gradient-to-br from-[#FEDB25] via-border-primary to-border-primary rounded-xl p-[2px]">
                <div className="flex-1 bg-black rounded-xl">

                    <div className="flex-1 bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-4 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-bold">{activity.name}</h3>
                            </div>
                        </div>

                        <div className="flex justify-between items-end ">
                            <div className="flex items-start gap-10">

                                {/* Location Info */}
                                <div className="bg-black/30 rounded-lg p-3 w-[250px]">
                                    <div className="flex items-center gap-2 text-white/70 mb-2">
                                        <BiSolidMap className="w-4 h-4" />
                                        <span>Location</span>
                                    </div>
                                    <p className="text-white text-sm">{activity.location.name}</p>
                                </div>

                                {/* Duration */}
                                <div className='flex flex-col gap-1 max-sm:hidden'>

                                    <div className="flex items-center gap-2">
                                        <FaRegClock className="w-4 h-4 text-white" />
                                        <span className="text-white text-sm">1 hour</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MdOutlineDirectionsCarFilled className="w-4 h-4 text-white" />
                                        <span className="text-white text-sm">1 hour</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuRoute className="w-4 h-4 text-white" />
                                        <span className="text-white text-sm">4.9 miles</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className=" flex flex-col items-end">
                                {setIsFeedbackDrawerOpen && (
                                    <Button variant='primary' onClick={() => setIsFeedbackDrawerOpen(true)} className='absolute top-4 right-4'> Give Feedback</Button>
                                )}

                                <p className='text-white'>$0.2</p>
                                <span className="text-primary-gray text-sm">per person</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ActivityCard; 