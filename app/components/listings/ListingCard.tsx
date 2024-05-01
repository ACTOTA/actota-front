'use client';

import { useRouter } from 'next/router';
import {Listing, Reservation} from '@prisma/client';

import { SafeUser } from '@/app/types';
import useTowns from '@/app/hooks/useTowns';

interface ListingCardProps {
    data: Listing;
    reservation?:Reservation;
    onAction?: (action: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}


const ListingCard: React.FC<ListingCardProps> = ({ data, reservation, onAction, disabled, actionLabel, actionId, currentUser 
}) => {
    const router = useRouter();
    const {getByValue} = useTowns();

    return (
        <div></div>
    );
}
export default ListingCard;