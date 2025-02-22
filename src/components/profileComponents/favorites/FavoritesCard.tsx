'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { FaPersonWalking } from 'react-icons/fa6';
import { LuUsers } from "react-icons/lu";
import { IoLeafOutline } from "react-icons/io5";
import { MdAccessTime } from 'react-icons/md';
import LikeDislike from '../../LikeDislike';
interface ListingCardProps {
    data: any;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
}

const FavoritesCard: React.FC<ListingCardProps> = ({
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
        <GlassPanel className='!p-4 max-sm:!p-0 max-sm:border-none !rounded-[22px] max-w-[864px] hover:cursor-pointer flex justify-between items-end mt-4 bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>


            <div onClick={() => router.push(`/itineraries/1`)} className='flex justify-between max-lg:flex-col-reverse relative gap-4 h-full w-full'>
                <div>
                    <div className='flex justify-start items-center flex-wrap gap-1 max-w-[70%] text-white max-md:absolute max-md:top-2 max-md:left-2' >

                        <div className=' bg-gradient-to-r from-[#0252D0] to-[#012A6A]  rounded-full px-3 py-1  flex items-center justify-center gap-1'> <Image src="/svg-icons/popular-icon.svg" alt="Popular" height={20} width={20} className='h-5 w-5 text-white' />Popular</div>
                        <div className=' bg-[#05080D]  rounded-full px-3 py-1  flex items-center justify-center gap-1'> <IoLeafOutline className='h-5 w-5 text-white' />Mindfulness</div>
                    </div>
                    <div className='max-md:flex w-full justify-between'>
<div>

                    <p className='text-2xl font-bold mt-3 max-md:mt-0 flex items-center gap-2'>{data?.trip_name} {data?.day_itinerary ? <Button variant='primary' size='sm' className='!bg-[#215CBA] text-white text-xs font-normal'>Day  1/3</Button> : ""}</p>

                    <p className='py-2 text-sm text-primary-gray'>Denver, Idaho Springs, Glenwood Springs, 2 More.</p>
                    <div className='flex justify-start items-center gap-3  mb-2 text-white' >

                        <div className='flex gap-1 text-xs'>
                            <MdAccessTime className='h-[17px] w-[17px] text-white' />
                            <p>{data?.length_days} {data?.length_days > 1 ? "Days" : "Day"}</p>
                        </div>
                        <div className='flex gap-1 text-xs '>
                            <LuUsers className='h-[17px] w-[17px] text-white' />
                            <p> {data?.min_guests > 1 ? data?.min_guests + "-" + data.max_guests : 0}</p>
                        </div>
                        <div className='flex gap-1 text-xs  my-2'>
                            <FaPersonWalking className='h-[17px] w-[17px] text-white' />
                            <p> {data?.activities?.length > 1 ? data?.activities?.length + " Activities" : data?.activities?.length + " Activity"}</p>
                        </div>
                    </div>

</div>
                    <div>
                        <p className='text-xs text-primary-gray '>from</p>
                        <p className='text-xl font-bold'>${data.person_cost}</p>
                    </div>
                    </div>

                </div>

                <Image src={data.images[0] || ""} alt="Vacation Picture" height={200} width={300} objectFit='cover' className='rounded-lg max-lg:w-full' />
                <div className='flex gap-2 absolute top-2 right-2'>
                    <div onClick={(e) => {
                        e.stopPropagation();
                        router.push("?modal=shareModal");
                     }} className=' bg-[#05080D]  rounded-full h-10 w-10 flex items-center justify-center'><Image src="/svg-icons/share.svg" alt="edit" height={20} width={20} /></div>
                    <LikeDislike liked={true} />
                </div>
            </div>


        </GlassPanel>

    );
}

export default FavoritesCard;
