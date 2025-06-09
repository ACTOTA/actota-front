import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
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
    const [showTooltip, setShowTooltip] = useState(false);

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
                    {/* Left Side - Category and Match Score */}
                    <div className='flex items-start gap-2'>
                        {/* Category Tag */}
                        <div className='flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5'>
                            <IoLeafOutline className='w-4 h-4 text-white' />
                            <span className='text-xs font-medium text-white'>
                                {data?.category || 'Mindfulness'}
                            </span>
                        </div>

                        {/* Match Score Indicator */}
                        {data?.match_score && (
                            <div 
                                className='relative w-12 h-12 cursor-help transition-all hover:scale-110'
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
                                    <span className='text-xs font-bold leading-none'>
                                        {data.match_score}%
                                    </span>
                                    <span className='text-[9px] font-medium opacity-90 leading-none'>
                                        Match
                                    </span>
                                </div>
                                
                                {/* Tooltip */}
                                {showTooltip && data?.score_breakdown && (
                                    <div className='absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-sm 
                                                    rounded-lg border border-gray-700/50 p-4 shadow-xl z-50
                                                    transform -translate-x-full'
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
                        )}
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
                                ${data?.person_cost ? 
                                    (typeof data.person_cost === 'string' ? 
                                        parseFloat(data.person_cost).toLocaleString() : 
                                        data.person_cost.toLocaleString()
                                    ) : '0'}
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