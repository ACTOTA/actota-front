'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import { FeaturedVacation } from '@/db/models/itinerary';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ClockIcon, HeartIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { Theme } from '@/src/components/enums/theme';
import Button from '@/src/components/figma/Button';
import { default as ButtonWithIcon } from '@/src/components/Button';
import { getAuthCookie } from '@/src/helpers/auth';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { FaRegHeart, FaStar } from 'react-icons/fa6';
import { CgSoftwareUpload } from 'react-icons/cg';
import { LuUser, LuUsers } from 'react-icons/lu';
import { PiClockDuotone } from 'react-icons/pi';
import { GoHome } from 'react-icons/go';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import ActivityTag from '@/src/components/figma/ActivityTag';
import BookingCard from '@/src/components/profileComponents/bookings/BookingCard';
import Newsletter from '@/src/components/Newsletter';
import Footer from '@/src/components/Footer';
import { FiEdit3 } from 'react-icons/fi';
import { CiMail } from 'react-icons/ci';
import { GrLocation } from 'react-icons/gr';
import { RxArrowTopRight } from 'react-icons/rx';

export default function MyBookings() {
  const pathname = usePathname() as string;
  const router = useRouter();
  const [bookings, setBookings] = React.useState<any>({
    id: 1,
    status: "upcoming",
    delay_insurance: false,
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
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);








  return (
    <section className='w-full !h-full text-white  gap-4'>
      <div className='flex items-center gap-2  px-[64px] pt-[80px] max-sm:px-6 max-lg:px-10'>
        <ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer" onClick={() => router.push("/")} />
        <p className='text-primary-gray text-sm'>My Bookings / <span className='text-white'>Denver Tour</span></p>
      </div>
      <div className='flex gap-4 flex-col md:flex-row md:items-center px-[64px] max-sm:px-6 max-lg:px-10'>
        <h1 className='text-4xl font-bold me-auto'>{bookings.trip_name}</h1>
        <div className='flex items-center md:flex-nowrap flex-wrap gap-2'>
          <Button variant="outline" size='none' className='p-4' onClick={() => { }}>
            <FaRegHeart className='h-6 w-6 text-white' />
          </Button>

          <Button variant="outline" size='md' className='gap-1' onClick={() => { }}>
            <CgSoftwareUpload className='h-6 w-6 text-white' />
            <p>Share</p>
          </Button>
        </div>
      </div>
      <div className='grid md:grid-cols-12 lg:grid-cols-7 gap-6 mt-4 px-[80px] max-sm:px-6 max-lg:px-10 '>
        <div className='md:col-span-8 lg:col-span-5 -mt-4 '>
          <BookingCard data={bookings} />


          <div className='mt-8'>
            <p className='text-white text-2xl font-bold'>Guest Information</p>
            <div className='flex justify-between items-center gap-4 mt-3'>
              <div className=' gap-2 flex-1 rounded-xl  p-4 border border-primary-gray' >
                <p className='text-white text-sm font-bold flex items-center gap-2 mb-2'>Guest 1 <FiEdit3 className='text-white size-5' /></p>
                <p className='text-white text-sm font-bold flex items-center gap-2 mb-2'><LuUser className='text-white size-5' />Johnny John </p>
                <p className='text-white text-sm font-bold flex items-center gap-2'> <CiMail className='text-white size-5' />johnnyjohn@gmail.com </p>
              </div>
              <div className=' gap-2 flex-1 rounded-xl  p-4 border border-primary-gray' >
                <p className='text-white text-sm font-bold flex items-center gap-2 mb-2'>Guest 2 <FiEdit3 className='text-white size-5' /></p>
                <p className='text-white text-sm font-bold flex items-center gap-2 mb-2'><LuUser className='text-white size-5' />Johnny John </p>
                <p className='text-white text-sm font-bold flex items-center gap-2'> <CiMail className='text-white size-5' />johnnyjohn@gmail.com </p>
              </div>
            </div>
          </div>


          <div className='mt-8'>
            <p className='text-white text-2xl font-bold'>About</p>
            <p className='text-primary-gray text-sm mt-2'>Experience the ultimate Colorado vacation with a 6-day itinerary that takes you to Idaho Springs, Glenwood Springs, and Denver. Enjoy the adrenaline rush of white water rafting, the tranquility of camping, the intrigue of gold mines, and the challenge of hiking the Rockies.</p>
          </div>

        </div>

        <div className='md:col-span-4 lg:col-span-2'>
          <div className=' bg-[#141414] rounded-2xl border border-primary-gray'>
            <div className=' rounded-lg p-4 flex flex-col  gap-1 '>
              <div className='flex justify-between  mb-2'>
                <p className='text-white font-bold'> Total amount</p><p className='text-white font-bold'>${bookings.person_cost}</p></div>

              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent my-2"></div>

              <div className='flex justify-between mt-2' >
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

              <div className='mt-2 flex justify-between gap-2'>

                <Button size='md' variant='outline' className=' !bg-black text-sm font-bold gap-2 flex-1' >
                  <Image src={"/svg-icons/printer.svg"} alt="print" width={20} height={20} />
                  <p>Print</p>
                </Button>
                <Button size='md' variant='outline' className=' !bg-black text-sm font-bold gap-2 flex-1' >
                  <Image src={"/svg-icons/download.svg"} alt="print" width={20} height={20} />
                  <p>Download</p>
                </Button>
              </div>
            </div>
          </div>
        </div>



        
      </div>


      <div className='mt-8 px-[80px] max-sm:px-6 max-lg:px-10'>
        <p className='text-white text-2xl font-bold'>Guide’s Message</p>

        <video src="/videos/DVbanner.mp4" controls loop  className='w-full h-full object-cover rounded-lg mt-4 border border-primary-gray' />
      </div>

      <div className='mt-8 px-[80px] max-sm:px-6 max-lg:px-10'>
        <p className='text-white text-2xl font-bold'>Dining Recommendations</p>
        <div className='flex gap-4'>

          {Array.from({ length: 4 }).map((_, index) => (
            <div className='flex justify-between items-center gap-4 mt-3'>
              <div className='relative'>
                <Image src="/images/hero-bg.jpg" alt="hero background" height={180} width={360} className=' rounded-lg mb-3' />
                <div className='absolute top-2 right-2 h-[32px] w-[32px] bg-black/50  flex items-center justify-center rounded-[4px]'><RxArrowTopRight /></div>
                <p className=' font-bold'>Hotel Name</p>
                <p className='text-white  text-center flex items-center gap-1 py-2'>
                  <FaStar className='text-[#FEDB25] mb-1' />
                  4.8
                  <span className='text-primary-gray'> (112)</span>
                </p>
                <p className='flex items-center gap-2 mb-1'><GrLocation /> <span>Denver, CO</span></p>
                <p className='flex items-center gap-2'>$150 <span className='text-primary-gray text-xs' >for 5 nights</span></p>
              </div>
            </div>
          ))}
        </div>

      </div>



      <Newsletter />
      <Footer />

    </section>
  );
}
