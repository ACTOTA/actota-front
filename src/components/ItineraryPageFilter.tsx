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
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import ItineraryFilterBarGraph from './ItineraryFilterBarGraph'
import ItineraryFilterPieChart from './ItineraryFilterPieChart'
import Counter from './Counter'
import { MdOutlineDirectionsCarFilled } from 'react-icons/md'



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
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedView, setSelectedView] = useState<'activities' | 'lodging' | 'transport'>('activities');
    const [sliderValue, setSliderValue] = useState(50);
    const [rooms, setRooms] = useState(0);
    const [beds, setBeds] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [activityType, setActivityType] = useState<"daily" | "total">("daily");
    const [count, setCount] = useState(0);
    
    // Category budget states
    const [categoryBudgets, setCategoryBudgets] = useState({
        activities: 700,
        lodging: 700,
        transport: 700
    });



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
    
    const handleSliderChange = (e: any) => {
        setSliderValue(e.target.value);
    };
    
    // Calculate total budget and percentages
    const totalBudget = filters?.budget.max || 5000;
    const totalCategoryBudget = categoryBudgets.activities + categoryBudgets.lodging + categoryBudgets.transport;
    
    const percentages = {
        activities: totalCategoryBudget > 0 ? Math.round((categoryBudgets.activities / totalCategoryBudget) * 100) : 33,
        lodging: totalCategoryBudget > 0 ? Math.round((categoryBudgets.lodging / totalCategoryBudget) * 100) : 33,
        transport: totalCategoryBudget > 0 ? Math.round((categoryBudgets.transport / totalCategoryBudget) * 100) : 34
    };
    
    const updateCategoryBudget = (category: 'activities' | 'lodging' | 'transport', value: number) => {
        setCategoryBudgets(prev => ({
            ...prev,
            [category]: value
        }));
    };

    // Sync category budgets when total budget changes
    useEffect(() => {
        const currentTotal = categoryBudgets.activities + categoryBudgets.lodging + categoryBudgets.transport;
        if (currentTotal !== totalBudget && totalBudget > 0) {
            // Proportionally adjust category budgets to match total budget
            const ratio = totalBudget / currentTotal;
            setCategoryBudgets(prev => ({
                activities: Math.round(prev.activities * ratio),
                lodging: Math.round(prev.lodging * ratio),
                transport: Math.round(prev.transport * ratio)
            }));
        }
    }, [totalBudget]);
    return (
        <GlassPanel className=' !rounded-3xl !p-[24px] bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>
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

                {/* Budget Breakdown Cards - Show when budget is enabled */}
                {toggle && (
                    <div className='mt-6'>
                        {/* Category Tab Buttons */}
                        <div className='flex gap-2 mb-6'>
                            <button 
                                onClick={() => setSelectedView('activities')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedView === 'activities' 
                                        ? 'bg-white text-black' 
                                        : 'border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'
                                }`}
                            >
                                Activities
                            </button>
                            <button 
                                onClick={() => setSelectedView('lodging')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedView === 'lodging' 
                                        ? 'bg-white text-black' 
                                        : 'border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'
                                }`}
                            >
                                Lodging
                            </button>
                            <button 
                                onClick={() => setSelectedView('transport')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedView === 'transport' 
                                        ? 'bg-white text-black' 
                                        : 'border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'
                                }`}
                            >
                                Transportation
                            </button>
                        </div>

                        {/* Single Card Container */}
                        <div className='bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-700/30'>
                            {/* Activity Filter Content */}
                            {selectedView === 'activities' && (
                                <div>
                                    <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>Activity</h3>
                                    <p className='text-gray-400 text-sm'>Filter</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-gray-400 text-sm'>Per Person</p>
                                    <Toggle enabled={true} setEnabled={() => {}} />
                                </div>
                            </div>
                            
                            <div className='mb-4'>
                                <p className='text-white text-xl font-bold'>${categoryBudgets.activities} <span className='text-gray-400 text-sm font-normal'>Max</span></p>
                            </div>

                            {/* Pie Chart */}
                            <div className='flex items-center gap-4 mb-4'>
                                <ItineraryFilterPieChart data={[
                                    { name: 'Activities', value: 40 },
                                    { name: 'Lodging', value: 40 },
                                    { name: 'Transportation', value: 20 },
                                ]} />
                                <div className='flex flex-col gap-1 text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#0252D0]'></span>
                                        <span className='text-white'>Activities</span>
                                        <span className='text-white font-bold ml-auto'>40%</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#C10B2F]'></span>
                                        <span className='text-white'>Lodging</span>
                                        <span className='text-white font-bold ml-auto'>40%</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#988316]'></span>
                                        <span className='text-white'>Transportation</span>
                                        <span className='text-white font-bold ml-auto'>20%</span>
                                    </div>
                                </div>
                            </div>


                            {/* Activities Budget Bar */}
                            <div className='mb-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-white text-sm'>Activities Budget</span>
                                    <span className='text-white text-sm font-bold'>${categoryBudgets.activities} <span className='text-gray-400 font-normal'>Max</span></span>
                                </div>
                                <ItineraryFilterBarGraph 
                                    bars={20}
                                    maxValue={1000}
                                    currentValue={categoryBudgets.activities}
                                    enabled={true}
                                    onValueChange={(value) => setCategoryBudgets(prev => ({ ...prev, activities: value }))}
                                />
                            </div>

                            {/* Max Day Length */}
                            <div className='mb-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-white text-sm'>Max Day Length</span>
                                    <span className='text-white text-sm font-bold'>8h <span className='text-gray-400 font-normal'>Max</span></span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="12" 
                                    value="8" 
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                                />
                            </div>

                            {/* No. of Activities */}
                            <div className='mb-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-white text-sm'>No. of Activities</span>
                                    <div className='flex gap-2'>
                                        <button className='px-2 py-1 rounded border border-gray-600 text-white text-xs'>Total</button>
                                        <button className='px-2 py-1 rounded border border-gray-600 text-gray-400 text-xs'>Daily</button>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='text-white text-sm'>Activities for the whole trip</span>
                                    <div className='flex items-center gap-2'>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>-</button>
                                        <span className='text-white font-bold'>2</span>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Preferred Activities */}
                            <div className='mb-6'>
                                <span className='text-white text-sm mb-2 block'>Preferred Activities</span>
                                <div className='flex flex-wrap gap-2'>
                                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm'>
                                        <span>💎</span>
                                        <span>Gold Mine Tours</span>
                                    </div>
                                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm'>
                                        <span>🥾</span>
                                        <span>Hiking</span>
                                    </div>
                                    <span className='text-white text-sm'>+2</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2'>
                                <button className='flex-1 py-2 rounded-xl border border-gray-600 text-white text-sm'>Reset</button>
                                <button className='flex-1 py-2 rounded-xl bg-white text-black text-sm font-medium'>Apply</button>
                            </div>
                                </div>
                            )}

                            {/* Lodging Filter Content */}
                            {selectedView === 'lodging' && (
                                <div>
                                    <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>Lodging</h3>
                                    <p className='text-gray-400 text-sm'>Filter</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-gray-400 text-sm'>Per Person</p>
                                    <Toggle enabled={true} setEnabled={() => {}} />
                                </div>
                            </div>
                            
                            <div className='mb-4'>
                                <p className='text-white text-xl font-bold'>${categoryBudgets.lodging} <span className='text-gray-400 text-sm font-normal'>Max</span></p>
                            </div>

                            {/* Pie Chart */}
                            <div className='flex items-center gap-4 mb-4'>
                                <ItineraryFilterPieChart data={[
                                    { name: 'Activities', value: 40 },
                                    { name: 'Lodging', value: 40 },
                                    { name: 'Transportation', value: 20 },
                                ]} />
                                <div className='flex flex-col gap-1 text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#0252D0]'></span>
                                        <span className='text-white'>Activities</span>
                                        <span className='text-white font-bold ml-auto'>40%</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#C10B2F]'></span>
                                        <span className='text-white'>Lodging</span>
                                        <span className='text-white font-bold ml-auto'>40%</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#988316]'></span>
                                        <span className='text-white'>Transportation</span>
                                        <span className='text-white font-bold ml-auto'>20%</span>
                                    </div>
                                </div>
                            </div>


                            {/* Lodging Budget Bar */}
                            <div className='mb-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-white text-sm'>Lodging Budget</span>
                                    <span className='text-white text-sm font-bold'>${categoryBudgets.lodging} <span className='text-gray-400 font-normal'>Max</span></span>
                                </div>
                                <ItineraryFilterBarGraph 
                                    bars={20}
                                    maxValue={1000}
                                    currentValue={categoryBudgets.lodging}
                                    enabled={true}
                                    onValueChange={(value) => setCategoryBudgets(prev => ({ ...prev, lodging: value }))}
                                />
                            </div>

                            {/* Room Details */}
                            <div className='space-y-3 mb-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-white text-sm'>No. of Room(s)</span>
                                    <div className='flex items-center gap-2'>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>-</button>
                                        <span className='text-white font-bold'>0</span>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>+</button>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-white text-sm'>No. of Bed(s)</span>
                                    <div className='flex items-center gap-2'>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>-</button>
                                        <span className='text-white font-bold'>0</span>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>+</button>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-white text-sm'>No. of Bathroom(s)</span>
                                    <div className='flex items-center gap-2'>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>-</button>
                                        <span className='text-white font-bold'>0</span>
                                        <button className='w-6 h-6 rounded border border-gray-600 flex items-center justify-center text-white'>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Lodging Types */}
                            <div className='mb-6'>
                                <span className='text-white text-sm mb-2 block'>Lodging Type(s)</span>
                                <div className='flex flex-wrap gap-2'>
                                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm'>
                                        <span>🏠</span>
                                        <span>Cabin</span>
                                    </div>
                                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm'>
                                        <span>🏨</span>
                                        <span>Hotel</span>
                                    </div>
                                    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm'>
                                        <span>⚠️</span>
                                        <span>Camp</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2'>
                                <button className='flex-1 py-2 rounded-xl border border-gray-600 text-white text-sm'>Reset</button>
                                <button className='flex-1 py-2 rounded-xl bg-white text-black text-sm font-medium'>Apply</button>
                            </div>
                                </div>
                            )}

                            {/* Transport Filter Content */}
                            {selectedView === 'transport' && (
                                <div>
                                    <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>Transport</h3>
                                    <p className='text-gray-400 text-sm'>Filter</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-gray-400 text-sm'>Per Person</p>
                                    <Toggle enabled={true} setEnabled={() => {}} />
                                </div>
                            </div>
                            
                            <div className='mb-4'>
                                <p className='text-white text-xl font-bold'>${categoryBudgets.transport} <span className='text-gray-400 text-sm font-normal'>Max</span></p>
                            </div>

                            {/* Pie Chart */}
                            <div className='flex items-center gap-4 mb-4'>
                                <ItineraryFilterPieChart data={[
                                    { name: 'Activities', value: 40 },
                                    { name: 'Lodging', value: 40 },
                                    { name: 'Transportation', value: 20 },
                                ]} />
                                <div className='flex flex-col gap-1 text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#0252D0]'></span>
                                        <span className='text-white'>Activities</span>
                                        <span className='text-white font-bold ml-auto'>40%</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#C10B2F]'></span>
                                        <span className='text-white'>Lodging</span>
                                        <span className='text-white font-bold ml-auto'>40%</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2 h-2 rounded-full bg-[#988316]'></span>
                                        <span className='text-white'>Transportation</span>
                                        <span className='text-white font-bold ml-auto'>20%</span>
                                    </div>
                                </div>
                            </div>


                            {/* Transportation Toggle */}
                            <div className='flex justify-between items-center mb-4'>
                                <div className='flex items-center gap-2'>
                                    <MdOutlineDirectionsCarFilled className='text-white text-lg' />
                                    <span className='text-white text-sm'>Transportation</span>
                                </div>
                                <Toggle enabled={true} setEnabled={() => {}} />
                            </div>

                            {/* Transportation Budget Bar */}
                            <div className='mb-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-white text-sm'>Transportation Budget</span>
                                    <span className='text-white text-sm font-bold'>${categoryBudgets.transport} <span className='text-gray-400 font-normal'>Max</span></span>
                                </div>
                                <ItineraryFilterBarGraph 
                                    bars={20}
                                    maxValue={1000}
                                    currentValue={categoryBudgets.transport}
                                    enabled={true}
                                    onValueChange={(value) => setCategoryBudgets(prev => ({ ...prev, transport: value }))}
                                />
                            </div>

                            {/* Max Daily Drive Time */}
                            <div className='mb-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-white text-sm'>Max Daily Drive Time</span>
                                    <span className='text-white text-sm font-bold'>4h <span className='text-gray-400 font-normal'>Max</span></span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="8" 
                                    value="4" 
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                                />
                            </div>

                            {/* Transportation Types */}
                            <div className='mb-6'>
                                <span className='text-white text-sm mb-2 block'>Transportation Type(s)</span>
                                <div className='flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-600 bg-gray-800/30'>
                                    <MdOutlineDirectionsCarFilled className='text-white text-lg' />
                                    <span className='text-white text-sm'>Sedan</span>
                                    <span className='ml-auto text-gray-400'>▼</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2'>
                                <button className='flex-1 py-2 rounded-xl border border-gray-600 text-white text-sm'>Reset</button>
                                <button className='flex-1 py-2 rounded-xl bg-white text-black text-sm font-medium'>Apply</button>
                            </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {advanceFilter ? (
                            <div className='mt-6'>
                                <div className='overflow-auto scrollbar-hide'>
                                    <div className=" inline-flex justify-start  my-5 border border-border-primary rounded-full p-1">
                                        <Button
                                            onClick={() => setSelectedView('activities')}
                                            className={` border-white  !py-2 ${selectedView === 'activities' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
                                            variant={selectedView === 'activities' ? 'outline' : 'simple'}
                                        >
                                            Activities
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedView('lodging')}
                                            className={` border-white !py-2 ${selectedView === 'lodging' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
                                            variant={selectedView === 'lodging' ? 'outline' : 'simple'}
                                        >
                                            Lodging
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedView('transport')}
                                            className={` border-white  !py-2 ${selectedView === 'transport' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
                                            variant={selectedView === 'transport' ? 'outline' : 'simple'}
                                        >
                                            Transport
                                        </Button>
                                    </div>
                                </div>

                                {selectedView === 'transport' && (
                                    <div className='flex items-center justify-between '>
                                        <p className='flex items-center gap-2 text-white'><MdOutlineDirectionsCarFilled className='h-6 w-6' /> Transportation</p>
                                        <Toggle enabled={true} setEnabled={() => { }} />
                                    </div>
                                )}
                                
                                <div className='mt-4 flex justify-between items-center w-full'>
                                    <p className='text-white  font-bold'>{selectedView === 'activities' ? 'Activities' : selectedView === 'lodging' ? 'Lodging' : 'Transportation'} Budget</p>
                                    <p className='text-white  font-bold flex items-center gap-1'>${categoryBudgets[selectedView]} <span className='text-sm font-normal text-primary-gray'> Max</span></p>
                                </div>

                                <ItineraryFilterBarGraph 
                                    color={selectedView === 'activities' ? '#0252D0' : selectedView === 'lodging' ? '#C10B2F' : '#988316'} 
                                    bars={20}
                                    maxValue={totalBudget}
                                    currentValue={categoryBudgets[selectedView]}
                                    enabled={true}
                                    onValueChange={(value) => updateCategoryBudget(selectedView, value)}
                                />
                                
                                {selectedView !== "lodging" && (
                                    <div>
                                        <div className='mt-4 flex justify-between items-center w-full'>
                                            <p className='text-white  font-bold'>{selectedView === 'activities' ? 'Max Day Length' : selectedView === 'transport' ? 'Max Daily Drive Time' : ''}</p>
                                            <p className='text-white  font-bold flex items-center gap-1'>{selectedView === 'activities' ? '10h' : selectedView === 'transport' ? '10h' : ''} <span className='text-sm font-normal text-primary-gray'> Max</span></p>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={sliderValue}
                                            onChange={handleSliderChange}
                                            className={`w-full mt-1 accent-[${selectedView === 'activities' ? '#0252D0' : selectedView === 'transport' ? '#988316' : '#C10B2F'}]`}
                                        />
                                    </div>
                                )}

                                {selectedView === 'activities' ? (
                                    <div className='mt-3'>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-white  font-bold mb-2'>No of Activities</p>
                                            <div className='flex items-center gap-1'>
                                                <Button variant='outline' size='sm' className={`!py-2 ${activityType === "daily" ? "!bg-black" : "!bg-transparent"}`} onClick={() => setActivityType("daily")}>Daily</Button>
                                                <Button variant='outline' size='sm' className={`!py-2 ${activityType === "total" ? "!bg-black" : "!bg-transparent"}`} onClick={() => setActivityType("total")}>Total</Button>
                                            </div>
                                        </div>
                                        {activityType === "daily" ? (
                                            <div className='mt-4 flex items-center justify-between w-full gap-3'>
                                                <div>
                                                    <p className='text-white text-sm font-bold mb-1'>Activities</p>
                                                    <p className='text-white text-xs font-normal mb-2'>per day</p>
                                                </div>
                                                <Counter count={count} setCount={setCount} max={10} />
                                            </div>
                                        ) : (
                                            <div>
                                                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"].map((item, i) => {
                                                    return (
                                                        <div key={i} className='flex items-center justify-between w-full gap-3 mb-2'>
                                                            <div>
                                                                <p className='text-white text-sm font-bold mb-1'>{item}</p>
                                                                <p className='text-white text-xs font-normal mb-2'>per day</p>
                                                            </div>
                                                            <Counter count={count} setCount={setCount} max={10} />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : selectedView === 'lodging' ? (
                                    <div>
                                        {["No of Room(s)", "No of Bed(s)", "No of Bathroom(s)"].map((item, i) => {
                                            return (
                                                <div key={i} className='mt-4 flex items-center justify-between w-full gap-3'>
                                                    <p className='text-white  font-bold mb-2'>{item}</p>
                                                    <Counter count={item === "No of Room(s)" ? rooms : item === "No of Bed(s)" ? beds : bathrooms} setCount={item === "No of Room(s)" ? setRooms : item === "No of Bed(s)" ? setBeds : setBathrooms} max={10} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                
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
                {toggle && (
                    <div className='mt-6 flex items-center justify-between w-full'>
                        <Button 
                            onClick={() => setShowAdvanced(!showAdvanced)} 
                            variant='outline' 
                            className='!bg-black flex items-center justify-center gap-2'
                        >
                            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'} 
                            <GoArrowRight className={`size-6 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                        </Button>
                    </div>
                )}

                {advanceFilter ? (
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


                    </div>
                ) : (
                    <Button onClick={() => setAdvanceFilter(true)} variant='outline' className='mt-6 w-full !bg-black flex items-center justify-center gap-2'>Advance Filter <GoArrowRight className='size-6' /></Button>
                )}
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageFilter
