'use client';

import React, { useState, useEffect } from 'react';
import Toggle from '@/src/components/Toggle/Toggle';
import { GoHome } from "react-icons/go";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";
import GlassPanel from '../figma/GlassPanel';
import { MOBILE_GLASS_PANEL_STYLES, getMobileGlassPanelProps } from './constants';
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPE_MAPPING } from '@/src/utils/activityTagMapping';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

interface EnhancedActivitiesMenuProps {
    updateSearchValue?: (value: string) => void;
    activitiesValue?: string;
    className?: string;
}

// Activity category icons mapping
import Hiking from "@/public/activity-icons/hiking.svg";
import MountainBiking from "@/public/activity-icons/mountainBiking.svg";
import WhiteWaterRafting from "@/public/activity-icons/whiteWaterRafting.svg";
import Ziplining from "@/public/activity-icons/ziplining.svg";
import CaveExploring from "@/public/activity-icons/caveExploring.svg";
import GoldMineTours from "@/public/activity-icons/goldMineTours.svg";
import HotSprings from "@/public/activity-icons/hotSprings.svg";
import Skiing from "@/public/activity-icons/skiing.svg";
import ATVing from "@/public/activity-icons/atVing.svg";
import PrivateChef from "@/public/activity-icons/privateChef.svg";

// Lodging icons
import Airbnb from "@/public/lodging-icons/airbnb.svg";
import Cabin from "@/public/lodging-icons/cabin.svg";
import Hotel from "@/public/lodging-icons/hotel.svg";
import Glamping from "@/public/lodging-icons/glamping.svg";
import RV from "@/public/lodging-icons/rv.svg";
import Camp from "@/public/lodging-icons/camp.svg";

// Transportation icons
import Sedan from "@/public/transportation-icons/sedan.svg";
import SUV from "@/public/transportation-icons/suv.svg";
import Luxury from "@/public/transportation-icons/luxury.svg";
import PartyBus from "@/public/transportation-icons/partyBus.svg";
import Van from "@/public/transportation-icons/van.svg";

const categoryIcons: Record<string, any> = {
    'hiking': Hiking,
    'mountain-biking': MountainBiking,
    'water-sports': WhiteWaterRafting,
    'adventure': Ziplining,
    'wildlife': CaveExploring,
    'cultural': GoldMineTours,
    'relaxation': HotSprings,
    'winter-sports': Skiing,
    'motorized': ATVing,
    'dining': PrivateChef,
};

