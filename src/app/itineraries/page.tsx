'use client'

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react'
import ItineraryCard from '@/src/components/ItineraryCard';
import ClientOnly from '@/src/components/ClientOnly';
import Button from '@/src/components/figma/Button';
import Newsletter from '@/src/components/Newsletter';
import Footer from '@/src/components/Footer';
import ItineraryPageFilter from '@/src/components/ItineraryPageFilter';
import ItineraryPageAdvanceFilter from '@/src/components/ItineraryPageAdvanceFilter';
import Dropdown from '@/src/components/figma/Dropdown';
import Image from 'next/image';
import ListingCard from '@/src/components/ListingCard';
import { useItineraries } from '@/src/hooks/queries/itineraries/useItineraryQuery';
import { useSearchItineraries } from '@/src/hooks/queries/itineraries/useSearchItineraryQuery';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFavorites } from '@/src/hooks/queries/account/useFavoritesQuery';
import { useSearchParams } from 'next/navigation';

const Itineraries = () => {
    const [listings, setListings] = React.useState<any[]>([]);
    const [filteredListings, setFilteredListings] = React.useState<any[]>([]);
    const [showFilter, setShowFilter] = useState(false)
    const [advanceFilter, setAdvanceFilter] = useState(false)
    
    // Filter states
    const [filters, setFilters] = useState({
        budget: { max: 5000, enabled: false },
        destinations: [''],
        activities: [] as string[],
        lodging: [] as string[],
        transportation: [] as string[],
        guests: { adults: 1, children: 0 },
        dateRange: null as any
    });
    
    const [sortBy, setSortBy] = useState('featured');
    
    const searchParams = useSearchParams();

    // Get search parameters from URL as arrays
    const searchLocation = searchParams.getAll('location') || [];
    const searchDuration = searchParams.getAll('duration') || [];
    const searchGuests = searchParams.getAll('guests') || [];
    const searchActivities = searchParams.getAll('activities') || [];

    // Determine if we're in search mode
    const isSearchMode = !!(searchLocation.length || searchDuration.length || searchGuests.length || searchActivities.length);

    // Use the appropriate query based on whether we're searching or not
    const {
        data: itineraries,
        isLoading: itinerariesLoading,
        error: itinerariesError
    } = isSearchMode
            ? useSearchItineraries({
                locations: searchLocation,
                duration: searchDuration.map(d => parseInt(d)).filter(d => !isNaN(d)),
                guests: searchGuests.map(g => parseInt(g)).filter(g => !isNaN(g)),
                activities: searchActivities
            })
            : useItineraries();

    const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();

    const pageTitle = isSearchMode ? 'Search Results' : 'Itineraries for You';

    // Filter and sort functions
    const applyFilters = (data: any[]) => {
        let filtered = [...data];

        // Budget filter
        if (filters.budget.enabled && filters.budget.max) {
            filtered = filtered.filter(item => {
                const totalCost = (item.person_cost || 0) * (filters.guests.adults + filters.guests.children);
                return totalCost <= filters.budget.max;
            });
        }

        // Destination filter
        if (filters.destinations.some(dest => dest.trim() !== '')) {
            filtered = filtered.filter(item => {
                const itemLocations = [
                    item.start_location?.city,
                    item.start_location?.state,
                    item.end_location?.city,
                    item.end_location?.state
                ].filter(Boolean).map(loc => loc.toLowerCase());
                
                return filters.destinations.some(dest => {
                    if (!dest.trim()) return true;
                    return itemLocations.some(loc => loc.includes(dest.toLowerCase().trim()));
                });
            });
        }

        // Activities filter
        if (filters.activities.length > 0) {
            filtered = filtered.filter(item => {
                const itemActivities = (item.activities || []).map((act: any) => 
                    (act.label || act.name || act).toLowerCase()
                );
                return filters.activities.some(activity => 
                    itemActivities.some((itemAct: string) => itemAct.includes(activity.toLowerCase()))
                );
            });
        }

        // Lodging filter
        if (filters.lodging.length > 0) {
            filtered = filtered.filter(item => {
                const itemLodging = (item.lodging || []).map((lodge: any) => 
                    (lodge.type || lodge.name || lodge).toLowerCase()
                );
                return filters.lodging.some(lodging => 
                    itemLodging.some((itemLodge: string) => itemLodge.includes(lodging.toLowerCase()))
                );
            });
        }

        // Transportation filter
        if (filters.transportation.length > 0) {
            filtered = filtered.filter(item => {
                const itemTransportation = (item.transportation || []).map((transport: any) => 
                    (transport.type || transport.name || transport).toLowerCase()
                );
                return filters.transportation.some(transportation => 
                    itemTransportation.some((itemTransport: string) => itemTransport.includes(transportation.toLowerCase()))
                );
            });
        }

        // Guest count filter (check if itinerary can accommodate the number of guests)
        const totalGuests = filters.guests.adults + filters.guests.children;
        filtered = filtered.filter(item => {
            const minGroup = item.min_group || item.min_guests || 1;
            const maxGroup = item.max_group || item.max_guests || 10;
            return totalGuests >= minGroup && totalGuests <= maxGroup;
        });

        return filtered;
    };

    const applySorting = (data: any[]) => {
        const sorted = [...data];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => (a.person_cost || 0) - (b.person_cost || 0));
            case 'price-high':
                return sorted.sort((a, b) => (b.person_cost || 0) - (a.person_cost || 0));
            case 'duration-short':
                return sorted.sort((a, b) => (a.length_days || 0) - (b.length_days || 0));
            case 'duration-long':
                return sorted.sort((a, b) => (b.length_days || 0) - (a.length_days || 0));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case 'popular':
                return sorted.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
            default:
                return sorted; // Featured order (default from API)
        }
    };

    // Update filtered listings when data or filters change
    useEffect(() => {
        if (listings.length > 0) {
            let filtered = applyFilters(listings);
            filtered = applySorting(filtered);
            setFilteredListings(filtered);
        } else {
            setFilteredListings([]);
        }
    }, [listings, filters, sortBy]);

    useEffect(() => {
        if (itineraries && itineraries.data) {

            // Check if data is an array or nested in another property
            let dataToUse = Array.isArray(itineraries.data)
                ? itineraries.data
                : itineraries.data || itineraries.data || [];

            console.log('Data to use length:', dataToUse.length);

            try {
                const filteredListings = dataToUse.map((listing: any) =>
                    favorites?.some((favorite: any) => favorite._id?.$oid === listing._id?.$oid)
                        ? { ...listing, isFavorite: true }
                        : listing
                );
                console.log('Setting listings:', filteredListings.length);
                setListings(filteredListings || []);
            } catch (error) {
                console.error('Error processing itineraries data:', error);
                setListings([]);
            }
        } else {
            console.log('No itineraries data available');
            setListings([]);
        }
    }, [itineraries, favorites]);
    
    return (
        <div className="max-w-[1440px] mx-auto">
            <div className="flex max-md:flex-col-reverse gap-8 p-[80px] max-xl:px-[40px] max-lg:px-[50px] max-md:px-[25px] max-sm:px-[16px] bg-gradient-to-b from-transparent via-[#080E14] to-[#080E14]">
                <div className={`w-[66%] max-lg:w-full ${showFilter ? 'max-lg:hidden' : ''}`}>
                    <h2 className="text-[40px] font-bold text-white max-md:hidden">{pageTitle}</h2>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-white"> <b>{filteredListings.length}</b> Itineraries found.</p>

                        <div className="flex items-center max-md:justify-between gap-4">
                            <div>
                                <Dropdown label={<div className="flex items-center gap-1">
                                    <Image src="/svg-icons/leaf.svg" alt="dropdown-arrow" width={24} height={24} />
                                    <p className="text-primary-gray text-sm  mr-5">Theme</p>
                                </div>} options={["All", "Adventure", "Relaxation", "Culture"]} onSelect={(value) => {
                                    if (value !== "All") {
                                        setFilters(prev => ({
                                            ...prev,
                                            activities: [value as string]
                                        }));
                                    } else {
                                        setFilters(prev => ({
                                            ...prev,
                                            activities: []
                                        }));
                                    }
                                }} className="border-none !bg-[#141414] rounded-lg" />
                            </div>
                            <div className='max-md:hidden'>
                                <Dropdown label={<div className="flex items-center gap-1">
                                    <div>
                                        <Image src="/svg-icons/chevron-selector.svg" alt="dropdown-arrow" width={24} height={24} />
                                    </div>
                                </div>} options={[
                                    "Featured", 
                                    "Lowest Price", 
                                    "Highest Price", 
                                    "Shortest Duration",
                                    "Longest Duration",
                                    "Newest"
                                ]} onSelect={(value) => {
                                    const sortMap: { [key: string]: string } = {
                                        "Featured": "featured",
                                        "Lowest Price": "price-low",
                                        "Highest Price": "price-high",
                                        "Shortest Duration": "duration-short",
                                        "Longest Duration": "duration-long",
                                        "Newest": "newest"
                                    };
                                    const selectedValue = Array.isArray(value) ? value[0] : value;
                                    setSortBy(sortMap[selectedValue] || "featured");
                                }} className="border-none !bg-[#141414] rounded-lg" />
                            </div>

                            <div className='lg:hidden'>
                                <Button variant="simple" className=" gap-1" onClick={() => setShowFilter(!showFilter)}><Image src="/svg-icons/filter.svg" alt="filter" width={24} height={24} /> Filter <ArrowRightIcon className='size-4' /></Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className='max-sm:hidden'>
                        {itinerariesLoading &&
                            <div className="text-white text-center py-10">Loading itineraries...</div>
                        }
                        {itinerariesError &&
                            <div className="text-red-500 text-center py-10">Error: {itinerariesError.message}</div>
                        }
                        {!itinerariesLoading && !itinerariesError && filteredListings.length === 0 && (
                            <div className="text-white text-center py-10">
                                {isSearchMode
                                    ? "No itineraries found matching your search criteria. Try adjusting your filters."
                                    : listings.length === 0 
                                        ? "No itineraries available at the moment."
                                        : "No itineraries match your current filters. Try adjusting your criteria."}
                            </div>
                        )}
                        {filteredListings.length > 0 && filteredListings.map((listing, i) => (
                            <ItineraryCard key={i} data={listing} />
                        ))}
                    </div>
                    
                    <div className='sm:hidden flex flex-col'>
                        {itinerariesLoading &&
                            <div className="text-white text-center py-5">Loading itineraries...</div>
                        }
                        {itinerariesError &&
                            <div className="text-red-500 text-center py-5">Error: {itinerariesError.message}</div>
                        }
                        {!itinerariesLoading && !itinerariesError && filteredListings.length === 0 && (
                            <div className="text-white text-center py-5">
                                {isSearchMode
                                    ? "No itineraries found matching your search criteria."
                                    : listings.length === 0 
                                        ? "No itineraries available."
                                        : "No itineraries match your current filters. Try adjusting your criteria."}
                            </div>
                        )}
                        {filteredListings.length > 0 && filteredListings.map((listing, i) => (
                            <ListingCard key={i} data={listing} />
                        ))}
                    </div>
                    
                    {filteredListings.length > 0 && (
                        <div className="flex justify-center flex-col items-center pt-6">
                            <p className="text-white text-xl font-bold">See More Itineraries</p>
                            <Button variant="primary" className="bg-white text-black mt-4 ">Load More</Button>
                        </div>
                    )}
                </div>
                
                <div className={`${showFilter ? '' : 'max-lg:hidden'} md:pt-14 w-[33%] max-lg:w-full`}>
                    {advanceFilter ?
                        <ItineraryPageAdvanceFilter setShowFilter={setShowFilter} advanceFilter={advanceFilter} setAdvanceFilter={setAdvanceFilter} />
                        :
                        <ItineraryPageFilter 
                            setShowFilter={setShowFilter} 
                            advanceFilter={advanceFilter} 
                            setAdvanceFilter={setAdvanceFilter}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    }
                </div>
                <h2 className="text-[40px] font-bold text-white md:hidden">{pageTitle}</h2>
            </div>
            <Newsletter />
            <Footer />
        </div>
    )
}

// Wrap in a safe server component for initial render
const ItinerariesPage = () => {
    return (
        <>
            <ClientOnly>
                <Itineraries />
            </ClientOnly>
        </>
    )
}

export default ItinerariesPage