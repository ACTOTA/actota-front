import React, { useEffect } from 'react'
import Button from '../figma/Button'
import { FaCheck } from 'react-icons/fa6'
import Image from 'next/image'
import BookingCard from '../profileComponents/bookings/BookingCard'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation';
import { getLocalStorageItem } from '@/src/utils/browserStorage'
import { getClientSession } from '@/src/lib/session'
const BookingConfirmed = () => {
    const router = useRouter();

    const user = getClientSession().user;

    let itineraryData = getLocalStorageItem('itineraryData');
    if (itineraryData) {
        itineraryData = JSON.parse(itineraryData);
    }
    
    const [itinerary, setItinerary] = React.useState<any>(itineraryData ?? {
        id: 1,
        status: "upcoming",
        delay_insurance: true,
        trip_name: "Lahore",
        fareharbor_id: 1,
        person_cost: 100,
        min_age: 18,
        min_guests: 1,
        max_guests: 10,
        length_days: 1,
        length_hours: 1,
        start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
        description: "Lahore is a city in Pakistan",
        days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
        activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
        images: ["/images/hero-bg.jpg"],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
    }
    );

    return (
        <div className='flex flex-col items-center justify-center overflow-y-auto !h-full '>
            <div className='w-full md:hidden'>

                <p onClick={() => router.push("/payment")} className=' text-left text-white text-sm flex items-center gap-2 cursor-pointer'><ArrowLeftIcon className='size-4' />Reservation Details </p>
            </div>


            <div className='flex justify-center items-center bg-gradient-to-br from-[#0252D0]  to-[#012A6A] rounded-full h-[64px] w-[64px]'>
                <FaCheck className='text-white size-6' />
            </div>
            <p className='text-white text-2xl font-bold mt-4'>Your booking is confirmed!</p>
            <p className='text-white  text-center py-2 '>We’ve sent a confirmation email to <b>{user?.email || "your email!"}</b></p>
            <div className='flex flex-col lg:flex-row w-full gap-4 mt-2'>

                <div className='w-full lg:w-[707px]'>
                    <p className='text-white font-bold mb-2'>Booking Details</p>

                    <BookingCard dataBooking={itinerary} dataItinerary={itinerary} bookingConfirmedModal={true} />

                </div>


                <div className='w-full lg:w-[271px] '>
                    <p className='text-white font-bold mb-4'>Payment Details</p>
                    <div className=' bg-[#141414] rounded-2xl border border-primary-gray'>
                        <div className=' rounded-lg p-4 flex flex-col  gap-1 '>



                            <div className='flex justify-between ' >
                                <p className='text-sm text-primary-gray'>Activity Cost</p>
                                <p className='text-sm text-white'> $1000</p>
                            </div>
                            <div className='flex justify-between mt-2' >
                                <p className='text-sm text-primary-gray'>Lodging Cost</p>
                                <p className='text-sm text-white'> $1000</p>
                            </div>
                            <div className='flex justify-between mt-2' >
                                <p className='text-sm text-primary-gray'>Transport Cost</p>
                                <p className='text-sm text-white'> $1000</p>
                            </div>
                            <div className='flex justify-between mt-2' >
                                <p className='text-sm text-primary-gray'>Travel agent fee</p>
                                <p className='text-sm text-white'> $1000</p>
                            </div>
                            <div className='flex justify-between mt-2' >
                                <p className='text-sm text-primary-gray'>Service fee</p>
                                <p className='text-sm text-white'> $1000</p>
                            </div>
                            <div className='flex justify-between mt-2' >
                                <p className='text-sm text-primary-gray'>Promo Code</p>
                                <p className='text-sm text-[#5389DF]'> -$45</p>
                            </div>



                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent my-2"></div>
                            <div className='flex justify-between  mb-2'>
                                <p className='text-white font-bold'> Total amount</p><p className='text-white font-bold'>$400</p></div>


                            <Button size='md' variant='outline' className=' !bg-black text-sm font-bold gap-2 flex-1 !py-3' >
                                <Image src={"/svg-icons/download.svg"} alt="print" width={20} height={20} />
                                <p>Download</p>
                            </Button>
                        </div>
                    </div>

                </div>







            </div>
        </div>
    )
}

export default BookingConfirmed