export default function EnhancedActivitiesMenu({ updateSearchValue, activitiesValue, className }: EnhancedActivitiesMenuProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLodging, setSelectedLodging] = useState<string[]>([]);
    const [selectedTransportation, setSelectedTransportation] = useState<string[]>([]);
    const [lodgingEnabled, setLodgingEnabled] = useState(true);
    const [transportationEnabled, setTransportationEnabled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Parse initial values
    useEffect(() => {
        if (activitiesValue) {
            const values = activitiesValue.split(', ');
            const categories: string[] = [];
            
            values.forEach(value => {
                const category = ACTIVITY_CATEGORIES.find(cat => 
                    cat.label.toLowerCase() === value.toLowerCase()
                );
                if (category) {
                    categories.push(category.id);
                }
            });
            
            setSelectedCategories(categories);
        }
    }, [activitiesValue]);

    // Update parent component when selections change
    useEffect(() => {
        updateSummary();
    }, [selectedCategories, selectedLodging, selectedTransportation, lodgingEnabled, transportationEnabled]);

    const updateSummary = () => {
        const activities = [];

        // Add selected category labels
        selectedCategories.forEach(categoryId => {
            const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
            if (category) {
                activities.push(category.label);
            }
        });

        if (lodgingEnabled && selectedLodging.length > 0) {
            activities.push(...selectedLodging);
        }

        if (transportationEnabled && selectedTransportation.length > 0) {
            activities.push(...selectedTransportation);
        }

        const summary = activities.join(', ');
        updateSearchValue?.(summary);
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleExpanded = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const lodgingOptions = [
        { id: 'airbnb', label: 'Airbnb', icon: Airbnb },
        { id: 'cabin', label: 'Cabin', icon: Cabin },
        { id: 'hotel', label: 'Hotel', icon: Hotel },
        { id: 'glamping', label: 'Glamping', icon: Glamping },
        { id: 'rv', label: 'RV', icon: RV },
        { id: 'camp', label: 'Camp', icon: Camp },
    ];

    const transportationOptions = [
        { id: 'sedan', label: 'Sedan', icon: Sedan },
        { id: 'suv', label: 'SUV', icon: SUV },
        { id: 'luxury', label: 'Luxury', icon: Luxury },
        { id: 'partyBus', label: 'Party Bus', icon: PartyBus },
        { id: 'van', label: '15 Passenger Van', icon: Van },
    ];

    return (
        <GlassPanel
            {...getMobileGlassPanelProps(isMobile)}
            className={`flex flex-col gap-6 h-full w-full max-w-[640px] mx-auto z-20 text-lg ${isMobile ? MOBILE_GLASS_PANEL_STYLES : ''} ${className}`}
        >
            <div className="mb-2">
                <h2 className="text-left text-white text-xl font-semibold mb-1">What would you like to do?</h2>
                <p className="text-sm text-gray-400 mb-6">Choose activity categories that interest you</p>
            </div>
            
            {/* Activity Categories */}
            <div>
                <p className='flex items-center gap-2 mb-4 font-medium text-white'>
                    <FaPersonWalking className='h-5 w-5 text-blue-400' /> Activity Categories
                </p>

                <div className="space-y-2">
                    {ACTIVITY_CATEGORIES.map(category => {
                        const Icon = categoryIcons[category.id];
                        const isSelected = selectedCategories.includes(category.id);
                        const isExpanded = expandedCategories.includes(category.id);
                        
                        return (
                            <div key={category.id} className="border border-gray-700 rounded-lg overflow-hidden">
                                <div
                                    className={`flex items-center p-3 cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                            ? 'bg-blue-500/20 border-blue-500/50' 
                                            : 'hover:bg-gray-800/50'
                                    }`}
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    <div className="flex items-center flex-1">
                                        {Icon && <Icon className="w-6 h-6 mr-3 text-blue-400" />}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-white">{category.label}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {category.keywords.slice(0, 3).join(', ')}...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isSelected && (
                                            <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">
                                                Selected
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpanded(category.id);
                                            }}
                                            className="p-1 hover:bg-gray-700/50 rounded"
                                        >
                                            {isExpanded ? 
                                                <ChevronUpIcon className="w-4 h-4 text-gray-400" /> : 
                                                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                            }
                                        </button>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="px-3 pb-3 pt-1 bg-gray-800/30">
                                        <p className="text-xs text-gray-500 mb-2">This category includes:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {category.relatedTags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lodging Section */}
            <div>
                <div className='flex items-center justify-between gap-2 mb-3'>
                    <p className='flex items-center gap-2 font-medium text-white'>
                        <GoHome className='h-5 w-5 text-blue-400' /> Lodging
                    </p>
                    <Toggle enabled={lodgingEnabled} setEnabled={() => setLodgingEnabled(!lodgingEnabled)} />
                </div>
                {lodgingEnabled && (
                    <div className="grid grid-cols-3 gap-2">
                        {lodgingOptions.map(option => {
                            const Icon = option.icon;
                            const isSelected = selectedLodging.includes(option.label);
                            
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        setSelectedLodging(prev =>
                                            isSelected
                                                ? prev.filter(l => l !== option.label)
                                                : [...prev, option.label]
                                        );
                                    }}
                                    className={`p-3 rounded-lg border transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-blue-500/20 border-blue-500/50'
                                            : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50'
                                    }`}
                                >
                                    <Icon className="w-8 h-8 mx-auto mb-1 text-blue-400" />
                                    <p className="text-xs text-white font-medium">{option.label}</p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            
            {/* Transportation Section */}
            <div>
                <div className='flex items-center justify-between mb-3'>
                    <p className='flex items-center gap-2 font-medium text-white'>
                        <MdOutlineDirectionsCarFilled className='h-5 w-5 text-blue-400' /> Transportation
                    </p>
                    <Toggle enabled={transportationEnabled} setEnabled={() => setTransportationEnabled(!transportationEnabled)} />
                </div>
                {transportationEnabled && (
                    <div className="grid grid-cols-3 gap-2">
                        {transportationOptions.map(option => {
                            const Icon = option.icon;
                            const isSelected = selectedTransportation.includes(option.label);
                            
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        setSelectedTransportation(prev =>
                                            isSelected
                                                ? prev.filter(t => t !== option.label)
                                                : [...prev, option.label]
                                        );
                                    }}
                                    className={`p-3 rounded-lg border transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-blue-500/20 border-blue-500/50'
                                            : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50'
                                    }`}
                                >
                                    <Icon className="w-8 h-8 mx-auto mb-1 text-blue-400" />
                                    <p className="text-xs text-white font-medium">{option.label}</p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected Summary */}
            {(selectedCategories.length > 0 || selectedLodging.length > 0 || selectedTransportation.length > 0) && (
                <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-sm font-medium text-gray-300 mb-2">Your Selections:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(categoryId => {
                            const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
                            return category ? (
                                <span key={categoryId} className="text-xs bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full">
                                    {category.label}
                                </span>
                            ) : null;
                        })}
                        {selectedLodging.map(lodging => (
                            <span key={lodging} className="text-xs bg-green-500/30 text-green-300 px-3 py-1 rounded-full">
                                {lodging}
                            </span>
                        ))}
                        {selectedTransportation.map(transport => (
                            <span key={transport} className="text-xs bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full">
                                {transport}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </GlassPanel>
    );
}