import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import Image from 'next/image';
import { FaPersonWalking } from 'react-icons/fa6';
import { GoClock } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { IoLeafOutline } from "react-icons/io5";
import LikeDislike from './LikeDislike';

interface ListingCardProps {
    data: any;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
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

    return (
        <div 
            onClick={() => router.push(`/itineraries/${data._id.$oid}`)}
            className='group relative bg-gray-900 rounded-2xl overflow-hidden cursor-pointer 
                       transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl'
        >
            {/* Image Container with fixed aspect ratio */}
            <div className='relative w-full aspect-[4/5]'>
                <Image 
                    src={data.images[0] || '/images/default-itinerary.jpeg'} 
                    alt={data.trip_name}
                    layout='fill' 
                    objectFit='cover'
                    className='transition-transform duration-300 group-hover:scale-105'
                />
                
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                {/* Top Controls */}
                <div className='absolute top-4 left-4 right-4 flex justify-between items-start'>
                    {/* Category Tag */}
                    <div className='flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5'>
                        <IoLeafOutline className='w-4 h-4 text-white' />
                        <span className='text-xs font-medium text-white'>
                            {data?.category || 'Mindfulness'}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`?modal=shareModal&itineraryId=${data._id.$oid}`)
                            }}
                            className='w-9 h-9 bg-black/60 backdrop-blur-md rounded-full 
                                     flex items-center justify-center transition-all hover:bg-black/80'
                        >
                            <Image src="/svg-icons/share.svg" alt="share" height={18} width={18} />
                        </button>
                        <LikeDislike 
                            liked={data.isFavorite ? data.isFavorite : false} 
                            favoriteId={data._id.$oid} 
                        />
                    </div>
                </div>

                {/* Content Overlay */}
                <div className='absolute bottom-0 left-0 right-0 p-4'>
                    <div className='bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10'>
                        {/* Title and Location */}
                        <h3 className='font-bold text-white text-lg line-clamp-1 mb-1'>
                            {data?.trip_name}
                        </h3>
                        <p className='text-gray-300 text-sm mb-3'>
                            {data?.start_location.city}
                        </p>

                        {/* Stats Row */}
                        <div className='flex items-center gap-3 sm:gap-4 mb-3 flex-wrap'>
                            <div className='flex items-center gap-1.5'>
                                <GoClock className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400' />
                                <span className='text-xs text-gray-300'>
                                    {data?.length_days} {data?.length_days > 1 ? "Days" : "Day"}
                                </span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <LuUsers className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400' />
                                <span className='text-xs text-gray-300'>
                                    {data?.min_guests > 1 ? `${data?.min_guests}-${data.max_guests}` : "0"}
                                </span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <FaPersonWalking className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400' />
                                <span className='text-xs text-gray-300'>
                                    {data?.activities?.length || 0} {data?.activities?.length === 1 ? "Activity" : "Activities"}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='flex items-baseline gap-1'>
                            <span className='text-xs text-gray-400'>From</span>
                            <span className='text-2xl font-bold text-white'>
                                ${data?.person_cost}
                            </span>
                            <span className='text-xs text-gray-400'>per person</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListingCard;