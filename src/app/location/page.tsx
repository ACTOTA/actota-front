"use client"
import { FeaturedVacation } from '@/db/models/itinerary'
import Button from '@/src/components/figma/Button'
import Footer from '@/src/components/Footer'
import ListingCard from '@/src/components/ListingCard'
import MapPage from '@/src/components/MapPage'
import Newsletter from '@/src/components/Newsletter'
import SimpleCard from '@/src/components/SimpleCard'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'
import Image from 'next/image'
import React from 'react'
import { FaStar } from 'react-icons/fa6'
import { GrLocation } from 'react-icons/gr'
import { MdOutlineDirectionsCarFilled } from 'react-icons/md'
import { RxArrowTopRight } from "react-icons/rx";
const Location = () => {
  const [listings, setListings] = React.useState<FeaturedVacation[]>([{
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
  },
  {
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
  }, {
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
  }, {
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
  },]);

  const info = [
    {
      // theme: Theme.Activity,
      image: "/images/hero-bg.jpg",
      title: "Customize your Itineraries",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
    {
      // theme: Theme.Transportation,
      image: "/images/hero-bg.jpg",
      title: "Allocate your Budget",
      description: "Free cancellation and payment to satisfy your budget and plans."

    },
    {
      // theme: Theme.Lodging,
      image: "/images/hero-bg.jpg",
      title: "Guide Experience",
      description: "Free cancellation and payment to satisfy your budget and plans."
    },
  ]
  return (
    <div className='w-full h-full '>
      <section className='flex justify-center  max-w-[1440px] px-[120px] 2xl:mx-auto '>

        <div className=' text-white   '>

          <div className=' flex items-center gap-2 my-6  pt-[80px]'>
            <ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer" />
            <p className='text-primary-gray text-sm'>Explore / <span className='text-white'> St. Mary’s Glacier</span></p>
          </div>
          <div className="w-full h-[588px] relative flex items-center justify-center">
            <Image
              width={10}
              height={10}
              src="/hero-bg.svg"
              alt="hero background"
              className="absolute inset-0 w-full h-[588px] object-cover rounded-[32px]"
              priority
            />

            <div className={`relative w-full flex flex-col items-center justify-center       `}>
              <p className='text-white text-[80px] font-extrabold leading-[88px] text-center'>
                St. Mary’s Glacier
              </p>

              <div className='flex items-center justify-center gap-8 mt-4'>
                <p className='text-white  text-center flex items-center gap-1'>
                  <FaStar className='text-[#FEDB25] mb-1' />
                  4.8
                  (112 Reviews)
                </p>
                <div className='w-[1px] h-[16px] bg-white'></div>
                <p className='text-white  text-center'>
                  Hiking Trail
                </p>
                <div className='w-[1px] h-[16px] bg-white'></div>
                <p className='text-white  text-center flex items-center gap-1'>
                  <MdOutlineDirectionsCarFilled className='text-white h-[20px] w-[20px]' />
                  1hr from Denver
                </p>
              </div>

            </div>
          </div>
          <div className='flex items-start justify-center gap-4 mt-20'>
            <div className='w-[288px] h-[352px] rounded-2xl border border-primary-gray relative overflow-hidden'>
              <Image
                width={10}
                height={10}
                src="/hero-bg.svg"
                alt="hero background"
                className=" w-full h-[352px] object-cover "
                priority
              />
              <div className='absolute bottom-4 left-4 w-full h-[40px]  flex items-center justify-between rounded-lg'>
                <p className='text-white text-xl'>St. Mary’s Glacier</p>
                <p className='rounded-full h-[24px] w-[24px] bg-white mr-6'></p>
              </div>
            </div>
            <div className='w-[288px] h-[352px] rounded-2xl border border-primary-gray relative overflow-hidden'>
              <Image
                width={10}
                height={10}
                src="/hero-bg.svg"
                alt="hero background"
                className=" w-full h-[352px] object-cover "
                priority
              />
              <div className='absolute bottom-4 left-4 w-full h-[40px]  flex items-center justify-between rounded-lg'>
                <p className='text-white text-xl'>St. Mary’s Glacier</p>
                <p className='rounded-full h-[24px] w-[24px] bg-white mr-6'></p>
              </div>
            </div>
            <div className='w-[288px] h-[352px] rounded-2xl border border-primary-gray relative overflow-hidden'>
              <Image
                width={10}
                height={10}
                src="/hero-bg.svg"
                alt="hero background"
                className=" w-full h-[352px] object-cover "
                priority
              />
              <div className='absolute bottom-4 left-4 w-full h-[40px]  flex items-center justify-between rounded-lg'>
                <p className='text-white text-xl'>St. Mary’s Glacier</p>
                <p className='rounded-full h-[24px] w-[24px] bg-white mr-6'></p>
              </div>
            </div>
            <div className='w-[288px] h-[352px] rounded-2xl border border-primary-gray relative overflow-hidden'>
              <Image
                width={10}
                height={10}
                src="/hero-bg.svg"
                alt="hero background"
                className=" w-full h-[352px] object-cover "
                priority
              />
              <div className='absolute bottom-4 left-4 w-full h-[40px]  flex items-center justify-between rounded-lg'>
                <p className='text-white text-xl'>St. Mary’s Glacier</p>
                <p className='rounded-full h-[24px] w-[24px] bg-white mr-6'></p>
              </div>
            </div>
          </div>
          <div className='flex justify-between mt-16'>
            <p className='text-xl font-bold '>What <br />
              to Do</p>
            <p className='text-[56px] leading-[72px]  font-bold  -mt-3 '>Recommended <br /> Activities</p>
            <p className='text-base font-normal text-primary-gray max-w-[380px]'>Saint Mary's Glacier is a gorgeous destination, and it is not terribly hard to reach. The trail is less than 2 miles round trip assuming you stop at the lake. The path is wide and climbs to the lake and glacier.</p>
          </div>

          <div className='flex flex-wrap gap-4 mt-16'>
            {info.map((item) => (
              <SimpleCard showButton={true} image={item.image} title={item.title} description={item.description} />
            ))}
          </div>

          <p className='text-xl font-bold mt-10'>Other Popular Activities</p>
          <div className='flex gap-2 items-center mt-4'>
            {["Cross-country skiing", "Fishing", "Hiking", "Snowshoeing"].map((item) => (
              <Button variant="outline" size="sm" className='!text-primary-gray text-[16px] font-normal'>{item}</Button>
            ))}
          </div>
          <div className='flex flex-wrap gap-8 mt-20'>
            <div className="flex-1">
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                <div className="w-full h-[370px] rounded-xl overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px'
                    }}
                    center={{ lat: 39.7392, lng: -105.0000 }}
                    zoom={10}
                  >

                    <Marker
                      position={{ lat: 39.7392, lng: -105.0000 }}
                    />
                  </GoogleMap>
                </div>
              </LoadScript>
            </div>
            <div className='flex-1 flex flex-col gap-2'>
              <p className='text-2xl font-bold'>The Area</p>
              <p className='flex items-center gap-2'><GrLocation /> <span>Denver, CO</span></p>
              <div className='flex items-center gap-4 mt-4 '>
                <div className='relative'>
                  <Image src="/images/hero-bg.jpg" alt="hero background" height={180} width={284} className=' rounded-lg mb-3' />
                  <div className='absolute top-2 right-2 h-[32px] w-[32px] bg-black/50  flex items-center justify-center rounded-[4px]'><RxArrowTopRight /></div>
                  <p className=' font-bold'>Hotel Name</p>
                  <p className='text-white  text-center flex items-center gap-1 py-2'>
                    <FaStar className='text-[#FEDB25] mb-1' />
                    4.8
                    <span className='text-primary-gray'> (112)</span>
                  </p>
                  <p className='flex items-center gap-2'><GrLocation /> <span>Denver, CO</span></p>
                </div>
                <div className='relative'>
                  <Image src="/images/hero-bg.jpg" alt="hero background" height={180} width={284} className=' rounded-lg mb-3' />
                  <div className='absolute top-2 right-2 h-[32px] w-[32px] bg-black/50  flex items-center justify-center rounded-[4px]'><RxArrowTopRight /></div>

                  <p className=' font-bold'>Hotel Name</p>
                  <p className='text-white  text-center flex items-center gap-1 py-2'>
                    <FaStar className='text-[#FEDB25] mb-1' />
                    4.8
                    <span className='text-primary-gray'> (112)</span>
                  </p>
                  <p className='flex items-center gap-2'><GrLocation /> <span>Denver, CO</span></p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='flex justify-center  max-w-[1440px] mx-[64px] 2xl:mx-auto '>

        <div className=' w-full  ml-[20px] mt-10'>

          <div className=" flex justify-between items-center py-5  text-white">
            <h2 className="text-[56px] font-bold">Itineraries for You</h2>
            <Button variant="primary" size="md">Find More Itineraries</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            {listings?.map((listing) => (
              <ListingCard
                // key={(listing._id as { $oid: string }).$oid}
                key={listing.trip_name}
                data={listing}
              />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  )
}

export default Location