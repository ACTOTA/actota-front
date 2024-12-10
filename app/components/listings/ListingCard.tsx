import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import HeartButton from '../HeartButton';
import Button from '../Button';
import { FeaturedVacation } from '@/db/models/itinerary';
import Image from 'next/image';
import GlassPanel from '../figma/GlassPanel';
import { Theme } from '../enums/theme';

interface ListingCardProps {
    data: FeaturedVacation;
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
        <div onClick={() => router.push(`/listings/${(data._id as { $oid: string }).$oid}`)}
            className='grid gap- 2 col-span-1 hover:cursor-pointer group w-[308px] h-[400px] bg-white rounded-lg text-white'>

            <div className='relative h-full'>
                <Image src={data.images[0] || ""} alt="Vacation Picture" layout='fill' objectFit='cover' className='rounded-lg' />

                <div className="flex flex-col w-full p-2">
                    <GlassPanel className='absolute bottom-0 left-0 h-1/3 rounded-lg m-2'
                        theme={Theme.Dark}>
                        <div className='p-4'>
                            <h3 className='font-bold'>{data.trip_name}</h3>
                            <h4 className='text-sm text-neutral-04'>{data.start_location.name}, {data.end_location.name}</h4>
                            <div className='flex gap-4 text-xs text-neutral-03'>
                                <p>{data.length_days} {data.length_days > 1 ? "Days" : "Day"}</p>
                                <p>{data.activities.length} {data.activities.length > 1 ? "Activities" : "Activity"}</p>
                            </div>


                        </div>
                    </GlassPanel>
                </div>
            </div>

            {onAction && actionLabel && (
                <Button
                    disabled={disabled}
                    small
                    label={actionLabel}
                    onClick={handleCancel}
                />
            )}
        </div>
    );
}

export default ListingCard;
