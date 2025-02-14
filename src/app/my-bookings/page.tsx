'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import { FeaturedVacation } from '@/db/models/itinerary';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ClockIcon, HeartIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { Theme } from '@/src/components/enums/theme';
import Button from '@/src/components/figma/Button';
import { getAuthCookie } from '@/src/helpers/auth';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { FaRegHeart, FaStar } from 'react-icons/fa6';
import { CgSoftwareUpload } from 'react-icons/cg';
import { LuArrowRight, LuUser, LuUsers } from 'react-icons/lu';
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
import DrawerModal from '@/src/components/DrawerModal';
import Input from '@/src/components/figma/Input';

export default function MyBookings() {
  const pathname = usePathname() as string;
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
            <div className='inline-flex justify-between items-center gap-4 mt-3'>
              <Image src="/svg-icons/waivers-icon.svg" alt="waivers" height={48} width={48} />
              <div>
                <p className='text-white text-2xl font-bold'>Waivers</p>
                <p className='text-primary-gray  mt-1'>You’re required to sign all the waivers before the trip.</p>
              </div>

            </div>



            <div className='flex gap-4 mt-4'>

              <div className="flex-1 bg-gradient-to-br from-[#FEDB25] via-border-primary to-border-primary rounded-xl p-[2px]">
                <div className=" bg-black bg-opacity-80 rounded-xl">

                  <div className="flex justify-between items-center rounded-xl p-3">
                    <div className='inline-flex justify-between items-start gap-2'>
                      <Image src="/svg-icons/alert-icon.svg" alt="waivers" className='mt-1' height={20} width={20} />
                      <div>
                        <p className='text-white  font-bold'>Waiver Title</p>
                        <p className='text-primary-gray text-xs mt-1'>Short description about this waiver</p>
                      </div>

                    </div>
                    <Button variant='simple' onClick={() => setIsDrawerOpen(true)} className=' !text-[#BBD4FB] text-sm font-bold flex items-center gap-1'>Sign Now <LuArrowRight className='text-[#BBD4FB] size-5 mt-1' /></Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-[#FEDB25] via-border-primary to-border-primary rounded-xl p-[2px]">
                <div className=" bg-black bg-opacity-80 rounded-xl">

                  <div className="flex justify-between items-center rounded-xl p-3">
                    <div className='inline-flex justify-between items-start gap-2'>
                      <Image src="/svg-icons/alert-icon.svg" alt="waivers" className='mt-1' height={20} width={20} />
                      <div>
                        <p className='text-white  font-bold'>Waiver Title</p>
                        <p className='text-primary-gray text-xs mt-1'>Short description about this waiver</p>
                      </div>

                    </div>
                    <Button variant='simple' onClick={() => setIsDrawerOpen(true)} className=' !text-[#BBD4FB] text-sm font-bold flex items-center gap-1'>Sign Now <LuArrowRight className='text-[#BBD4FB] size-5 mt-1' /></Button>
                  </div>
                </div>
              </div>
            </div>


            <div className='flex gap-4 mt-4'>

              <div className="flex-1 bg-gradient-to-br from-[#FEDB25] via-border-primary to-border-primary rounded-xl p-[2px]">
                <div className=" bg-black bg-opacity-80 rounded-xl">

                  <div className="flex justify-between items-center rounded-xl p-3">
                    <div className='inline-flex justify-between items-start gap-2'>
                      <Image src="/svg-icons/alert-icon.svg" alt="waivers" className='mt-1' height={20} width={20} />
                      <div>
                        <p className='text-white  font-bold'>Waiver Title</p>
                        <p className='text-primary-gray text-xs mt-1'>Short description about this waiver</p>
                      </div>

                    </div>
                    <Button variant='simple' onClick={() => setIsDrawerOpen(true)} className=' !text-[#BBD4FB] text-sm font-bold flex items-center gap-1'>Sign Now <LuArrowRight className='text-[#BBD4FB] size-5 mt-1' /></Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-[#FEDB25] via-border-primary to-border-primary rounded-xl p-[2px]">
                <div className=" bg-black bg-opacity-80 rounded-xl">

                  <div className="flex justify-between items-center rounded-xl p-3">
                    <div className='inline-flex justify-between items-start gap-2'>
                      <Image src="/svg-icons/alert-icon.svg" alt="waivers" className='mt-1' height={20} width={20} />
                      <div>
                        <p className='text-white  font-bold'>Waiver Title</p>
                        <p className='text-primary-gray text-xs mt-1'>Short description about this waiver</p>
                      </div>

                    </div>
                    <Button variant='simple' onClick={() => setIsDrawerOpen(true)} className=' !text-[#BBD4FB] text-sm font-bold flex items-center gap-1'>Sign Now <LuArrowRight className='text-[#BBD4FB] size-5 mt-1' /></Button>
                  </div>
                </div>
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

        <video src="/videos/DVbanner.mp4" controls loop className='w-full h-full object-cover rounded-lg mt-4 border border-primary-gray' />
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
      <DrawerModal isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
        <div className='flex flex-1 flex-col gap-4 p-8'>
          <div className="flex items-center  justify-between">
            <h1></h1>

            <h2 className="text-lg font-bold text-center text-white">Waiver Title</h2>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
            >
              <span className="sr-only text-white">Close menu</span>
              <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className=''>
            <p className='text-white '>
              I, Johnny John, hereby declare the following:

              I am fully and personally responsible for my own safety and actions while and during my participation
              and I recognize that I may be in any case be at risk of [text here].
              <br />
              <br />
              With full knowledge of the risks involved, I hereby release, waive, discharge ACTOTA, from
              any and all liabilities, claims, demands, actions, and causes of action whatsoever, directly or indirectly
              arising out of or related to any loss, damage, injury, or death, that may be sustained by me related to
              COVID-19 while participating in any activity while in, on, or around the premises or while participating in activities that may lead to unintentional exposure or harm due to the risks involved.
              <br />
              <br />
              I understand that ACTOTA will be taking extensive precautions to protect the guests and to limit the likelihood of unfortunate events and that I am aware of the risks involved from receiving service
              from the company.
              <br />
              <br />
              I agree to indemnify, defend, and hold harmless the company from and against any and all costs, expenses, damages, lawsuits, and/or liabilities or claims arising whether directly or indirectly from or related to any
              and all claims made by or against any of the released party due to injury, loss, or death.
              <br />
              <br />
              By signing below I acknowledge that I have read the [Waiver Title] and understand its contents; and fully competent to give my consent; That I have been sufficiently informed of the risks
              involved and give my voluntary consent in signing it as my own free act and deed; with full intention to be
              bound by the same, and free from any inducement or representation.
              <br />
              <br />
              In signing this waiver, I agree to cooperate in a safe and orderly manner throughout the trip duration.
            </p>
          </div>
          <div className='flex justify-between items-center gap-2'>
            <div className='flex-1'>

              <Input placeholder='Your Full Name' />
            </div>
            <Button variant='primary' className='px-10' >
              <p>Sign</p>
            </Button>
          </div>
          <p className='text-primary-gray '>Signature</p>
        </div>
      </DrawerModal>
    </section>
  );
}
