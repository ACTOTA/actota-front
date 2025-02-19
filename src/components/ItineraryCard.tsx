'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import { FeaturedVacation } from '@/db/models/itinerary';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { FaPersonWalking } from 'react-icons/fa6';
import { GoHome } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { CgSoftwareUpload } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { IoLeafOutline } from "react-icons/io5";
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import LikeDislike from './LikeDislike';
interface ListingCardProps {
    data: FeaturedVacation;
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



    return (
        <GlassPanel  className='!p-4 !rounded-[22px] max-w-[864px] hover:cursor-pointer flex justify-between items-end mt-4 bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>


            <div onClick={() => router.push(`/listings/1`)} className='flex justify-between relative gap-4 h-full w-full'>
                <div className=' w-full'>
                    <div className='flex justify-between items-center text-white'>
                        <p className='text-2xl font-bold'>{data?.trip_name}</p>
                        <div>

                            <p className='text-xs text-primary-gray text-right'>from</p>
                            <p className='text-2xl font-bold'>${data.person_cost}</p>
                        </div>
                    </div>
                    <p className='py-6 text-sm text-primary-gray'>Denver, Idaho Springs, Glenwood Springs, 2 More.</p>
                    <div className='flex justify-start items-center gap-3 mt-2 mb-3 text-white' >

                        <div className='flex gap-1 text-xs'>
                            <FaPersonWalking className='h-[17px] w-[17px] text-white' />
                            <p>{data?.length_days} {data?.length_days > 1 ? "Days" : "Day"}</p>
                        </div>
                        <div className='flex gap-1 text-xs '>
                            <GoHome className='h-[17px] w-[17px] text-white' />
                            <p> {data?.min_guests > 1 ? data?.min_guests + "-" + data.max_guests : 0}</p>
                        </div>
                        <div className='flex gap-1 text-xs  my-2'>
                            <MdOutlineDirectionsCarFilled className='h-[17px] w-[17px] text-white' />
                            <p> {data?.activities?.length ? data?.activities?.length > 1 ? data?.activities?.length + " Activities" : data?.activities?.length + " Activity" : "0 Activities"}</p>
                        </div>
                    </div>
                    <div className='flex justify-start items-center gap-3 text-white' >

                        <div className=' bg-[#05080D]  rounded-full px-3 py-1  flex items-center justify-center gap-1'> <IoLeafOutline className='h-5 w-5 text-white' />Mindfulness</div>
                        <div className=' bg-[#05080D]  rounded-full px-3 py-1  flex items-center justify-center gap-1'> <CiCalendar className='h-5 w-5 text-white' />Mindfulness</div>
                        <div className=' bg-[#05080D]  rounded-full px-3 py-1  flex items-center justify-center gap-1'> <LuUsers className='h-5 w-5 text-white' />Mindfulness</div>
                    </div>
                </div>

                    <Image src={data.images[0] || ""} alt="Vacation Picture" height={200} width={300}  className='rounded-lg' />
                    <div className='flex gap-2 absolute top-2 right-2'>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();  // Stop the event from bubbling up
                                router.push("?modal=shareModal");
                            }} 
                            className='bg-[#05080D] rounded-full h-10 w-10 flex items-center justify-center'
                        > 
                           <Image src="/svg-icons/share.svg" alt="share" height={20} width={20} />
                        </button>
                       <LikeDislike />
                    </div>
            </div>


        </GlassPanel>

    );
}

export default ItineraryCard;
