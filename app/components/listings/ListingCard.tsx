'use client';

import { useRouter } from 'next/navigation';
import { Listing as PrismaListing } from '@prisma/client';


import { SafeUser } from '@/app/types'; // Make sure this path is correct
import useTowns from '@/app/hooks/useTowns';
import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { SafeReservation } from '@/app/types';


// Define a TypeScript type for the Location to enforce structure in your application code
type Location = {
    value: string;
    label: string;
    flag: string;
    latlng: [number, number];  // Assuming latlng is always an array of two numbers
    region: string;
};

// Adjust the Listing type to include this Location type for the location field
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
  location: Location;  // Use Location type instead of Json for type safety
  userId: string;
  price: number;
}

// Example function to safely parse location data
function parseLocation(locationJson: any): Location | null {
    try {
      if (typeof locationJson === 'string') {
        return JSON.parse(locationJson);
      }
      return locationJson as Location;  // Assume it's already parsed as JSON (common with MongoDB)
    } catch (error) {
      console.error('Failed to parse location JSON', error);
      return null;
    }
  }
  

  interface ListingCardProps {
    data: Listing;
    reservation?: SafeReservation;
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

    // Parse location using the imported function
    const location = parseLocation(data.location);

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!disabled) {
            onAction?.(actionId);
        }
    }, [onAction, actionId, disabled]);

    const price = useMemo(() => reservation?.totalPrice || data.price, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) return null;
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);
        return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    }, [reservation]);

    return (
        <div 
            onClick={() => router.push(`/listing/${data.id}`)}
            className='flex flex-col p-4 border border-gray-200 rounded-md cursor-pointer hover:shadow-md transition duration-300 ease-in-out'
        
        >
            
            <h3>{data.title}</h3>
            <p>Location: {location ? `${location.label} (${location.value})` : 'Location unavailable'}</p>
            <p>Price: ${price}</p>
            {reservationDate && <p>Reserved: {reservationDate}</p>}
            {actionLabel && (
                <button onClick={handleCancel} disabled={disabled}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default ListingCard;