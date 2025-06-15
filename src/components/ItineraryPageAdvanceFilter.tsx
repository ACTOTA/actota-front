'use client'
import React, { useState } from 'react'
import Toggle from './Toggle/Toggle'
import Button from './figma/Button'
import GlassPanel from './figma/GlassPanel'
import Dropdown from './figma/Dropdown'
import { BiLeftArrow } from 'react-icons/bi'
import { GoArrowRight } from 'react-icons/go'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { MdOutlineDirectionsCarFilled } from 'react-icons/md'
import Counter from './Counter'

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
import ItineraryPageDateMenu from './ItineraryPageDateMenu'

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

interface ItineraryPageAdvanceFilterProps {
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

const ItineraryPageAdvanceFilter = ({ setShowFilter, advanceFilter, setAdvanceFilter, filters, setFilters }: ItineraryPageAdvanceFilterProps) => {
    const [selectedView, setSelectedView] = useState<'activities' | 'lodging' | 'transport'>('activities');
    const [count, setCount] = useState(0);
    const [rooms, setRooms] = useState(0);
    const [beds, setBeds] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [activityType, setActivityType] = useState<"daily" | "total">("daily");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    return (
        <GlassPanel className=' !rounded-3xl !p-[24px] bg-gradient-to-br from-[#6B6B6B]/30 to-[black] '>
            <div className='w-full space-y-6'>
                {/* Header with Back Button */}
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <button 
                            onClick={() => setAdvanceFilter(false)}
                            className='flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer'
                        >
                            <BiLeftArrow className='size-5' />
                            <span className='text-sm font-medium'>Back to Filters</span>
                        </button>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                            <h3 className='text-white text-lg font-bold'>Advanced Filters</h3>
                            <span className='text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full'>2 of 2</span>
                        </div>
                        <p onClick={() => setShowFilter?.(false)} className='text-white text-sm flex items-center gap-2 cursor-pointer lg:hidden'><ArrowLeftIcon className='size-4' />Close</p>
                    </div>
                </div>

                {/* Filter Category Tabs */}
                <div className='space-y-4'>
                    <div className='flex justify-center items-center gap-2'>
                        {(['activities', 'lodging', 'transport'] as const).map((view) => (
                            <button
                                key={view}
                                onClick={() => setSelectedView(view)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedView === view 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Activities View */}
                    {selectedView === 'activities' && (
                        <div className='space-y-4'>
                            <div className='flex justify-center items-center gap-2'>
                                {(['daily', 'total'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActivityType(type)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                            activityType === type 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {type === 'daily' ? 'Per Day' : 'Total Trip'}
                                    </button>
                                ))}
                            </div>
                            
                            {activityType === "daily" && (
                                <div className='space-y-3'>
                                    <p className='text-white font-bold text-center'>Activities per Day</p>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"].map((item, i) => (
                                            <div key={i} className='flex items-center justify-between bg-gray-800/50 rounded-lg p-2'>
                                                <p className='text-white text-sm'>{item}</p>
                                                <Counter count={count} setCount={setCount} max={5} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className='space-y-3'>
                                <p className='text-white font-bold'>Activity Preferences</p>
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
                        </div>
                    )}

                    {/* Lodging View */}
                    {selectedView === 'lodging' && (
                        <div className='space-y-4'>
                            <div className='space-y-3'>
                                <p className='text-white font-bold text-center'>Accommodation Details</p>
                                {["No of Room(s)", "No of Bed(s)", "No of Bathroom(s)"].map((item, i) => (
                                    <div key={i} className='flex items-center justify-between bg-gray-800/50 rounded-lg p-3'>
                                        <p className='text-white text-sm font-medium'>{item}</p>
                                        <Counter 
                                            count={item === "No of Room(s)" ? rooms : item === "No of Bed(s)" ? beds : bathrooms} 
                                            setCount={item === "No of Room(s)" ? setRooms : item === "No of Bed(s)" ? setBeds : setBathrooms} 
                                            max={10} 
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className='space-y-3'>
                                <p className='text-white font-bold'>Lodging Preferences</p>
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
                        </div>
                    )}

                    {/* Transportation View */}
                    {selectedView === 'transport' && (
                        <div className='space-y-4'>
                            <div className='space-y-3'>
                                <p className='text-white font-bold'>Transportation Preferences</p>
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

                            <div className='flex items-center justify-between bg-gray-800/50 rounded-lg p-3'>
                                <div className='flex items-center gap-2'>
                                    <MdOutlineDirectionsCarFilled className='text-blue-400 size-5' />
                                    <p className='text-white text-sm font-medium'>Vehicle Capacity</p>
                                </div>
                                <Counter count={count} setCount={setCount} max={15} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Advanced Date & Guest Controls */}
                <div className='space-y-4'>
                    <div className='border-t border-gray-700/50 pt-4'>
                        <div className='space-y-4'>
                            <div className='w-full'>
                                <p className='text-white font-bold mb-2'>Detailed Date Selection</p>
                                <Dropdown isOpend={isCalendarOpen} setIsOpend={setIsCalendarOpen} className='w-full' onSelect={() => { }} options={[]} />
                                {isCalendarOpen && <div className='mt-2'> <ItineraryPageDateMenu /></div>}
                            </div>
                            <div className='w-full'>
                                <p className='text-white font-bold mb-2'>Guest Details</p>
                                <Dropdown isOpend={isGuestOpen} setIsOpend={setIsGuestOpen} className='w-full' onSelect={() => { }} options={[]} />
                                {isGuestOpen && <div className='mt-2'> <GuestMenu /></div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-2'>
                    <Button onClick={() => {
                        if (setFilters) {
                            setFilters((prev: any) => ({
                                ...prev,
                                activities: [],
                                lodging: [],
                                transportation: [],
                                guests: { adults: 1, children: 0 },
                                dateRange: null
                            }));
                        }
                        setCount(0);
                        setRooms(0);
                        setBeds(0);
                        setBathrooms(0);
                    }} variant='outline' className='flex-1'>Reset Advanced</Button>

                    <Button 
                        onClick={() => setAdvanceFilter(false)}
                        variant='primary' 
                        className='flex-1'
                    >
                        Apply & Back
                    </Button>
                </div>
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageAdvanceFilter
