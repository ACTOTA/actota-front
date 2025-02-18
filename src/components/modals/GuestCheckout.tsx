import Cookie from '@/public/svg-icons/cookie.svg'
import React from 'react'
import Button from '../figma/Button'
import Link from 'next/link'
import Input from '../figma/Input'
import { HiOutlineMail } from 'react-icons/hi'
import { useRouter } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go'
const GuestCheckout = () => {
    const router = useRouter();


    const confirmBooking = () => {
        router.push("?modal=guestCheckoutLoading")
        setTimeout(() => {
            router.push("?modal=bookingConfirmed")
        }, 3000)
    }
    return (
        <div className='w-full'>
            <p className='text-white text-xl font-bold'>Guest Checkout</p>
            <p className="m-auto mt-1 text-primary-gray text-[16px] leading-[20px]">Already have an account? <Link href="/auth/signin" className="text-white"><b><u>Sign in here</u></b></Link></p>


            <div className='mt-4'>
                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Email Address</p>
                <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
            </div>

            <div className='flex justify-between items-center my-4'>
                <p className='text-primary-gray'>Total amount</p>
                <p className='text-white '>$144.9</p>
            </div>
            <Button onClick={confirmBooking} variant="primary" className="bg-white text-black w-full my-[10px]">Pay $144.9  <GoArrowRight /></Button>
            <p className="m-auto text-center text-primary-gray text-[14px] leading-[20px]">By confirming your reservation, you agree to ACTOTA&apos;s  <br /><Link href="/auth/signin" className="text-white"><b><u>Terms of Service</u></b></Link> and <Link href="/auth/signin" className="text-white"><b><u>
                Privacy Policy.</u></b></Link></p>

        </div>
    )
}

export default GuestCheckout