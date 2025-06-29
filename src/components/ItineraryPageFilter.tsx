'use client'
import React, { useState, useEffect } from 'react'
import GlassPanel from './figma/GlassPanel'
import Toggle from './Toggle/Toggle'
import Input from './figma/Input'
import { GrLocation } from 'react-icons/gr'
import { RxCross2, RxCrosshair2 } from 'react-icons/rx'
import Dropdown from './figma/Dropdown'
import Button from './figma/Button'
import { BiLeftArrow } from 'react-icons/bi'
import { GoArrowRight } from 'react-icons/go'
import ItineraryFilterBarGraph from './ItineraryFilterBarGraph'
import ItineraryFilterPieChart from './ItineraryFilterPieChart'
import { ACTIVITY_CATEGORIES } from '@/src/utils/activityTagMapping'



// activity icons
import ATVing from "@/public/activity-icons/atVing.svg";
import Backpacking from "@/public/activity-icons/backpacking.svg";
import Camping from "@/public/activity-icons/camping.svg";
import Campfire from "@/public/activity-icons/campfire.svg";
import CaveExploring from "@/public/activity-icons/caveExploring.svg";
import Fishing from "@/public/activity-icons/fishing.svg";
import GoldMineTours from "@/public/activity-icons/goldMineTours.svg";
import Hiking from "@/public/activity-icons/hiking.svg";
import HotSprings from "@/public/activity-icons/hotSprings.svg";
import HorsebackRiding from "@/public/activity-icons/horsebackRiding.svg";
import MountainBiking from "@/public/activity-icons/mountainBiking.svg";
import PaddleBoarding from "@/public/activity-icons/paddleBoarding.svg";
import PrivateChef from "@/public/activity-icons/privateChef.svg";
import RopesCourse from "@/public/activity-icons/ropesCourse.svg";
import SightSeeing from "@/public/activity-icons/sightSeeing.svg";
import TrainRiding from "@/public/activity-icons/trainRiding.svg";
import WhiteWaterRafting from "@/public/activity-icons/whiteWaterRafting.svg";
import Ziplining from "@/public/activity-icons/ziplining.svg";
import Skiing from "@/public/activity-icons/skiing.svg";
import Snowmobiling from "@/public/activity-icons/snowmobiling.svg";
import Snowshoeing from "@/public/activity-icons/snowshoeing.svg";

// lodging icons
import Airbnb from "@/public/lodging-icons/airbnb.svg";
import Cabin from "@/public/lodging-icons/cabin.svg";
import Hotel from "@/public/lodging-icons/hotel.svg";
import Glamping from "@/public/lodging-icons/glamping.svg";
import RV from "@/public/lodging-icons/rv.svg";
import Camp from "@/public/lodging-icons/camp.svg";

// transportation icons
import Sedan from "@/public/transportation-icons/sedan.svg";
import SUV from "@/public/transportation-icons/suv.svg";
import Luxury from "@/public/transportation-icons/luxury.svg";
import PartyBus from "@/public/transportation-icons/partyBus.svg";
import Van from "@/public/transportation-icons/van.svg";
import ActivityDropdown from './navbar/ActivityDropdown'
import DateMenu from './navbar/DateMenu'
import GuestMenu from './navbar/GuestMenu'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import ItineraryPageDateMenu from './ItineraryPageDateMenu'



interface ItineraryPageFilterProps {
    setShowFilter?: (value: boolean) => void;
    advanceFilter: boolean;
    setAdvanceFilter: (value: boolean) => void;
    filters?: {
        budget: { 
            max: number; 
            enabled: boolean;
            allocations: {
                activities: number;
                lodging: number;
                transportation: number;
            };
        };
        destinations: string[];
        activityTypes: string[];
        themes: string[];
        groupSize: string;
        tripDuration: string;
        lodging: string[];
        transportation: string[];
        guests: { adults: number; children: number };
        dateRange: any;
    };
    setFilters?: (filters: any) => void;
    onApplyFilters?: () => void;
}

