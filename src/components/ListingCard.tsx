import { useRouter } from 'next/navigation';

import React, { useCallback } from 'react';
import Button from '@/src/components/figma/Button';
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
        <div onClick={() => router.push(`/itineraries`)}
            className='hover:cursor-pointer group min-w-[308px] h-[400px] bg-white rounded-2xl text-white
             border border-border-primary max-sm:border-none flex-col justify-between items-end inline-flex overflow-hidden'>

            <div className='relative h-full w-full'>
                <Image src={data.images[0] || ""} alt="Vacation Picture" layout='fill' objectFit='cover' className='rounded-lg' />

                < div className="flex flex-col w-full p-2 bg-red-500">
                    <div className='flex justify-between items-start absolute top-0 right-0 w-full m-2'>
                        <div className=' bg-[#05080D]  rounded-full px-3 py-1  ml-4 flex items-center justify-center gap-1'> <IoLeafOutline className='h-5 w-5 text-white' />Mindfulness</div>

                        <div className='flex gap-2'>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();  // Stop the event from bubbling up
                                    router.push(`?modal=shareModal&itineraryId=${data._id.$oid}`)
                                }}
                                className='bg-[#05080D] rounded-full h-10 w-10 flex items-center justify-center'
                            >
                                <Image src="/svg-icons/share.svg" alt="share" height={20} width={20} />
                            </button>
                            <LikeDislike liked={data.isFavorite ? data.isFavorite : false} favoriteId={data._id.$oid} />

                        </div>
                    </div>
                    <div className=' bottom-0 left-0 w-[292px] absolute border border-border-primary bg-black/50 backdrop-blur-[4px]  rounded-lg m-2 max-sm:m-0 max-sm:rounded-none max-sm:bg-black max-sm:border-none max-sm:w-full'>
                        <div className='px-3 py-2 flex flex-col w-full max-sm:flex-row max-sm:justify-between max-sm:px-0'>
                            <div>

                                <p className='font-bold'>{data?.trip_name}</p>
                                <p className='text-sm text-primary-gray'>{data?.start_location.city}</p>
                                <div className='flex justify-start items-center gap-3' >

                                    <div className='flex gap-1 text-xs'>
                                        <GoClock className='h-[13px] w-[13px] text-white' />
                                        <p>{data?.length_days} {data?.length_days > 1 ? "Days" : "Day"}</p>
                                    </div>
                                    <div className='flex gap-1 text-xs '>
                                        <LuUsers className='h-[13px] w-[13px] text-white' />
                                        <p> {data?.min_guests > 1 ? data?.min_guests + "-" + data.max_guests : 0}</p>
                                    </div>
                                    <div className='flex gap-1 text-xs  my-2'>
                                        <FaPersonWalking className='h-3 w-2 text-white' />
                                        <p> {data?.activities?.length ? data?.activities?.length > 1 ? data?.activities?.length + " Activities" : data?.activities?.length + " Activity" : "0 Activities"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='max-sm:flex  max-sm:gap-2'>

                                <p className='text-[12px] text-primary-gray max-sm:mt-0.5'>From</p>

                                <h3> ${data?.person_cost}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
}

export default ListingCard;
