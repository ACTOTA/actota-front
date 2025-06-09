'use client'
import React, { useState } from 'react'
import Toggle from './Toggle/Toggle'
import Button from './figma/Button'
import ItineraryFilterBarGraph from './ItineraryFilterBarGraph'
import { MdOutlineDirectionsCarFilled } from 'react-icons/md'
import Counter from './Counter'
import ActivityDropdown from './navbar/ActivityDropdown'

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

interface AdvancedFilterContentProps {
    selectedView: 'activities' | 'lodging' | 'transport';
    setSelectedView: (view: 'activities' | 'lodging' | 'transport') => void;
    categoryBudgets: {
        activities: number;
        lodging: number;
        transport: number;
    };
    updateCategoryBudget: (category: 'activities' | 'lodging' | 'transport', value: number) => void;
    totalBudget: number;
    sliderValue: number;
    handleSliderChange: (e: any) => void;
    activityType: "daily" | "total";
    setActivityType: (type: "daily" | "total") => void;
    count: number;
    setCount: (count: number) => void;
    rooms: number;
    setRooms: (rooms: number) => void;
    beds: number;
    setBeds: (beds: number) => void;
    bathrooms: number;
    setBathrooms: (bathrooms: number) => void;
}

const AdvancedFilterContent = ({
    selectedView,
    setSelectedView,
    categoryBudgets,
    updateCategoryBudget,
    totalBudget,
    sliderValue,
    handleSliderChange,
    activityType,
    setActivityType,
    count,
    setCount,
    rooms,
    setRooms,
    beds,
    setBeds,
    bathrooms,
    setBathrooms
}: AdvancedFilterContentProps) => {
    return (
        <div className='mt-6'>
            {/* Tab Selection */}
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

            {/* Transportation Toggle */}
            {selectedView === 'transport' && (
                <div className='flex items-center justify-between '>
                    <p className='flex items-center gap-2 text-white'><MdOutlineDirectionsCarFilled className='h-6 w-6' /> Transportation</p>
                    <Toggle enabled={true} setEnabled={() => { }} />
                </div>
            )}
            
            {/* Category Budget */}
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
            
            {/* Max Day Length / Drive Time for Activities and Transport */}
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

            {/* Content Based on Selected View */}
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
    );
};

// Wrapper component that manages state and props for AdvancedFilterContent
interface ItineraryPageAdvanceFilterProps {
    setShowFilter: (show: boolean) => void;
    advanceFilter: boolean;
    setAdvanceFilter: (advance: boolean) => void;
}

const ItineraryPageAdvanceFilter = ({ 
    setShowFilter, 
    advanceFilter, 
    setAdvanceFilter 
}: ItineraryPageAdvanceFilterProps) => {
    // State management for the advanced filter
    const [selectedView, setSelectedView] = useState<'activities' | 'lodging' | 'transport'>('activities');
    const [categoryBudgets, setCategoryBudgets] = useState({
        activities: 1000,
        lodging: 1500,
        transport: 500
    });
    const [totalBudget, setTotalBudget] = useState(3000);
    const [sliderValue, setSliderValue] = useState(1500);
    const [activityType, setActivityType] = useState<"daily" | "total">("daily");
    const [count, setCount] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [beds, setBeds] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);

    const updateCategoryBudget = (category: 'activities' | 'lodging' | 'transport', value: number) => {
        setCategoryBudgets(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleSliderChange = (e: any) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);
        updateCategoryBudget(selectedView, value);
    };

    return (
        <AdvancedFilterContent
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            categoryBudgets={categoryBudgets}
            updateCategoryBudget={updateCategoryBudget}
            totalBudget={totalBudget}
            sliderValue={sliderValue}
            handleSliderChange={handleSliderChange}
            activityType={activityType}
            setActivityType={setActivityType}
            count={count}
            setCount={setCount}
            rooms={rooms}
            setRooms={setRooms}
            beds={beds}
            setBeds={setBeds}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
        />
    );
};

export default ItineraryPageAdvanceFilter;