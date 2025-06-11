import React from 'react';

const ItineraryCardSkeleton = () => {
    return (
        <div className='relative bg-gray-900 rounded-2xl overflow-hidden animate-pulse'>
            {/* Image Container with fixed aspect ratio */}
            <div className='relative w-full aspect-[4/5] bg-gray-800'>
                {/* Top Controls */}
                <div className='absolute top-4 left-4 right-4 flex justify-between items-start'>
                    {/* Category Tag Skeleton */}
                    <div className='bg-gray-700 rounded-full h-8 w-28' />

                    {/* Action Buttons Skeleton */}
                    <div className='flex gap-2'>
                        <div className='w-9 h-9 bg-gray-700 rounded-full' />
                        <div className='w-9 h-9 bg-gray-700 rounded-full' />
                    </div>
                </div>

                {/* Content Overlay Skeleton */}
                <div className='absolute bottom-0 left-0 right-0 p-4'>
                    <div className='bg-gray-800/80 rounded-xl p-4'>
                        {/* Title and Location Skeleton */}
                        <div className='h-6 bg-gray-700 rounded w-3/4 mb-2' />
                        <div className='h-4 bg-gray-700 rounded w-1/2 mb-3' />

                        {/* Stats Row Skeleton */}
                        <div className='flex items-center gap-4 mb-3'>
                            <div className='h-4 bg-gray-700 rounded w-16' />
                            <div className='h-4 bg-gray-700 rounded w-16' />
                            <div className='h-4 bg-gray-700 rounded w-20' />
                        </div>

                        {/* Price Skeleton */}
                        <div className='h-8 bg-gray-700 rounded w-32' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryCardSkeleton;