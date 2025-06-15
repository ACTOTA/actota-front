'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import { FaPersonWalking } from 'react-icons/fa6';
import { LuUsers } from "react-icons/lu";
import { IoLeafOutline } from "react-icons/io5";
import { MdAccessTime } from 'react-icons/md';
import LikeDislike from '../../LikeDislike';
import { ItineraryData } from '@/src/types/itineraries';
import BaseCard from '../../shared/BaseCard';
import ActivityTag from '../../shared/ActivityTag';

interface FavoritesCardProps {
    data: ItineraryData;
}

const FavoritesCard: React.FC<FavoritesCardProps> = ({ data }) => {
    const router = useRouter();

    const locations = [
        data.start_location?.city,
        ...Object.values(data.days)
            .flat()
            .map(day => day.location?.name)
            .filter((loc, index, self) =>
                self.indexOf(loc) === index &&
                loc !== data.start_location?.city
            )
    ];

    const locationString = locations.length > 3
        ? `${locations.slice(0, 2).join(', ')}, ${locations.length - 2} More`
        : locations.join(', ');

    const handleCardClick = () => {
        router.push(`/itineraries/${data._id.$oid}`);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`?modal=shareModal&itineraryId=${data._id.$oid}`);
    };

    return (
        <BaseCard className="mt-4 !p-0 overflow-hidden lg:h-64" onClick={handleCardClick}>
            <div className='flex flex-col lg:flex-row lg:h-full relative'>
                {/* Mobile/Desktop image section */}
                <div className='relative lg:w-80 h-48 lg:h-full lg:order-2'>
                    <Image
                        src={data.images?.[0] || "/images/default-itinerary.jpeg"}
                        alt={data.trip_name}
                        fill
                        className='object-cover lg:rounded-r-2xl lg:rounded-tl-none rounded-t-2xl'
                    />
                    
                    {/* Action buttons overlay */}
                    <div className='absolute top-3 right-3 flex gap-2'>
                        <button
                            onClick={handleShareClick}
                            className='bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center transition-colors'
                        >
                            <Image src="/svg-icons/share.svg" alt="share" height={20} width={20} />
                        </button>
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeDislike liked={true} favoriteId={data._id.$oid} />
                        </div>
                    </div>

                    {/* Price overlay at bottom right */}
                    <div className='absolute bottom-3 right-3 text-right'>
                        <p className='text-xs text-gray-300 bg-black/60 backdrop-blur-sm px-2 py-1 rounded'>from</p>
                        <p className='text-2xl font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded mt-1'>${data.person_cost}</p>
                    </div>
                </div>

                {/* Content section */}
                <div className='flex-1 p-4 lg:p-6 lg:order-1'>
                    {/* Activity tags */}
                    <div className='flex flex-wrap gap-2 mb-3 lg:mb-4'>
                        {data.activities?.slice(0, 2).map((activity, index) => (
                            <ActivityTag key={index} icon={<IoLeafOutline className='size-4' />}>
                                {activity.label}
                            </ActivityTag>
                        ))}
                        {data.length_days === 1 && (
                            <ActivityTag>
                                Day Trip
                            </ActivityTag>
                        )}
                    </div>

                    {/* Trip name */}
                    <h3 className='text-lg lg:text-xl font-bold text-white mb-2'>
                        {data.trip_name}
                    </h3>

                    {/* Location */}
                    <p className='text-sm text-gray-400 mb-3'>{locationString}</p>
                    
                    {/* Trip details - stack on mobile, horizontal on desktop */}
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 text-white text-xs'>
                        <div className='flex items-center gap-1'>
                            <MdAccessTime className='size-3' />
                            <span>{data.length_days} day{data.length_days > 1 ? 's' : ''}{data.lodging && data.lodging.length > 0 ? ` ${data.lodging.length} night${data.lodging.length > 1 ? 's' : ''}` : ''}</span>
                        </div>
                        <div className='hidden sm:block text-gray-400'>|</div>
                        <div className='flex items-center gap-1'>
                            <LuUsers className='size-3' />
                            <span>{data.min_group}-{data.max_group} Guests</span>
                        </div>
                        <div className='hidden sm:block text-gray-400'>|</div>
                        <div className='flex items-center gap-1'>
                            <FaPersonWalking className='size-3' />
                            <span>{data.activities?.length || 0} Activities</span>
                        </div>
                    </div>
                </div>
            </div>
        </BaseCard>
    );
}

export default FavoritesCard;