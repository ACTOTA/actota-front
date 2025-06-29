'use client'

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react'
import ItineraryCard from '@/src/components/ItineraryCard';
import ClientOnly from '@/src/components/ClientOnly';
import Button from '@/src/components/figma/Button';
import Newsletter from '@/src/components/Newsletter';
import Footer from '@/src/components/Footer';
import ItineraryPageFilter from '@/src/components/ItineraryPageFilter';
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
    const [showFilter, setShowFilter] = useState(false)
    const [advanceFilter, setAdvanceFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    // Filter states - these are the working filters (not applied yet)
    const [filters, setFilters] = useState({
        budget: { 
            max: 5000, 
            enabled: false,
            allocations: {
                activities: 40,
                lodging: 35,
                transportation: 25
            }
        },
        destinations: [''],
        activityTypes: [] as string[],
        themes: [] as string[],
        groupSize: '',
        tripDuration: '',
        lodging: [] as string[],
        transportation: [] as string[],
        guests: { adults: 1, children: 0 },
        dateRange: null as any
    });

    // Applied filters - these are the actual filters used for API calls
    const [appliedFilters, setAppliedFilters] = useState({
        budget: { 
            max: 5000, 
            enabled: false,
            allocations: {
                activities: 40,
                lodging: 35,
                transportation: 25
            }
        },
        destinations: [''],
        activityTypes: [] as string[],
        themes: [] as string[],
        groupSize: '',
        tripDuration: '',
        lodging: [] as string[],
        transportation: [] as string[],
        guests: { adults: 1, children: 0 },
        dateRange: null as any
    });
    
    const [sortBy, setSortBy] = useState('featured');
    
    const searchParams = useSearchParams();

    // Get search parameters from URL as arrays
    const searchLocation = searchParams.getAll('location') || [];
    const arrivalDateTime = searchParams.get('arrival_datetime') || '';
    const departureDateTime = searchParams.get('departure_datetime') || '';
    const searchGuests = searchParams.getAll('guests') || [];
    const searchActivities = searchParams.getAll('activities') || [];

    // Determine if we're in search mode
    const isSearchMode = !!(searchLocation.length || arrivalDateTime || departureDateTime || searchGuests.length || searchActivities.length);

    // Always call both hooks, but conditionally use the data
    const searchQuery = {
        locations: searchLocation,
        arrival_datetime: arrivalDateTime,
        departure_datetime: departureDateTime,
        guests: searchGuests.map(g => parseInt(g)).filter(g => !isNaN(g)),
        activities: searchActivities
    };
    
    const {
        data: searchItineraries,
        isLoading: searchLoading,
        isFetching: searchFetching,
        error: searchError
    } = useSearchItineraries(searchQuery);
    
    const {
        data: regularItineraries,
        isLoading: regularLoading,
        isFetching: regularFetching,
        error: regularError
    } = useItineraries();
    
    // Use the appropriate data based on search mode
    const itineraries = isSearchMode ? searchItineraries : regularItineraries;
    const itinerariesLoading = isSearchMode ? searchLoading : regularLoading;
    const itinerariesFetching = isSearchMode ? searchFetching : regularFetching;
    const itinerariesError = isSearchMode ? searchError : regularError;

    // Determine if we should show loading (either initial loading or fetching new data)
    const isLoadingOrFetching = itinerariesLoading || itinerariesFetching;
    const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pageTitle = isSearchMode ? 'Search Results' : 'Itineraries for You';

    // Function to fetch itineraries with filters
    const fetchItineraries = async (page = 1, isLoadMore = false) => {
        try {
            if (!isLoadMore) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            setError(null);

            let response;
            let data;

            if (isSearchMode) {
                // Use POST for search functionality
                const searchBody = {
                    locations: searchLocation,
                    arrival_datetime: arrivalDateTime,
                    departure_datetime: departureDateTime,
                    guests: searchGuests.map(g => parseInt(g)).filter(g => !isNaN(g)),
                    activities: searchActivities,
                    // Add filter params to search body
                    budget_max: appliedFilters.budget.enabled ? appliedFilters.budget.max : undefined,
                    budget_enabled: appliedFilters.budget.enabled,
                    destinations: appliedFilters.destinations.filter(dest => dest.trim() !== ''),
                    activity_types: appliedFilters.activityTypes,
                    themes: appliedFilters.themes,
                    group_size: appliedFilters.groupSize || undefined,
                    trip_duration: appliedFilters.tripDuration || undefined,
                    lodging: appliedFilters.lodging,
                    transportation: appliedFilters.transportation,
                    page: page,
                    limit: 20,
                    sort: sortBy
                };

                response = await fetch('/api/itineraries/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(searchBody)
                });
            } else {
                // Use GET for regular itinerary fetching with filters
                const queryParams = new URLSearchParams();

                // Add applied filter params
                if (appliedFilters.budget.enabled && appliedFilters.budget.max) {
                    queryParams.set('budget_max', appliedFilters.budget.max.toString());
                    queryParams.set('budget_enabled', 'true');
                }

                if (appliedFilters.destinations.some(dest => dest.trim() !== '')) {
                    appliedFilters.destinations.forEach(dest => {
                        if (dest.trim()) queryParams.append('destinations', dest.trim());
                    });
                }

                if (appliedFilters.activityTypes.length > 0) {
                    appliedFilters.activityTypes.forEach(type => queryParams.append('activity_types', type));
                }

                if (appliedFilters.themes.length > 0) {
                    appliedFilters.themes.forEach(theme => queryParams.append('themes', theme));
                }

                if (appliedFilters.groupSize) {
                    queryParams.set('group_size', appliedFilters.groupSize);
                }

                if (appliedFilters.tripDuration) {
                    queryParams.set('trip_duration', appliedFilters.tripDuration);
                }

                if (appliedFilters.lodging.length > 0) {
                    appliedFilters.lodging.forEach(lodging => queryParams.append('lodging', lodging));
                }

                if (appliedFilters.transportation.length > 0) {
                    appliedFilters.transportation.forEach(transport => queryParams.append('transportation', transport));
                }

                // Add pagination and sorting
                queryParams.set('page', page.toString());
                queryParams.set('limit', '20');
                queryParams.set('sort', sortBy);

                response = await fetch(`/api/itineraries?${queryParams.toString()}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            data = await response.json();

            if (data.success) {
                const newItineraries = Array.isArray(data.data) ? data.data : [];
                
                // Add favorite status to itineraries
                const itinerariesWithFavorites = newItineraries.map((listing: any) =>
                    favorites?.some((favorite: any) => favorite._id?.$oid === listing._id?.$oid)
                        ? { ...listing, isFavorite: true }
                        : listing
                );

                if (isLoadMore) {
                    setListings(prev => [...prev, ...itinerariesWithFavorites]);
                } else {
                    setListings(itinerariesWithFavorites);
                }

                // Update pagination info - for now assume there's more if we got a full page
                setHasMore(newItineraries.length === 20);
                setCurrentPage(page);
            } else {
                throw new Error(data.message || data.error || 'Failed to fetch itineraries');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Function to apply filters
    const handleApplyFilters = () => {
        setAppliedFilters({ ...filters });
        setCurrentPage(1);
        setHasMore(true);
    };

    // Function to load more
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchItineraries(currentPage + 1, true);
        }
    };

    // Sync React Query data with listings state
    useEffect(() => {
        if (itineraries?.data && !itinerariesLoading && !itinerariesError) {
            const itineraryData = Array.isArray(itineraries.data) ? itineraries.data : [];
            const itinerariesWithFavorites = itineraryData.map((listing: any) =>
                favorites?.some((favorite: any) => favorite._id?.$oid === listing._id?.$oid)
                    ? { ...listing, isFavorite: true }
                    : listing
            );
            setListings(itinerariesWithFavorites);
            setIsLoading(false);
            setError(null);
        } else if (itinerariesError) {
            setError(itinerariesError.message);
            setIsLoading(false);
        }
    }, [itineraries, itinerariesLoading, itinerariesError, favorites]);

    // Initial load and when applied filters change
    useEffect(() => {
        if (!isSearchMode) {
            fetchItineraries(1, false);
        }
    }, [appliedFilters, sortBy, isSearchMode, favorites]);

    // Refetch when favorites change
    useEffect(() => {
        if (favorites && listings.length > 0) {
            const updatedListings = listings.map((listing: any) =>
                favorites.some((favorite: any) => favorite._id?.$oid === listing._id?.$oid)
                    ? { ...listing, isFavorite: true }
                    : { ...listing, isFavorite: false }
            );
            setListings(updatedListings);
        }
    }, [favorites]);
    
    return (
        <div className="max-w-[1440px] mx-auto">
            <div className="flex max-md:flex-col-reverse gap-8 p-[80px] max-xl:px-[40px] max-lg:px-[50px] max-md:px-[25px] max-sm:px-[16px] bg-gradient-to-b from-transparent via-[#080E14] to-[#080E14]">
                <div className={`w-[66%] max-lg:w-full ${showFilter ? 'max-lg:hidden' : ''}`}>
                    <h2 className="text-[40px] font-bold text-white max-md:hidden">{pageTitle}</h2>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-white"> <b>{listings.length}</b> Itineraries found.</p>

                        <div className="flex items-center max-md:justify-between gap-4">
                            <div>
                                <Dropdown label={<div className="flex items-center gap-1">
                                    <Image src="/svg-icons/leaf.svg" alt="dropdown-arrow" width={24} height={24} />
                                    <p className="text-primary-gray text-sm  mr-5">Theme</p>
                                </div>} options={["All", "Adventure", "Relaxation", "Culture", "Nature", "Culinary", "Winter"]} onSelect={(value) => {
                                    if (value !== "All") {
                                        setFilters(prev => ({
                                            ...prev,
                                            themes: [(Array.isArray(value) ? value[0] : value).toLowerCase()]
                                        }));
                                    } else {
                                        setFilters(prev => ({
                                            ...prev,
                                            themes: []
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
                        {(isLoading || isLoadingOrFetching) &&
                            <div className="text-white text-center py-10">
                                {isSearchMode ? "Searching itineraries..." : "Loading itineraries..."}
                            </div>
                        }
                        {error &&
                            <div className="text-red-500 text-center py-10">Error: {error}</div>
                        }
                        {!isLoading && !isLoadingOrFetching && !error && listings.length === 0 && (
                            <div className="text-white text-center py-10">
                                No itineraries found. Try adjusting your filters.
                            </div>
                        )}
                        {!isLoading && !isLoadingOrFetching && listings.length > 0 && listings.map((listing, i) => (
                            <ItineraryCard key={i} data={listing} />
                        ))}
                    </div>
                    
                    <div className='sm:hidden flex flex-col'>
                        {(isLoading || isLoadingOrFetching) &&
                            <div className="text-white text-center py-5">
                                {isSearchMode ? "Searching..." : "Loading..."}
                            </div>
                        }
                        {error &&
                            <div className="text-red-500 text-center py-5">Error: {error}</div>
                        }
                        {!isLoading && !isLoadingOrFetching && !error && listings.length === 0 && (
                            <div className="text-white text-center py-5">
                                No itineraries found. Try adjusting your filters.
                            </div>
                        )}
                        {!isLoading && !isLoadingOrFetching && listings.length > 0 && listings.map((listing, i) => (
                            <ListingCard key={i} data={listing} />
                        ))}
                    </div>
                    
                    {!isLoading && !isLoadingOrFetching && listings.length > 0 && hasMore && (
                        <div className="flex justify-center flex-col items-center pt-6">
                            <p className="text-white text-xl font-bold">See More Itineraries</p>
                            <Button 
                                variant="primary" 
                                className="bg-white text-black mt-4"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore ? 'Loading...' : 'Load More'}
                            </Button>
                        </div>
                    )}
                </div>
                
                <div className={`${showFilter ? '' : 'max-lg:hidden'} md:pt-14 w-[33%] max-lg:w-full`}>
                    <ItineraryPageFilter 
                        setShowFilter={setShowFilter}
                        advanceFilter={advanceFilter}
                        setAdvanceFilter={setAdvanceFilter}
                        filters={filters}
                        setFilters={setFilters}
                        onApplyFilters={handleApplyFilters}
                    />
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