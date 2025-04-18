import Trash from '@/public/svg-icons/trash.svg'
import React from 'react'
import Button from '../figma/Button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDeletePaymentMethod } from '@/src/hooks/mutations/payment.mutation'

interface DeletePaymentCardProps {
    paymentMethodId: string;
}

function DeletePaymentCard({ paymentMethodId }: DeletePaymentCardProps) {
    const router = useRouter();
    const { mutate: deletePaymentMethod, isLoading } = useDeletePaymentMethod();

    const handleDelete = () => {
        if (!paymentMethodId) {
            console.error('No payment method ID provided');
            return;
        }
        
        deletePaymentMethod(paymentMethodId, {
            onSuccess: () => {
                // Close the modal while preserving other query params
                const url = new URL(window.location.href);
                url.searchParams.delete('modal');
                url.searchParams.delete('paymentMethodId');
                router.push(url.pathname + url.search);
            }
        });
    };

    const handleCancel = () => {
        // Close the modal while preserving other query params
        const url = new URL(window.location.href);
        url.searchParams.delete('modal');
        url.searchParams.delete('paymentMethodId');
        router.push(url.pathname + url.search);
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
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button 
                    className='flex-1 !bg-[#C10B2F] text-white' 
                    variant="primary" 
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    {isLoading ? 'Deleting...' : 'Yes, Delete'}
                </Button>
            </div>
        </div>
    )
}

export default DeletePaymentCard
