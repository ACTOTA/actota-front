'use client';

import React, { useState, useEffect } from 'react';
import Toggle from '@/src/components/Toggle/Toggle';
import { GoHome } from "react-icons/go";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";
import ActivityDropdown from './ActivityDropdown';

interface ActivitiesMenuProps {
    updateSearchValue?: (value: string) => void;
    activitiesValue?: string;
}


// activity icons
import ATVing from "@/public/activity-icons/atVing.svg";
import Backpacking from "@/public/activity-icons/backpacking.svg";
import Camping from "@/public/activity-icons/camping.svg";
import Campfire from "@/public/activity-icons/campfire.svg";
import CaveExploring from "@/public/activity-icons/caveExploring.svg";
import Fishing from "@/public/activity-icons/fishing.svg";
import FlyOverTheRockies from "@/public/svg-icons/airplane.svg";
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
import { useActivities } from '@/src/hooks/queries/activity/useActivityQuery';
import { useLodging } from '@/src/hooks/queries/lodging/useLodgingQuery';


export default function ActivitiesMenu({ updateSearchValue, activitiesValue }: ActivitiesMenuProps) {

    const lodgings = useLodging();
    const activity = useActivities();
    const [selectedActivity, setSelectedActivity] = useState(activitiesValue || 'Select preferred activities');
    const [selectedLodging, setSelectedLodging] = useState('Select preferred lodging');
    const [selectedTransportation, setSelectedTransportation] = useState('Select preferred transportation');
    const [lodgingEnabled, setLodgingEnabled] = useState(true);
    const [transportationEnabled, setTransportationEnabled] = useState(false);

    // Update parent component when selections change
    useEffect(() => {
        updateSummary();
    }, [selectedActivity, selectedLodging, selectedTransportation, lodgingEnabled, transportationEnabled]);

    const updateSummary = () => {
        const activities = [];
        
        if (selectedActivity && selectedActivity !== 'Select preferred activities') {
            activities.push(selectedActivity);
        }
        
        if (lodgingEnabled && selectedLodging && selectedLodging !== 'Select preferred lodging') {
            activities.push(selectedLodging);
        }
        
        if (transportationEnabled && selectedTransportation && selectedTransportation !== 'Select preferred transportation') {
            activities.push(selectedTransportation);
        }
        
        // Join with commas for proper parsing when counting in the Search component
        const summary = activities.join(', ');
        updateSearchValue?.(summary);
    };

    const staticActivities = [
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

    console.log('Activity:', activity?.data);

    function getIconForActivity(label: string) {
        switch (label) {
            case "ATV'ing":
                return ATVing;
            case "Backpacking":
                return Backpacking;
            case "Camping":
                return Camping;
            case "Campfire Experience":
                return Campfire;
            case "Cave Exploring":
                return CaveExploring;
            case "Fishing":
                return Fishing;
            case "Fly Over the Rockies":
                return FlyOverTheRockies;
            case "Gold Mine Tour":
                return GoldMineTours;
            case "Hiking":
                return Hiking;
            case "Hot Springs":
                return HotSprings;
            case "Horseback Riding":
                return HorsebackRiding;
            case "Mountain Biking":
                return MountainBiking;
            case "Museum Tours":
                return ATVing; // Using ATVing as fallback for Museum Tours
            case "Paddle Boarding":
                return PaddleBoarding;
            case "Private Chef":
                return PrivateChef;
            case "Ropes Course":
                return RopesCourse;
            case "Sight Seeing":
                return SightSeeing;
            case "Train Rides":
                return TrainRiding;
            case "White Water Rafting":
                return WhiteWaterRafting;
            case "Ziplining":
                return Ziplining;
            case "Skiing/Snowboarding":
                return Skiing;
            case "Snowmobiling":
                return Snowmobiling;
            case "Snowshoeing":
                return Snowshoeing;
            default:
                return Snowshoeing; // Default fallback icon
        }
    }

    const activities = activity?.data?.length != undefined ? activity?.data?.map((item: any) => ({
        id: item.label.toLowerCase().replace(/\s+/g, ''),
        label: item.label,
        icon: getIconForActivity(item.label),
        tags: item.tags
    })) : [];

    const staticLodging = [
        { id: "airbnb", label: "Airbnb", icon: Airbnb, },
        { id: "cabin", label: "Cabin", icon: Cabin, },
        { id: "hotel", label: "Hotel", icon: Hotel, },
        { id: "glamping", label: "Glamping", icon: Glamping, },
        { id: "rv", label: "RV", icon: RV, },
        { id: "camp", label: "Camp", icon: Camp, },
    ]

    const lodging = lodgings?.data?.length != undefined ? lodgings?.data?.map((item: any) => ({
        id: item.label.toLowerCase().replace(/\s+/g, ''),
        label: item.label,
        icon: item.label === 'Airbnb' ? Airbnb : item.label === 'Cabin' ? Cabin : item.label === 'Hotel' ? Hotel : item.label === 'Glamping' ? Glamping : item.label === 'RV' ? RV : item.label === 'Camp' ? Camp : Airbnb,
        tags: item.tags
    })) : [];


    const transportation = [
        { id: 'sedan', label: 'Sedan', icon: Sedan },
        { id: 'suv', label: 'SUV', icon: SUV },
        { id: 'luxury', label: 'Luxury', icon: Luxury },
        { id: 'partyBus', label: 'Party Bus', icon: PartyBus },
        { id: 'van', label: '15 Passenger Van', icon: Van },

    ];
    return (
        <section className="flex flex-col backdrop-blur-md text-white border-2 border-border-primary rounded-3xl gap-4 h-full w-full max-w-[520px] mx-auto z-20 text-lg p-4">
            <div className='mb-2'>
                <p className='flex items-center gap-2 mb-2'><FaPersonWalking className='h-6 w-6 ' /> Activities</p>

                <ActivityDropdown
                    onSelect={(value) => setSelectedActivity(value.toString())}
                    activities={activities.length > 0 ? activities : staticActivities}
                    title="Activities"
                />
            </div>

            <div className='mb-2'>
                <div className='flex items-center justify-between gap-2 mb-2'>

                    <p className='flex items-center gap-2'><GoHome className='h-6 w-6' /> Lodging</p>
                    <Toggle enabled={lodgingEnabled} setEnabled={() => { setLodgingEnabled(!lodgingEnabled) }} />

                </div>
                {lodgingEnabled && (
                    <ActivityDropdown
                        onSelect={(value) => setSelectedLodging(value.toString())}
                        activities={lodging.length > 0 ? lodging : staticLodging}
                        title="Lodging"
                    />
                )}
            </div>
            <div className='mb-2'>

                <div className='flex items-center justify-between mb-2'>

                    <p className='flex items-center gap-2'><MdOutlineDirectionsCarFilled className='h-6 w-6' /> Transportation</p>
                    <Toggle enabled={transportationEnabled} setEnabled={() => { setTransportationEnabled(!transportationEnabled) }} />
                </div>
                {transportationEnabled && (
                    <ActivityDropdown
                        onSelect={(value) => setSelectedTransportation(value.toString())}
                        activities={transportation}
                        title="Transportation"
                    />
                )}
            </div>
        </section>
    );
}