const ItineraryPageFilter = ({ setShowFilter, advanceFilter, setAdvanceFilter, filters, setFilters, onApplyFilters }: ItineraryPageFilterProps) => {
    const [toggle, setToggle] = useState(filters?.budget.enabled || false);
    const [availableActivities, setAvailableActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(false);

    // Fetch available activities from Vertex AI search
    useEffect(() => {
        const fetchAvailableActivities = async () => {
            setLoadingActivities(true);
            try {
                const response = await fetch('/api/activities/search', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAvailableActivities(data.activities || []);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
                // Fallback to static list if API fails
                setAvailableActivities([]);
            } finally {
                setLoadingActivities(false);
            }
        };

        fetchAvailableActivities();
    }, []);

    const themes = [
        { id: 'adventure', label: 'Adventure', description: 'Thrill-seeking experiences' },
        { id: 'relaxation', label: 'Relaxation', description: 'Peaceful and restorative' },
        { id: 'culture', label: 'Culture & History', description: 'Local heritage and traditions' },
        { id: 'nature', label: 'Nature & Wildlife', description: 'Natural beauty and animals' },
        { id: 'culinary', label: 'Culinary', description: 'Food and dining experiences' },
        { id: 'winter', label: 'Winter Sports', description: 'Snow and ice activities' },
    ];

    const groupSizes = [
        { id: 'solo', label: 'Solo Travel', description: '1 person' },
        { id: 'couple', label: 'Couples', description: '2 people' },
        { id: 'family', label: 'Family', description: '3-6 people' },
        { id: 'group', label: 'Large Group', description: '7+ people' },
    ];

    const tripDurations = [
        { id: 'weekend', label: 'Weekend', description: '2-3 days' },
        { id: 'week', label: 'Week', description: '4-7 days' },
        { id: 'extended', label: 'Extended', description: '8+ days' },
    ];

    const lodging = [
        { id: 'airbnb', label: 'Airbnb', icon: Airbnb },
        { id: 'cabin', label: 'Cabin', icon: Cabin },
        { id: 'hotel', label: 'Hotel', icon: Hotel },
        { id: 'glamping', label: 'Glamping', icon: Glamping },
        { id: 'rv', label: 'RV', icon: RV },
        { id: 'camp', label: 'Camp', icon: Camp },

    ];


    const transportation = [
        { id: 'sedan', label: 'Sedan', icon: Sedan },
        { id: 'suv', label: 'SUV', icon: SUV },
        { id: 'luxury', label: 'Luxury', icon: Luxury },
        { id: 'partyBus', label: 'Party Bus', icon: PartyBus },
        { id: 'van', label: '15 Passenger Van', icon: Van },

    ];

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    const [destination, setDestination] = useState(filters?.destinations?.length ? filters.destinations.map((_, i) => i) : [0]);
    return (
        <GlassPanel className=' !rounded-3xl !p-[24px] bg-gradient-to-br from-[#6B6B6B]/30 to-[black] '>
            <div className='w-full space-y-6'>
                {/* Header */}
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <h3 className='text-white text-lg font-bold'>Filters</h3>
                    </div>
                    <p onClick={() => setShowFilter?.(false)} className='text-white text-sm flex items-center gap-2 cursor-pointer lg:hidden'><ArrowLeftIcon className='size-4' />Close</p>
                </div>

                {/* Advanced Budget Section */}
                <div className='space-y-3'>
                    <div className='flex justify-between items-center w-full'>
                        <p className='text-white font-bold'>Budget</p>
                        <Toggle enabled={toggle} setEnabled={(enabled) => {
                            setToggle(enabled);
                            if (setFilters) {
                                setFilters((prev: any) => ({
                                    ...prev,
                                    budget: { ...prev.budget, enabled }
                                }));
                            }
                        }} />
                    </div>
                    
                    {toggle && (
                        <div className='space-y-4'>
                            <p className='text-white text-xl font-bold'>${filters?.budget.max || 1000} <span className='text-[16px] font-normal'>Max</span></p>
                            
                            {/* Full Budget Controls */}
                            <div className='flex items-center w-full gap-5'>
                                <div className='flex-shrink-0'>
                                    <ItineraryFilterPieChart allocations={filters?.budget.allocations} />
                                </div>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-white text-sm font-normal flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#EF4444]' /> Activities
                                        </p>
                                        <p className='text-white text-sm font-bold'>
                                            ${Math.round((filters?.budget.max || 5000) * (filters?.budget.allocations?.activities || 40) / 100).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-white text-sm font-normal flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#3B82F6]' /> Lodging
                                        </p>
                                        <p className='text-white text-sm font-bold'>
                                            ${Math.round((filters?.budget.max || 5000) * (filters?.budget.allocations?.lodging || 35) / 100).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-white text-sm font-normal flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#FFC107]' /> Transportation
                                        </p>
                                        <p className='text-white text-sm font-bold'>
                                            ${Math.round((filters?.budget.max || 5000) * (filters?.budget.allocations?.transportation || 25) / 100).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Budget Slider */}
                            <div>
                                <ItineraryFilterBarGraph 
                                    bars={20}
                                    maxValue={15000}
                                    currentValue={filters?.budget.max || 5000}
                                    enabled={true}
                                    onValueChange={(value) => {
                                        if (setFilters) {
                                            setFilters((prev: any) => ({
                                                ...prev,
                                                budget: { ...prev.budget, max: value }
                                            }));
                                        }
                                    }}
                                />
                            </div>

                            {/* Budget Allocation Sliders */}
                            <div className='space-y-4 pt-4 border-t border-gray-700/50'>
                                <p className='text-white font-semibold text-sm'>Adjust Budget Allocation</p>
                                
                                {/* Activities Allocation */}
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-white text-sm flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#EF4444]' /> Activities
                                        </p>
                                        <p className='text-white text-sm font-medium'>{filters?.budget.allocations?.activities || 40}%</p>
                                    </div>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={filters?.budget.allocations?.activities || 40}
                                        onChange={(e) => {
                                            const newValue = parseInt(e.target.value);
                                            if (setFilters) {
                                                setFilters((prev: any) => {
                                                    const currentAllocations = prev.budget.allocations;
                                                    const otherTotal = currentAllocations.lodging + currentAllocations.transportation;
                                                    
                                                    // Ensure total doesn't exceed 100%
                                                    if (newValue + otherTotal > 100) {
                                                        const scale = (100 - newValue) / otherTotal;
                                                        return {
                                                            ...prev,
                                                            budget: {
                                                                ...prev.budget,
                                                                allocations: {
                                                                    activities: newValue,
                                                                    lodging: Math.round(currentAllocations.lodging * scale),
                                                                    transportation: Math.round(currentAllocations.transportation * scale)
                                                                }
                                                            }
                                                        };
                                                    }
                                                    
                                                    return {
                                                        ...prev,
                                                        budget: {
                                                            ...prev.budget,
                                                            allocations: {
                                                                ...currentAllocations,
                                                                activities: newValue
                                                            }
                                                        }
                                                    };
                                                });
                                            }
                                        }}
                                        className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-activities'
                                    />
                                </div>

                                {/* Lodging Allocation */}
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-white text-sm flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#3B82F6]' /> Lodging
                                        </p>
                                        <p className='text-white text-sm font-medium'>{filters?.budget.allocations?.lodging || 35}%</p>
                                    </div>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={filters?.budget.allocations?.lodging || 35}
                                        onChange={(e) => {
                                            const newValue = parseInt(e.target.value);
                                            if (setFilters) {
                                                setFilters((prev: any) => {
                                                    const currentAllocations = prev.budget.allocations;
                                                    const otherTotal = currentAllocations.activities + currentAllocations.transportation;
                                                    
                                                    // Ensure total doesn't exceed 100%
                                                    if (newValue + otherTotal > 100) {
                                                        const scale = (100 - newValue) / otherTotal;
                                                        return {
                                                            ...prev,
                                                            budget: {
                                                                ...prev.budget,
                                                                allocations: {
                                                                    activities: Math.round(currentAllocations.activities * scale),
                                                                    lodging: newValue,
                                                                    transportation: Math.round(currentAllocations.transportation * scale)
                                                                }
                                                            }
                                                        };
                                                    }
                                                    
                                                    return {
                                                        ...prev,
                                                        budget: {
                                                            ...prev.budget,
                                                            allocations: {
                                                                ...currentAllocations,
                                                                lodging: newValue
                                                            }
                                                        }
                                                    };
                                                });
                                            }
                                        }}
                                        className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-lodging'
                                    />
                                </div>

                                {/* Transportation Allocation */}
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-white text-sm flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#FFC107]' /> Transportation
                                        </p>
                                        <p className='text-white text-sm font-medium'>{filters?.budget.allocations?.transportation || 25}%</p>
                                    </div>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={filters?.budget.allocations?.transportation || 25}
                                        onChange={(e) => {
                                            const newValue = parseInt(e.target.value);
                                            if (setFilters) {
                                                setFilters((prev: any) => {
                                                    const currentAllocations = prev.budget.allocations;
                                                    const otherTotal = currentAllocations.activities + currentAllocations.lodging;
                                                    
                                                    // Ensure total doesn't exceed 100%
                                                    if (newValue + otherTotal > 100) {
                                                        const scale = (100 - newValue) / otherTotal;
                                                        return {
                                                            ...prev,
                                                            budget: {
                                                                ...prev.budget,
                                                                allocations: {
                                                                    activities: Math.round(currentAllocations.activities * scale),
                                                                    lodging: Math.round(currentAllocations.lodging * scale),
                                                                    transportation: newValue
                                                                }
                                                            }
                                                        };
                                                    }
                                                    
                                                    return {
                                                        ...prev,
                                                        budget: {
                                                            ...prev.budget,
                                                            allocations: {
                                                                ...currentAllocations,
                                                                transportation: newValue
                                                            }
                                                        }
                                                    };
                                                });
                                            }
                                        }}
                                        className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-transportation'
                                    />
                                </div>

                                {/* Total Percentage Check */}
                                <div className='text-xs text-gray-400 text-center'>
                                    Total: {(filters?.budget.allocations?.activities || 40) + (filters?.budget.allocations?.lodging || 35) + (filters?.budget.allocations?.transportation || 25)}%
                                </div>
                            </div>

                            {/* Total Trip Cost */}
                            <div className='bg-gray-800/50 rounded-lg p-3'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className='text-white text-sm font-medium'>Total Trip Cost</p>
                                        <p className='text-gray-300 text-xs'>
                                            {filters?.guests?.adults || 1} adults, {filters?.guests?.children || 0} children
                                        </p>
                                    </div>
                                    <p className='text-green-400 text-lg font-bold'>
                                        ${((filters?.budget.max || 5000) * ((filters?.guests?.adults || 1) + (filters?.guests?.children || 0))).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Destinations Section */}
                <div className='space-y-3'>
                    <div className='flex justify-between items-center w-full'>
                        <p className='text-white font-bold'>Destinations</p>
                        <p onClick={() => {
                            const newIndex = destination.length;
                            setDestination([...destination, newIndex]);
                            if (setFilters) {
                                setFilters((prev: any) => ({
                                    ...prev,
                                    destinations: [...prev.destinations, '']
                                }));
                            }
                        }} className='text-[#BBD4FB] font-normal flex items-center gap-1 cursor-pointer text-sm'>Add <span className='text-lg'> +</span></p>
                    </div>
                {destination.map((item, i) => {
                    return (
                        <div key={i} className='mt-2 flex justify-between items-center gap-2 w-full'>
                            <div className='w-full'>
                                <Input 
                                    icon={<GrLocation aria-hidden="true" className="size-6 text-white" />} 
                                    className='w-full' 
                                    placeholder='Search Destination'
                                    value={filters?.destinations?.[i] || ''}
                                    onChange={(e) => {
                                        if (setFilters) {
                                            const newDestinations = [...(filters?.destinations || [])];
                                            newDestinations[i] = (e.target as HTMLInputElement).value;
                                            setFilters((prev: any) => ({
                                                ...prev,
                                                destinations: newDestinations
                                            }));
                                        }
                                    }}
                                />
                            </div>
                            <RxCross2 onClick={() => {
                                setDestination(destination.filter((_, index) => index !== i));
                                if (setFilters) {
                                    setFilters((prev: any) => ({
                                        ...prev,
                                        destinations: prev.destinations.filter((_: any, index: number) => index !== i)
                                    }));
                                }
                            }} className='text-white size-6 cursor-pointer' />

                        </div>
                    )
                })}
                </div>

                {/* Dates & Guests Section */}
                <div className='space-y-4'>
                    <div className='w-full'>
                        <p className='text-white font-bold mb-2'>Dates</p>
                        <Dropdown isOpend={isCalendarOpen} setIsOpend={setIsCalendarOpen} className='w-full' onSelect={() => { }} options={[]} />
                        {isCalendarOpen && <div className='mt-2'> <ItineraryPageDateMenu /></div>}
                    </div>
                    <div className='w-full'>
                        <p className='text-white font-bold mb-2'>Guests</p>
                        <Dropdown isOpend={isGuestOpen} setIsOpend={setIsGuestOpen} className='w-full' onSelect={() => { }} options={[]} />
                        {isGuestOpen && <div className='mt-2'> <GuestMenu /></div>}
                    </div>
                </div>

                {/* Travel Themes Section */}
                <div className='space-y-3'>
                    <p className='text-white font-bold'>Travel Themes</p>
                    <div className='grid grid-cols-2 gap-2'>
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    if (setFilters) {
                                        const currentThemes = filters?.themes || [];
                                        const newThemes = currentThemes.includes(theme.id)
                                            ? currentThemes.filter(t => t !== theme.id)
                                            : [...currentThemes, theme.id];
                                        setFilters((prev: any) => ({
                                            ...prev,
                                            themes: newThemes
                                        }));
                                    }
                                }}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                    filters?.themes?.includes(theme.id)
                                        ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                                        : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <div className='text-sm font-medium'>{theme.label}</div>
                                <div className='text-xs opacity-70'>{theme.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Activity Types Section */}
                <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                        <p className='text-white font-bold'>Activity Types</p>
                        {loadingActivities && (
                            <div className='text-xs text-gray-400'>Loading...</div>
                        )}
                    </div>
                    <div className='grid grid-cols-1 gap-2'>
                        {ACTIVITY_CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    if (setFilters) {
                                        const currentTypes = filters?.activityTypes || [];
                                        const newTypes = currentTypes.includes(category.id)
                                            ? currentTypes.filter(t => t !== category.id)
                                            : [...currentTypes, category.id];
                                        setFilters((prev: any) => ({
                                            ...prev,
                                            activityTypes: newTypes
                                        }));
                                    }
                                }}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                    filters?.activityTypes?.includes(category.id)
                                        ? 'bg-blue-400/20 border-blue-400/50 text-blue-400'
                                        : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <div className='text-sm font-medium'>{category.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Group Size Section */}
                <div className='space-y-3'>
                    <p className='text-white font-bold'>Group Size</p>
                    <div className='grid grid-cols-1 gap-2'>
                        {groupSizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => {
                                    if (setFilters) {
                                        setFilters((prev: any) => ({
                                            ...prev,
                                            groupSize: prev.groupSize === size.id ? '' : size.id
                                        }));
                                    }
                                }}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                    filters?.groupSize === size.id
                                        ? 'bg-red-400/20 border-red-400/50 text-red-400'
                                        : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <div className='text-sm font-medium'>{size.label}</div>
                                <div className='text-xs opacity-70'>{size.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trip Duration Section */}
                <div className='space-y-3'>
                    <p className='text-white font-bold'>Trip Duration</p>
                    <div className='grid grid-cols-3 gap-2'>
                        {tripDurations.map((duration) => (
                            <button
                                key={duration.id}
                                onClick={() => {
                                    if (setFilters) {
                                        setFilters((prev: any) => ({
                                            ...prev,
                                            tripDuration: prev.tripDuration === duration.id ? '' : duration.id
                                        }));
                                    }
                                }}
                                className={`p-3 rounded-lg border text-center transition-all ${
                                    filters?.tripDuration === duration.id
                                        ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                                        : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <div className='text-sm font-medium'>{duration.label}</div>
                                <div className='text-xs opacity-70'>{duration.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lodging Section */}
                <div className='space-y-3'>
                    <p className='text-white font-bold'>Lodging</p>
                    <ActivityDropdown
                        onSelect={(selectedLodging) => {
                            if (setFilters) {
                                const lodgingArray = Array.isArray(selectedLodging) 
                                    ? selectedLodging 
                                    : [selectedLodging];
                                setFilters((prev: any) => ({
                                    ...prev,
                                    lodging: lodgingArray
                                }));
                            }
                        }}
                        activities={lodging}
                        title="Lodging"
                        showSaveButton={false}
                    />
                </div>

                {/* Transportation Section */}
                <div className='space-y-3'>
                    <p className='text-white font-bold'>Transportation</p>
                    <ActivityDropdown
                        onSelect={(selectedTransportation) => {
                            if (setFilters) {
                                const transportationArray = Array.isArray(selectedTransportation) 
                                    ? selectedTransportation 
                                    : [selectedTransportation];
                                setFilters((prev: any) => ({
                                    ...prev,
                                    transportation: transportationArray
                                }));
                            }
                        }}
                        activities={transportation}
                        title="Transportation"
                        showSaveButton={false}
                    />
                </div>
                

                {/* Action Buttons */}
                <div className='flex gap-2 mt-4'>
                    <Button onClick={() => {
                        if (setFilters) {
                            setFilters({
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
                                activityTypes: [],
                                themes: [],
                                groupSize: '',
                                tripDuration: '',
                                lodging: [],
                                transportation: [],
                                guests: { adults: 1, children: 0 },
                                dateRange: null
                            });
                        }
                        setToggle(false);
                        setDestination([0]);
                    }} variant='outline' className='flex-1'>Clear All</Button>

                    <Button 
                        variant='primary' 
                        className='flex-1'
                        onClick={() => {
                            onApplyFilters?.();
                            setShowFilter?.(false);
                        }}
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageFilter
