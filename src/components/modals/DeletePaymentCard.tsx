import Trash from '@/public/svg-icons/trash.svg'
import React, { useState } from 'react'
import Button from '../figma/Button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Define the window interface with our custom property
interface CustomWindow extends Window {
    confirmDeletePaymentCard?: () => void;
}

const DeletePaymentCard = () => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCancel = () => {
        router.back();
    };

    const handleDelete = () => {
        setIsDeleting(true);
        // Call the global function that was set by the Payment component
        const confirmDeleteFn = (window as CustomWindow).confirmDeletePaymentCard;
        if (confirmDeleteFn) {
            confirmDeleteFn();
        } else {
            console.error('Delete function not found');
            setIsDeleting(false);
        }
    };

    return (
        <div className='w-full'>
            <Image src="/images/delete-payment-card-blur.png" className="absolute z-[-1] top-[-1px] left-[-1px] w-full h-full rounded-2xl" width={100} height={100} alt="delete-payment-card-blur" />
            <Trash />
            <p className='text-white text-xl font-bold mt-3'>Delete this card?</p>
            <p className='text-white text-sm py-2 pr-20'>Are you sure you want to remove the card <br />
                information from your account?</p>
            <div className='flex gap-2 mt-4'>
                <Button
                    className='flex-1 !bg-black text-white'
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    className='flex-1 !bg-[#C10B2F] text-white'
                    variant="primary"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
            </div>
        </div>
    )
}

export default DeletePaymentCard
