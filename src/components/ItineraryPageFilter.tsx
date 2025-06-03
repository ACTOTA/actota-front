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
            <div className='w-full'>
                <p onClick={() => setShowFilter?.(false)} className='text-left text-white text-sm flex items-center gap-2 cursor-pointer mb-2 lg:hidden'><ArrowLeftIcon className='size-4' />Filter </p>

                <div className='flex justify-between items-center w-full'>
                    <p className='text-white  font-bold'>Trip Budget</p>
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
                <div>
                    <ItineraryFilterBarGraph 
                        bars={20}
                        maxValue={15000}
                        currentValue={filters?.budget.max || 5000}
                        enabled={toggle}
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
                <div className='mt-4 flex justify-between items-center w-full'>
                    <p className='text-white  font-bold'>Destination</p>
                    <p onClick={() => {
                        const newIndex = destination.length;
                        setDestination([...destination, newIndex]);
                        if (setFilters) {
                            setFilters((prev: any) => ({
                                ...prev,
                                destinations: [...prev.destinations, '']
                            }));
                        }
                    }} className='text-[#BBD4FB] font-normal flex items-center gap-1 cursor-pointer'>Add <span className='text-2xl'> +</span></p>

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
                <div className={` flex justify-between items-center w-full gap-3 ${!advanceFilter ? 'flex-col' : 'flex-row'}`}>
                    <div className=' w-full mt-6'>
                        <p className='text-white  font-bold mb-2'>Dates</p>

                        <Dropdown isOpend={isCalendarOpen} setIsOpend={setIsCalendarOpen} className='w-full' onSelect={() => { }} options={[]} />
                        {isCalendarOpen && <div className='mt-2 '> <ItineraryPageDateMenu /></div>}
                    </div>
                    <div className=' w-full mt-4'>
                        <p className='text-white  font-bold mb-2'>Guests</p>
                        <Dropdown isOpend={isGuestOpen} setIsOpend={setIsGuestOpen} className='w-full' onSelect={() => { }} options={[]} />

                        {isGuestOpen && <div className='mt-2'> <GuestMenu /></div>}
                    </div>
                </div>
                <div className='mt-6  w-full gap-3'>
                    <p className='text-white  font-bold mb-2'>Preferred Activities</p>
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
                <div className='mt-6  w-full gap-3'>
                    <p className='text-white  font-bold mb-2'>Lodging Type(s)</p>
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
                <div className='mt-6  w-full gap-3'>
                    <p className='text-white  font-bold mb-2'>Transportation Type(s)</p>
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
                {advanceFilter ?
                    <div className='flex justify-between items-center w-full gap-2'>
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
                            setAdvanceFilter(false);
                        }} variant='outline' className='mt-6 w-full'>Reset</Button>

                        <Button variant='primary' className='mt-6 w-full'>Apply</Button>


                    </div> :
                    <Button onClick={() => setAdvanceFilter(true)} variant='outline' className='mt-6 w-full !bg-black flex items-center justify-center gap-2'>Advance Filter <GoArrowRight className='size-6' /></Button>
                }
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageFilter
