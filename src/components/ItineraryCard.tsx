'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { FaPersonWalking } from 'react-icons/fa6';
import { GoClock } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { IoLeafOutline } from "react-icons/io5";
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import LikeDislike from './LikeDislike';
interface ListingCardProps {
    data: any;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
}

const ItineraryCard: React.FC<ListingCardProps> = ({
    data,
    onAction,
    disabled = false,
    actionLabel,
    actionId = "",
}) => {
    const router = useRouter();

    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onAction?.(actionId)
        }, [disabled, onAction, actionId]);

    // Extract location info
    const location = data?.start_location?.city || 'Unknown Location';
    
    return (
        <div 
            onClick={() => router.push(`/itineraries/${data._id.$oid}`)}
            className='group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer 
                       transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:bg-gray-900/70
                       border border-gray-800/50 hover:border-gray-700/50 mt-4 max-w-[864px]'
        >
            {/* Main Content */}
            <div className='flex gap-6 p-6'>
                {/* Left Content */}
                <div className='flex-1 space-y-4'>
                    {/* Header with Title and Price */}
                    <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                            <h3 className='text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors'>
                                {data?.trip_name}
                            </h3>
                            <p className='text-gray-400 text-sm flex items-center gap-1.5'>
                                <IoLeafOutline className='w-4 h-4' />
                                {location}
                            </p>
                        </div>
                        
                        <div className='text-right'>
                            <p className='text-xs text-gray-500'>from</p>
                            <p className='text-2xl font-bold text-white'>
                                ${data?.person_cost ? 
                                    (typeof data.person_cost === 'string' ? 
                                        parseFloat(data.person_cost).toLocaleString() : 
                                        data.person_cost.toLocaleString()
                                    ) : '0'}
                            </p>
                            <p className='text-xs text-gray-400'>per person</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className='flex items-center gap-6 text-gray-300'>
                        <div className='flex items-center gap-2'>
                            <GoClock className='w-4 h-4 text-gray-400' />
                            <span className='text-sm'>
                                {data?.length_days} {data?.length_days > 1 ? "Days" : "Day"}
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <LuUsers className='w-4 h-4 text-gray-400' />
                            <span className='text-sm'>
                                {data?.min_guests > 1 ? `${data?.min_guests}-${data.max_guests}` : "Flexible"}
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <MdOutlineDirectionsCarFilled className='w-4 h-4 text-gray-400' />
                            <span className='text-sm'>
                                {data?.activities?.length || 0} {data?.activities?.length === 1 ? "Activity" : "Activities"}
                            </span>
                        </div>
                    </div>

                    {/* Category Tags */}
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-700/50'>
                            <IoLeafOutline className='w-3.5 h-3.5 text-yellow-400' />
                            <span className='text-xs font-medium text-white'>
                                {data?.category || 'Mindfulness'}
                            </span>
                        </div>
                        {data?.difficulty && (
                            <div className='flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-700/50'>
                                <FaPersonWalking className='w-3.5 h-3.5 text-blue-400' />
                                <span className='text-xs font-medium text-white'>
                                    {data.difficulty}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Image */}
                <div className='relative w-64 h-48 rounded-xl overflow-hidden flex-shrink-0'>
                    <Image 
                        src={data.images[0] || '/images/default-itinerary.jpeg'} 
                        alt={data?.trip_name}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    
                    {/* Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
                    
                    {/* Action Buttons */}
                    <div className='absolute top-3 right-3 flex gap-2'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`?modal=shareModal&itineraryId=${data._id.$oid}`)
                            }}
                            className='w-8 h-8 bg-black/60 backdrop-blur-md rounded-full 
                                     flex items-center justify-center transition-all hover:bg-black/80
                                     border border-white/10'
                        >
                            <Image src="/svg-icons/share.svg" alt="share" height={16} width={16} />
                        </button>
                        <LikeDislike 
                            liked={data.isFavorite ? data.isFavorite : false} 
                            favoriteId={data._id.$oid}
                            className='w-8 h-8 bg-black/60 backdrop-blur-md border border-white/10'
                        />
                    </div>
                </div>
            </div>

            {/* Hover Effect Border */}
            <div className='absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-400/20 transition-colors pointer-events-none' />
        </div>

    );
}

export default ItineraryCard;
