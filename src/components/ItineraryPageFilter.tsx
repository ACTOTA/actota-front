'use client'
import React, { useState } from 'react'
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
        budget: { max: number; enabled: boolean };
        destinations: string[];
        activities: string[];
        lodging: string[];
        transportation: string[];
        guests: { adults: number; children: number };
        dateRange: any;
    };
    setFilters?: (filters: any) => void;
}

const ItineraryPageFilter = ({ setShowFilter, advanceFilter, setAdvanceFilter, filters, setFilters }: ItineraryPageFilterProps) => {
    const [toggle, setToggle] = useState(filters?.budget.enabled || false);



    const activities = [
        { id: 'atving', label: 'ATVing', icon: ATVing },
        { id: 'backpacking', label: 'Backpacking', icon: Backpacking },
        { id: 'camping', label: 'Camping', icon: Camping },
        { id: 'campfire', label: 'Campfire', icon: Campfire },
        { id: 'caveExploring', label: 'Cave Exploring', icon: CaveExploring },
        { id: 'fishing', label: 'Fishing', icon: Fishing },
        { id: 'goldMineTours', label: 'Gold Mine Tours', icon: GoldMineTours },
        { id: 'hiking', label: 'Hiking', icon: Hiking },
        { id: 'hotSprings', label: 'Hot Springs', icon: HotSprings },
        { id: 'horsebackRiding', label: 'Horseback Riding', icon: HorsebackRiding },
        { id: 'mountainBiking', label: 'Mountain Biking', icon: MountainBiking },
        { id: 'paddleBoarding', label: 'Paddle Boarding', icon: PaddleBoarding },
        { id: 'privateChef', label: 'Private Chef', icon: PrivateChef },
        { id: 'ropesCourse', label: 'Ropes Course', icon: RopesCourse },
        { id: 'sightSeeing', label: 'Sight Seeing', icon: SightSeeing },
        { id: 'trainRiding', label: 'Train Riding', icon: TrainRiding },
        { id: 'whiteWaterRafting', label: 'White Water Rafting', icon: WhiteWaterRafting },
        { id: 'ziplining', label: 'Ziplining', icon: Ziplining },
        { id: 'skiing', label: 'Skiing', icon: Skiing, unavailable: true },
        { id: 'snowmobiling', label: 'Snowmobiling', icon: Snowmobiling, unavailable: true },
        { id: 'snowshoeing', label: 'Snowshoeing', icon: Snowshoeing, unavailable: true },
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
                                    <ItineraryFilterPieChart />
                                </div>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-white text-sm font-normal flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#0252D0]' /> Activities
                                        </p>
                                        <p className='text-white text-sm font-bold'>
                                            ${Math.round((filters?.budget.max || 5000) * 0.4).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-white text-sm font-normal flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#8B5CF6]' /> Lodging
                                        </p>
                                        <p className='text-white text-sm font-bold'>
                                            ${Math.round((filters?.budget.max || 5000) * 0.35).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-white text-sm font-normal flex items-center gap-2'>
                                            <span className='h-2 w-2 rounded-full bg-[#10B981]' /> Transportation
                                        </p>
                                        <p className='text-white text-sm font-bold'>
                                            ${Math.round((filters?.budget.max || 5000) * 0.25).toLocaleString()}
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

                {/* Activities Section */}
                <div className='space-y-3'>
                    <p className='text-white font-bold'>Activities</p>
                    <ActivityDropdown
                        onSelect={(selectedActivities) => {
                            if (setFilters) {
                                const activitiesArray = Array.isArray(selectedActivities) 
                                    ? selectedActivities 
                                    : [selectedActivities];
                                setFilters((prev: any) => ({
                                    ...prev,
                                    activities: activitiesArray
                                }));
                            }
                        }}
                        activities={activities}
                        title="Activities"
                        showSaveButton={false}
                    />

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
                
                {/* Advanced Filters Button */}
                <div className='border-t border-gray-700/50 pt-4 mt-6'>
                    <Button 
                        onClick={() => setAdvanceFilter(true)} 
                        variant='outline' 
                        className='w-full !bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border-blue-500/50 hover:border-blue-400 flex items-center justify-center gap-2 transition-all duration-200 group'
                    >
                        <span className='text-blue-400'>✨</span>
                        <span>Advanced Filters</span>
                        <GoArrowRight className='size-4 text-blue-400 group-hover:translate-x-1 transition-transform' />
                    </Button>
                    <p className='text-xs text-gray-400 text-center mt-2'>More filter options & detailed controls</p>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-2 mt-4'>
                    <Button onClick={() => {
                        if (setFilters) {
                            setFilters({
                                budget: { max: 5000, enabled: false },
                                destinations: [''],
                                activities: [],
                                lodging: [],
                                transportation: [],
                                guests: { adults: 1, children: 0 },
                                dateRange: null
                            });
                        }
                        setToggle(false);
                        setDestination([0]);
                    }} variant='outline' className='flex-1'>Clear All</Button>

                    <Button variant='primary' className='flex-1'>Apply Filters</Button>
                </div>
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageFilter
