'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { FaPersonWalking } from 'react-icons/fa6';
import { GoClock } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { IoLeafOutline } from "react-icons/io5";
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import { AiOutlineInfoCircle } from 'react-icons/ai';
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
    const [showTooltip, setShowTooltip] = useState(false);

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
            <div className='flex max-sm:flex-col gap-6 max-sm:gap-4 p-6 max-sm:p-4'>
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
                <div className='relative w-64 h-48 sm:w-64 sm:h-48 max-sm:w-full max-sm:h-40 rounded-xl overflow-hidden flex-shrink-0'>
                    <Image 
                        src={data.images[0] || '/images/default-itinerary.jpeg'} 
                        alt={data?.trip_name}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    
                    {/* Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
                    
                    {/* Match Score Indicator */}
                    {data?.match_score && (
                        <div className='absolute top-2 left-2 sm:top-3 sm:left-3 z-20'>
                            <div 
                                className='relative w-16 h-16 sm:w-20 sm:h-20 cursor-help transition-all hover:scale-110'
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTooltip(!showTooltip);
                                }}
                            >
                                {/* Circular Progress Ring */}
                                <svg 
                                    className='w-full h-full transform -rotate-90' 
                                    viewBox='0 0 42 42'
                                >
                                    {/* Background Circle */}
                                    <circle
                                        cx='21'
                                        cy='21'
                                        r='15.915'
                                        fill='transparent'
                                        stroke='rgba(0, 0, 0, 0.3)'
                                        strokeWidth='3'
                                    />
                                    {/* Progress Circle */}
                                    <circle
                                        cx='21'
                                        cy='21'
                                        r='15.915'
                                        fill='transparent'
                                        stroke={(() => {
                                            const score = data.match_score;
                                            if (score >= 80) return '#10b981'; // green-500
                                            if (score >= 60) return '#eab308'; // yellow-500
                                            if (score >= 40) return '#f97316'; // orange-500
                                            return '#ef4444'; // red-500
                                        })()}
                                        strokeWidth='3'
                                        strokeDasharray={`${data.match_score} ${100 - data.match_score}`}
                                        strokeLinecap='round'
                                        className='transition-all duration-300'
                                    />
                                </svg>
                                
                                {/* Center Content */}
                                <div className='absolute inset-0 flex flex-col items-center justify-center text-white'>
                                    <span className='text-xs sm:text-sm font-bold leading-none'>
                                        {data.match_score}%
                                    </span>
                                    <span className='text-[10px] sm:text-xs font-medium opacity-90 leading-none'>
                                        Match
                                    </span>
                                </div>
                                
                                {/* Tooltip */}
                                {showTooltip && data?.score_breakdown && (
                                    <div className='absolute top-full left-0 sm:left-0 max-sm:right-0 max-sm:left-auto 
                                                    mt-2 w-64 max-sm:w-72 bg-gray-900/95 backdrop-blur-sm 
                                                    rounded-lg border border-gray-700/50 p-4 shadow-xl z-50
                                                    max-sm:transform max-sm:-translate-x-full'
                                         onClick={(e) => e.stopPropagation()}>
                                        <h4 className='text-sm font-semibold text-white mb-3 border-b border-gray-700 pb-2'>
                                            Match Score Breakdown
                                        </h4>
                                        <div className='space-y-2'>
                                            {Object.entries(data.score_breakdown).map(([key, score]) => {
                                                const label = key.replace('_score', '').replace('_', ' ');
                                                const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
                                                const scoreValue = typeof score === 'number' ? score : 0;
                                                
                                                return (
                                                    <div key={key} className='flex justify-between items-center'>
                                                        <span className='text-xs text-gray-300'>{formattedLabel}:</span>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden'>
                                                                <div 
                                                                    className='h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full'
                                                                    style={{ width: `${Math.min(scoreValue * 5, 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className='text-xs font-medium text-yellow-400 min-w-[2rem] text-right'>
                                                                {scoreValue}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className='mt-3 pt-2 border-t border-gray-700'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-xs font-semibold text-white'>Total Match:</span>
                                                <span className='text-sm font-bold text-yellow-400'>{data.match_score}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
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
