'use client';

import React, { useEffect, useState } from "react";
import ListingCard from "@/src/components/ListingCard";
import ItineraryCardSkeleton from "@/src/components/ItineraryCardSkeleton";
import Button from "@/src/components/figma/Button";
import SortDropdown, { SortOption } from "@/src/components/shared/SortDropdown";
import Image from "next/image";
import { useItineraries } from "../hooks/queries/itineraries/useItineraryQuery";
import { useFavorites } from "../hooks/queries/account/useFavoritesQuery";
import { IoLeafOutline } from "react-icons/io5";
import { FaMountain, FaUmbrellaBeach, FaCity } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { MdFilterList } from "react-icons/md";

const themes = [
  { id: 'all', name: 'All', icon: null },
  { id: 'mindfulness', name: 'Mindfulness', icon: IoLeafOutline },
  { id: 'adventure', name: 'Adventure', icon: FaMountain },
  { id: 'relaxation', name: 'Relaxation', icon: FaUmbrellaBeach },
  { id: 'culture', name: 'Culture', icon: FaCity },
];

const priceRanges = [
  { id: 'all', name: 'Any Price', min: 0, max: Infinity },
  { id: 'budget', name: 'Under $500', min: 0, max: 500 },
  { id: 'mid', name: '$500 - $1,000', min: 500, max: 1000 },
  { id: 'premium', name: '$1,000 - $5,000', min: 1000, max: 5000 },
  { id: 'luxury', name: '$5,000+', min: 5000, max: Infinity },
];

const durations = [
  { id: 'all', name: 'Any Duration', days: null },
  { id: 'short', name: '1-3 Days', days: [1, 3] },
  { id: 'week', name: '4-7 Days', days: [4, 7] },
  { id: 'long', name: '8-14 Days', days: [8, 14] },
  { id: 'extended', name: '15+ Days', days: [15, Infinity] },
];

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'newest', name: 'Newest First' },
  { id: 'popular', name: 'Most Popular' },
];

// Reusable style constants
const filterStyles = {
  pill: {
    base: 'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
    active: 'bg-white text-black',
    inactive: 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800'
  },
  button: {
    base: 'px-3 py-1.5 text-sm rounded-lg transition-all',
    active: 'bg-blue-500 text-white',
    inactive: 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white'
  },
  label: 'text-xs text-gray-400 uppercase tracking-wider',
  select: 'bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none'
};

