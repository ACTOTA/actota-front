'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { FaPersonWalking } from 'react-icons/fa6';
import { GoHome } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { CgArrowRight } from "react-icons/cg";
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import moment from 'moment';
interface ListingCardProps {
    data: any;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
}

const MyItineraryCard: React.FC<ListingCardProps> = ({
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
        <GlassPanel className='!p-4 !rounded-[22px] max-w-[864px] hover:cursor-pointer flex flex-col gap-2 mt-4 bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>

            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-2xl font-bold'>{data?.trip_name}</p>

                </div>
                <div className='flex gap-2'>
                   <Button variant='primary' size='sm' className='!bg-[#C10B2F] text-white'>Delete</Button>
                    <Button variant='outline' size='sm' className=' text-white gap-2'> View <CgArrowRight className='size-6' /></Button>
                </div>
            </div>
            <div className="h-[1px] max-lg:hidden my-2 w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>

            <div onClick={() => router.push(`/itineraries/1`)} className='flex justify-between max-lg:flex-col-reverse relative gap-4 h-full w-full'>
                <div className='w-full'>

                    <div className='flex  items-center gap-3 my-3 text-white' >

                        <div className='flex flex-1 flex-col gap-1'>
                            <p className='flex items-center gap-1 text-xs text-primary-gray'><CiCalendar className='h-[17px] w-[17px] text-white' /> Dates</p>
                            <p className='text-white text-sm ml-5'>9 Total</p>
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p className='flex items-center gap-1 text-xs text-primary-gray'><LuUsers className='h-[17px] w-[17px] text-white' /> Guests</p>
                            <p className='text-white text-sm ml-5'>{data?.min_guests} - {data?.max_guests}</p>
                        </div>
                        <div className='flex-1' />

                    </div>
                    <div className='flex  items-center gap-3 mt-2 text-white' >

                        <div className='flex flex-1 flex-col gap-1'>
                            <p className='flex items-center gap-1 text-xs text-primary-gray'><FaPersonWalking className='h-[17px] w-[17px] text-white' /> Activities</p>
                            <p className='text-white text-sm ml-5'>9 Total</p>
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                            <p className='flex items-center gap-1 text-xs text-primary-gray'><GoHome className='h-[17px] w-[17px] text-white' /> Lodging</p>
                            <p className='text-white text-sm ml-5'>4 nights</p>
                        </div>
                        <div className='flex  flex-1 flex-col gap-1'>
                            <p className='flex items-center gap-1 text-xs text-primary-gray'><MdOutlineDirectionsCarFilled className='h-[17px] w-[17px] text-white' /> Transportation</p>
                            <p className='text-white text-sm ml-5'>3/6 days</p>
                        </div>

                    </div>

                </div>

                <Image src={data.images[0] || ""} alt="Vacation Picture" height={136} width={204} className='rounded-lg object-cover max-lg:w-full' />

            </div>








        </GlassPanel>

    );
}

export default MyItineraryCard;
