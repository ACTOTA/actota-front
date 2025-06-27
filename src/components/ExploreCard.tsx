'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import LikeDislike from './LikeDislike';

interface ExploreCardProps {
    data: any;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
    data,
    size = 'medium',
    className = ''
}) => {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);

    const sizeClasses = {
        small: 'h-64 max-md:h-56 max-sm:h-48',
        medium: 'h-80 max-md:h-72 max-sm:h-64',
        large: 'h-96 max-md:h-80 max-sm:h-72'
    };

    const cardClasses = {
        small: 'p-4 max-md:p-3 max-sm:p-3',
        medium: 'p-5 max-md:p-4 max-sm:p-3',
        large: 'p-6 max-md:p-5 max-sm:p-4'
    };

    const location = data?.start_location?.city || 'Unknown Location';
    const state = data?.start_location?.state || '';
    const duration = data?.length_days || 0;
    const price = data?.person_cost || 0;
    const rating = data?.rating || 4.5;
    const maxGuests = data?.max_group || data?.max_guests || 8;

    const handleClick = () => {
        if (data._id?.$oid) {
            router.push(`/itineraries/${data._id.$oid}`);
        }
    };

    return (
        <div 
            className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 ${sizeClasses[size]} ${className}`}
            onClick={handleClick}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl"> {/* Added overflow-hidden and rounded-2xl */}
                {(data.images?.[0] || data.image_url) ? (
                    <Image
                        src={data.images?.[0] || data.image_url || '/images/default-itinerary.jpeg'}
                        alt={data.title || data.trip_name || location}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 rounded-2xl"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(false)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    /* Fallback gradient background when no image */
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl" /> {/* Added rounded-2xl */}
            </div>

            {/* Content */}
            <div className={`relative z-10 h-full flex flex-col justify-between ${cardClasses[size]}`}>
                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 max-sm:px-2 max-sm:py-1 border border-gray-600/30">
                            <p className="text-yellow-400 text-sm max-sm:text-xs font-semibold">
                                ${price.toLocaleString()}
                            </p>
                        </div>
                        {/* Social proof badge - only show on some cards */}
                        {Math.random() > 0.7 && (
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg px-2 py-1 border border-green-500/30">
                                <p className="text-green-300 text-xs max-sm:text-[10px] font-medium">
                                    🔥 {Math.floor(Math.random() * 8) + 3} bookings today
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 max-sm:p-1.5 border border-gray-600/30">
                        <LikeDislike 
                            liked={data.isFavorite || false}
                            favoriteId={data._id?.$oid || data.id || ''} 
                            className="text-white hover:text-red-400"
                        />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-3">
                    {/* Title and Location */}
                    <div>
                        <h3 className="text-white text-lg max-md:text-base max-sm:text-sm font-bold mb-1 line-clamp-2 leading-tight">
                            {data.title || data.trip_name || `${duration}-Day ${location} Adventure`}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-300">
                            <MapPinIcon className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            <p className="text-sm max-sm:text-xs truncate">
                                {location}{state && `, ${state}`}
                            </p>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div className="flex items-center justify-between text-sm max-sm:text-xs">
                        <div className="flex items-center gap-4 max-sm:gap-3">
                            <div className="flex items-center gap-1 text-gray-300">
                                <ClockIcon className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                <span>{duration} days</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-300">
                                <UsersIcon className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                <span className="max-sm:hidden">Up to</span> {maxGuests}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 max-sm:w-3 max-sm:h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-white text-sm max-sm:text-xs font-medium">{rating}</span>
                        </div>
                    </div>

                    {/* Activities Preview */}
                    {data.activities && data.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {data.activities.slice(0, size === 'large' ? 3 : 2).map((activity: any, i: number) => (
                                <span 
                                    key={i}
                                    className="bg-white/10 backdrop-blur-sm text-white text-xs max-sm:text-[10px] px-2 py-1 max-sm:px-1.5 max-sm:py-0.5 rounded-full border border-white/20"
                                >
                                    {activity.label || activity.name || activity}
                                </span>
                            ))}
                            {data.activities.length > (size === 'large' ? 3 : 2) && (
                                <span className="text-gray-400 text-xs max-sm:text-[10px] px-2 py-1 max-sm:px-1.5 max-sm:py-0.5">
                                    +{data.activities.length - (size === 'large' ? 3 : 2)} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            
        </div>
    );
};

export default ExploreCard;