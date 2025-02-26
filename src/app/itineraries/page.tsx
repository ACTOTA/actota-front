'use client'
import React, { useEffect, useState } from 'react'
import ItineraryCard from '@/src/components/ItineraryCard';
import Button from '@/src/components/figma/Button';
import Newsletter from '@/src/components/Newsletter';
import Footer from '@/src/components/Footer';
import ItineraryPageFilter from '@/src/components/ItineraryPageFilter';
import ItineraryPageAdvanceFilter from '@/src/components/ItineraryPageAdvanceFilter';
import Dropdown from '@/src/components/figma/Dropdown';
import Image from 'next/image';
import ListingCard from '@/src/components/ListingCard';
import { useItineraries } from '@/src/hooks/queries/itineraries/useItineraryQuery';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFavorites } from '@/src/hooks/queries/account/useFavoritesQuery';
const Itineraries = () => {
    const [listings, setListings] = React.useState<any[]>([]);
    const [showFilter, setShowFilter] = useState(false)
    const [advanceFilter, setAdvanceFilter] = useState(false)
  const { data: itineraries, isLoading: itinerariesLoading, error: itinerariesError } = useItineraries();
  const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();


    useEffect(() => {
        if (itineraries) {
            const filteredListings = itineraries?.data?.map((listing: any) => favorites?.some((favorite: any) => favorite._id.$oid === listing._id.$oid ) ? {...listing, isFavorite: true} : listing);
            setListings(filteredListings);
        }
      }, [itineraries]);
    return (
        <div className="max-w-[1440px] mx-auto ">

            <div className="flex max-md:flex-col-reverse gap-8 p-[80px] max-lg:px-[50px] max-md:px-[25px] max-sm:px-[16px] bg-gradient-to-b from-transparent via-[#080E14] to-[#080E14] ">
                <div className={`w-[66%] max-lg:w-full ${showFilter ? 'max-lg:hidden' : ''}`}>
                    <h2 className="text-[40px] font-bold text-white max-md:hidden">Itineraries for You</h2>
                    <div className="flex items-center justify-between flex-wrap gap-2">

                        <p className="text-white"> <b>{listings.length}</b> Itineraries found.</p>


                        <div className="flex items-center max-md:justify-between gap-4">
                            <div>

                                <Dropdown label={<div className="flex items-center gap-1">
                                    <Image src="/svg-icons/leaf.svg" alt="dropdown-arrow" width={24} height={24} />
                                    <p className="text-primary-gray text-sm  mr-5">Theme</p>
                                </div>} options={["popular", "new", "old"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />
                            </div>
                            <div className='max-md:hidden'>

                                <Dropdown label={<div className="flex items-center gap-1">
                                    <div>

                                        <Image src="/svg-icons/chevron-selector.svg" alt="dropdown-arrow" width={24} height={24} />
                                    </div>
                                </div>} options={["Lowest Price", "Highest Price", "Any Duration"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />

                            </div>

                            <div className='lg:hidden'>
                                <Button variant="simple" className=" gap-1" onClick={() => setShowFilter(!showFilter)}><Image src="/svg-icons/filter.svg" alt="filter" width={24} height={24} /> Filter <ArrowRightIcon className='size-4' /></Button>
                            </div>


                        </div>




                    </div>
                    <div className='max-sm:hidden'>
                        {listings.map((listing, i) => (
                            <ItineraryCard key={i} data={listing} />
                        ))}
                    </div>
                    <div className='sm:hidden flex flex-col'>
                    {itinerariesLoading && <div>Loading...</div>}
                    {itinerariesError && <div>Error: {itinerariesError.message}</div>}
                        {listings.length > 0 && listings.map((listing, i) => (
                            <ListingCard key={i} data={listing} />
                        ))}
                    </div>
                    <div className="flex justify-center flex-col items-center pt-6">
                        <p className="text-white text-xl font-bold">See More Itineraries</p>
                        <Button variant="primary" className="bg-white text-black mt-4 ">Load More</Button>
                    </div>
                </div>
                <div className={`${showFilter ? '' : 'max-lg:hidden'} md:pt-14 w-[33%] max-lg:w-full`}>
                    {advanceFilter ?
                        <ItineraryPageAdvanceFilter setShowFilter={setShowFilter} advanceFilter={advanceFilter} setAdvanceFilter={setAdvanceFilter} />
                        :
                        <ItineraryPageFilter setShowFilter={setShowFilter} advanceFilter={advanceFilter} setAdvanceFilter={setAdvanceFilter} />
                    }
                </div>
                <h2 className="text-[40px] font-bold text-white md:hidden">Itineraries for You</h2>

            </div>
            <Newsletter />
            <Footer />
        </div>

    )
}

export default Itineraries
