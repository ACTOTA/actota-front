'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { FaCheck, FaPersonWalking } from 'react-icons/fa6';
import { GoHome } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { CgArrowTopRight } from "react-icons/cg";
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import moment from 'moment';
interface ListingCardProps {
    data: any;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    bookingConfirmedModal?: boolean;
}

const BookingCard: React.FC<ListingCardProps> = ({
    data,
    onAction,
    disabled = false,
    actionLabel,
    actionId = "",
    bookingConfirmedModal = false,
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
        <GlassPanel className='!p-4 !rounded-[22px]  hover:cursor-pointer flex flex-col gap-2 mt-4 bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>

            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>

                    <Button variant='primary' size='sm' className='!bg-[#215CBA] text-white flex items-center gap-1'> {data.status === "upcoming" ? <CiCalendar className='text-white size-5' /> : data.status === "ongoing" ? <Image src="/svg-icons/ongoing-icon.svg" alt="clock" width={16} height={16} /> : <FaCheck className='text-white size-5' />} {data?.status === "upcoming" ? "in 98 days" : data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}</Button>
                    {bookingConfirmedModal && <p className='text-sm text-primary-gray flex items-center gap-1'><Image src="/svg-icons/airplane.svg" alt="points" width={20} height={20} /> Booking no. <span className='text-white'>{data?.id}</span></p>}
                </div>
                <p className='text-sm text-primary-gray'>Booked  <span className='text-white'> {moment(data?.created_at).format("DD MMM YYYY")}</span> </p>
            </div>
            <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>

            <div className='flex justify-between relative gap-4 h-full w-full'>
                <div className='w-full'>
                    <div className='flex justify-between items-center text-white'>
                        <p className='text-2xl font-bold'>{data?.trip_name}</p>

                        {!bookingConfirmedModal && <p className='text-2xl font-bold'>${data.person_cost}</p>}
                    </div>
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

                {!bookingConfirmedModal && <Image src={data.images[0] || ""} alt="Vacation Picture" height={200} width={204} className='rounded-lg object-cover' />}

            </div>

            {data?.delay_insurance ?
                bookingConfirmedModal ?
                    <div className='mt-2'></div> :



                    <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>

                :


                <div className='flex justify-between items-center bg-black  border border-border-primary rounded-xl p-3 my-1'>
                    <div>
                        <p className='flex items-center gap-2 text-white'> <Image src="/svg-icons/insurance-shield2.svg" alt="points" width={20} height={20} /> Delay Insurance
                        </p>
                        <p className='text-xs text-primary-gray ml-7 flex gap-2 mt-2'> <span className='rounded-full  bg-[#1A1A1A]   px-2 py-1'> Up to 100% reimbursement   </span>  <span className='rounded-full  bg-[#1A1A1A]  px-2 py-1'>    Free Cancellation </span></p>
                    </div>
                    <div className='flex gap-6'>
                        <div className="flex flex-col gap-3">
                            <p className='text-white items-center gap-1 flex'> $59 <span className='text-xs text-primary-gray'>per person</span></p>
                            <p className="text-[#BBD4FB] text-sm flex items-center gap-1 border-b border-b-[#BBD4FB]">Learn more    <CgArrowTopRight className="text-white h-5 w-5" /></p>

                        </div>
                        <Button variant='primary' className=' !py-3'>Add <span className='text-2xl ml-4 '>+</span></Button>
                    </div>
                </div>}



            <div className='flex justify-between items-center'>
                <div>
                    <p className='flex items-center gap-2 text-white'> <Image src="/svg-icons/booking-points.svg" alt="points" width={20} height={20} />  +220 Points
                        ($22)</p>
                    <p className='text-sm text-primary-gray ml-7'>You’ll earn the points once you complete the trip.</p>
                </div>
                <div className='flex gap-2'>
                    {data?.status !== "completed" && <Button variant='primary' className='!bg-[#C10B2F] text-white'>Cancel Trip</Button>}
                    <Button onClick={() => router.push(`/booking-details`)} variant='outline' className=' text-white gap-2'> View {data?.status === "completed" && !bookingConfirmedModal ? "Details" : ""} <CgArrowTopRight className='size-6' /></Button>

                </div>
            </div>


        </GlassPanel>

    );
}

export default BookingCard;