export default function FeaturedItineraries() {
  const { data: itineraries, isLoading: itinerariesLoading, error: itinerariesError } = useItineraries();
  const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();
  const [listings, setListings] = React.useState<any[]>([]);
  
  // Filter states
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (itineraries) {
      let filteredListings = itineraries?.data.map((listing: any) =>
        favorites?.some((favorite: any) => favorite._id.$oid === listing._id.$oid)
          ? { ...listing, isFavorite: true }
          : listing
      );

      // Apply filters
      filteredListings = applyFilters(filteredListings);

      // Apply sorting
      filteredListings = applySorting(filteredListings);

      setListings(filteredListings);
    }
  }, [itineraries, favorites, selectedTheme, selectedPrice, selectedDuration, selectedSort]);

  const applyFilters = (listings: any[]) => {
    let filtered = [...listings];

    // Theme filter
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(listing => 
        listing.category?.toLowerCase() === selectedTheme.toLowerCase()
      );
    }

    // Price filter
    const priceRange = priceRanges.find(range => range.id === selectedPrice);
    if (priceRange && selectedPrice !== 'all') {
      filtered = filtered.filter(listing => {
        const price = parseFloat(listing.person_cost) || 0;
        return price >= priceRange.min && price <= priceRange.max;
      });
    }

    // Duration filter
    const duration = durations.find(d => d.id === selectedDuration);
    if (duration && selectedDuration !== 'all' && duration.days) {
      filtered = filtered.filter(listing => {
        const days = listing.length_days || 0;
        return days >= duration.days[0] && days <= duration.days[1];
      });
    }

    return filtered;
  };

  const applySorting = (listings: any[]) => {
    const sorted = [...listings];
    
    switch (selectedSort) {
      case 'price-low':
        return sorted.sort((a, b) => (parseFloat(a.person_cost) || 0) - (parseFloat(b.person_cost) || 0));
      case 'price-high':
        return sorted.sort((a, b) => (parseFloat(b.person_cost) || 0) - (parseFloat(a.person_cost) || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case 'popular':
        return sorted.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
      default:
        return sorted;
    }
  };

  const clearFilters = () => {
    setSelectedTheme('all');
    setSelectedPrice('all');
    setSelectedDuration('all');
    setSelectedSort('featured');
  };

  const activeFiltersCount = [selectedTheme, selectedPrice, selectedDuration]
    .filter(filter => filter !== 'all').length;

  return (
    <section className="w-full text-white bg-black">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 py-16">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">Itineraries for You</h2>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg border border-gray-800"
            >
              <MdFilterList className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters */}
          <div className={`${showMobileFilters ? 'block' : 'hidden sm:block'} space-y-4`}>
            {/* Theme Pills */}
            <div className="flex flex-wrap gap-2">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`${filterStyles.pill.base} ${
                    selectedTheme === theme.id 
                      ? filterStyles.pill.active 
                      : filterStyles.pill.inactive
                  }`}
                >
                  {theme.icon && <theme.icon className="w-4 h-4" />}
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>

            {/* Price, Duration, and Sort Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Price Range Selector */}
              <div className="flex flex-col gap-2">
                <label className={filterStyles.label}>Price Range</label>
                <div className="flex flex-wrap gap-1">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPrice(range.id)}
                      className={`${filterStyles.button.base} ${
                        selectedPrice === range.id 
                          ? filterStyles.button.active 
                          : filterStyles.button.inactive
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selector */}
              <div className="flex flex-col gap-2">
                <label className={filterStyles.label}>Duration</label>
                <div className="flex flex-wrap gap-1">
                  {durations.map(duration => (
                    <button
                      key={duration.id}
                      onClick={() => setSelectedDuration(duration.id)}
                      className={`${filterStyles.button.base} ${
                        selectedDuration === duration.id 
                          ? filterStyles.button.active 
                          : filterStyles.button.inactive
                      }`}
                    >
                      {duration.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Selector */}
              <div className="flex-1 max-w-xs">
                <SortDropdown
                  options={sortOptions as SortOption[]}
                  onSelect={(option: SortOption) => {
                    setSelectedSort(option.id);
                  }}
                  selectedId={selectedSort}
                  showLabel={true}
                  label="Sort By"
                  className="min-w-[200px]"
                />
              </div>
            </div>

            {/* Active Filters & Clear Button */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {listings.length} {listings.length === 1 ? 'itinerary' : 'itineraries'} found
          </p>
        </div>

        {/* Itinerary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {itinerariesLoading && (
            <>
              {[...Array(8)].map((_, index) => (
                <ItineraryCardSkeleton key={index} />
              ))}
            </>
          )}
          
          {itinerariesError && (
            <div className="col-span-full text-center py-20">
              <p className="text-red-400">Error loading itineraries</p>
              <p className="text-gray-400 text-sm mt-2">{itinerariesError.message}</p>
            </div>
          )}
          
          {!itinerariesLoading && listings.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No itineraries found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          )}
          
          {listings.length > 0 && listings?.map((listing) => (
            <ListingCard
              key={(listing._id as { $oid: string }).$oid}
              data={listing}
            />
          ))}
        </div>

        {/* Load More Section */}
        {listings.length > 0 && listings.length < (itineraries?.data?.length || 0) && (
          <div className="flex flex-col items-center mt-12 gap-4">
            <Button 
              variant="primary" 
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}