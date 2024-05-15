'use client';

import { useRouter } from 'next/navigation';
import { Listing as PrismaListing, Reservation } from '@prisma/client';


import { SafeListing, SafeUser } from '@/app/types'; // Make sure this path is correct
import useTowns from '@/app/hooks/useTowns';
import React, { useCallback, useMemo } from 'react';
// import { format } from 'date-fns';

import Image from 'next/image';
import StarButton from '../StarButton';
import Button from '../Button';

type Location = {
    value: string;
    label: string;
    flag: string;
    latlng: [number, number];
    region: string;
};
interface Listing {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    createdAt: Date;
    activity: string;
    roomCount: number;
    bathroomCount: number;
    guestCount: number;
    location: Location;
    userId: string;
    price: number;
}

function parseLocation(locationJson: any): Location | null {
    try {
        if (typeof locationJson === 'string') {
            return JSON.parse(locationJson);
        }
        return locationJson as Location;
    } catch (error) {
        console.error('Failed to parse location JSON', error);
        return null;
    }
}
interface ListingCardProps {
    data: SafeListing;
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled = false,
    actionLabel,
    actionId = "",
    currentUser
}) => {
    const router = useRouter();
    const { getByValue } = useTowns();


    const location = parseLocation(data.location);

    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    
        if (disabled) {
          return;
        }
    
        onAction?.(actionId)
      }, [disabled, onAction, actionId]);

    const price = useMemo(() => reservation?.totalPrice || data.price, [reservation, data.price]);

    return (
        <div onClick={() => router.push(`/listings/${data.id}`)}
            className='col-span-1 cusrsor-pointer group'
        >
            <div className='flex flex-col w-full gap-2'>
                <div className='relative w-full overflow-hidden aspect-square rounded-xl'>
                    <Image
                        fill
                        alt="Listing"
                        src={data.imageSrc}
                        className='object-cover w-full h-full transition-transform duration-200 ease-in-out group-hover:scale-110'
                    />
                    <div className='absolute top-3 right-3'>
                        <StarButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="text-lg font-semibold">
                    {location?.label}, {location?.region}
                </div>
                <div className="font-light text-neutral-500">
          {data.activity}
        </div>
                <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          {!reservation && (
            <div className="font-light">night</div>
          )}
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
        </div>
    );
}

export default ListingCard;
