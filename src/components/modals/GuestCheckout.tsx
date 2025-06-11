import Cookie from '@/public/svg-icons/cookie.svg'
import React, { useState } from 'react'
import Button from '../figma/Button'
import Link from 'next/link'
import Input from '../figma/Input'
import { HiOutlineMail } from 'react-icons/hi'
import { useRouter } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go'
import DateMenuCalendar from '@/src/components/figma/DateMenuCalendar'
import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const GuestCheckout = () => {
    const router = useRouter();
    const [arrivalDate, setArrivalDate] = useState<string | null>(null);
    const [departureDate, setDepartureDate] = useState<string | null>(null);
    const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
    const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
    const [email, setEmail] = useState('');

    // Handle date range selection for arrival
    const handleArrivalDateRangeChange = (startDate: string | null, endDate: string | null) => {
        if (startDate) {
            setArrivalDate(startDate);
            setShowArrivalCalendar(false);
        }
    }
    
    // Handle date range selection for departure
    const handleDepartureDateRangeChange = (startDate: string | null, endDate: string | null) => {
        if (startDate) {
            setDepartureDate(startDate);
            setShowDepartureCalendar(false);
        }
    }

    const confirmBooking = () => {
        // Validate fields
        if (!arrivalDate || !departureDate) {
            alert('Please select both arrival and departure dates');
            return;
        }
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Continue with booking
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
                <p className="text-primary-gray text-left mb-1 mt-[10px]">Email Address</p>
                <Input 
                    type="email" 
                    name="email" 
                    icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} 
                    placeholder="Your email address"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
            </div>
            
            <div className='mt-4'>
                <p className="text-primary-gray text-left mb-1">Trip Dates</p>
                
                <div className='relative mb-2'>
                    <div 
                        onClick={() => {
                            setShowArrivalCalendar(!showArrivalCalendar);
                            setShowDepartureCalendar(false);
                        }}
                        className="w-full cursor-pointer border border-border-primary bg-black text-white rounded-lg p-3 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Image src="/svg-icons/calendar.svg" alt="calendar" width={24} height={24} />
                            <span>{arrivalDate || 'Select arrival date'}</span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-white" />
                    </div>
                    {showArrivalCalendar && (
                        <div className="absolute z-20 mt-2 bg-black border border-border-primary rounded-lg p-4 w-full">
                            <DateMenuCalendar onDateRangeChange={handleArrivalDateRangeChange} />
                        </div>
                    )}
                </div>
                
                <div className='relative'>
                    <div 
                        onClick={() => {
                            setShowDepartureCalendar(!showDepartureCalendar);
                            setShowArrivalCalendar(false);
                        }}
                        className="w-full cursor-pointer border border-border-primary bg-black text-white rounded-lg p-3 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Image src="/svg-icons/calendar.svg" alt="calendar" width={24} height={24} />
                            <span>{departureDate || 'Select departure date'}</span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-white" />
                    </div>
                    {showDepartureCalendar && (
                        <div className="absolute z-20 mt-2 bg-black border border-border-primary rounded-lg p-4 w-full">
                            <DateMenuCalendar onDateRangeChange={handleDepartureDateRangeChange} />
                        </div>
                    )}
                </div>
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