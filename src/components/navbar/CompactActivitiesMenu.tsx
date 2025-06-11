'use client';

import React, { useState, useEffect } from 'react';
import Toggle from '@/src/components/Toggle/Toggle';
import { GoHome } from "react-icons/go";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";
import { MdSpeed } from "react-icons/md";
import GlassPanel from '../figma/GlassPanel';
import { MOBILE_GLASS_PANEL_STYLES, getMobileGlassPanelProps } from './constants';
import { ACTIVITY_CATEGORIES } from '@/src/utils/activityTagMapping';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "@heroicons/react/20/solid";
import Button from '../figma/Button';

interface CompactActivitiesMenuProps {
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

export default function CompactActivitiesMenu({ updateSearchValue, activitiesValue, className }: CompactActivitiesMenuProps) {
    // Add CSS to hide scrollbars
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLodging, setSelectedLodging] = useState<string[]>([]);
    const [transportationIncluded, setTransportationIncluded] = useState<boolean>(false);
    const [selectedPace, setSelectedPace] = useState<string>('');
    const [lodgingEnabled, setLodgingEnabled] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activitiesDropdownOpen, setActivitiesDropdownOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ rect?: DOMRect; showAbove?: boolean }>({});

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Update parent component when selections change
    useEffect(() => {
        updateSummary();
    }, [selectedCategories, selectedLodging, transportationIncluded, selectedPace, lodgingEnabled]);

    const updateSummary = () => {
        const activities = [];

        // Add selected category labels
        selectedCategories.forEach(categoryId => {
            const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
            if (category) {
                activities.push(category.label);
            }
        });

        // Add pace if selected
        if (selectedPace) {
            activities.push(`${selectedPace} Pace`);
        }

        if (lodgingEnabled && selectedLodging.length > 0) {
            activities.push(...selectedLodging);
        }

        if (transportationIncluded) {
            activities.push('Transportation Included');
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

    const paceOptions = [
        {
            id: 'relaxed',
            label: 'Relaxed',
            detail: 'Plenty of downtime, leisurely pace',
            icon: '🌿'
        },
        {
            id: 'moderate',
            label: 'Moderate',
            detail: 'Balanced schedule with some rest',
            icon: '⚖️'
        },
        {
            id: 'adventure',
            label: 'Adventure',
            detail: 'Action-filled, maximize experiences',
            icon: '⚡'
        }
    ];

    const getSelectedActivitiesDisplay = () => {
        if (selectedCategories.length === 0) return "Select activity types";
        if (selectedCategories.length === 1) {
            const category = ACTIVITY_CATEGORIES.find(cat => cat.id === selectedCategories[0]);
            return category?.label || "1 type selected";
        }
        return `${selectedCategories.length} types selected`;
    };

    return (
        <>
        <GlassPanel
            {...getMobileGlassPanelProps(isMobile)}
            className={`flex flex-col gap-6 h-full w-full max-w-[520px] mx-auto z-20 text-lg ${isMobile ? MOBILE_GLASS_PANEL_STYLES : ''} ${className}`}
        >
            <div className="mb-2">
                <h2 className="text-left text-white text-xl font-semibold mb-1">What would you like to do?</h2>
                <p className="text-sm text-gray-400 mb-6">Choose activity types that interest you</p>
            </div>
            
            {/* Activity Types Dropdown */}
            <div>
                <p className='flex items-center gap-2 mb-3 font-medium text-white'>
                    <FaPersonWalking className='h-5 w-5 text-blue-400' /> Activity Types
                </p>

                <div className="relative">
                    <button
                        onClick={() => setActivitiesDropdownOpen(!activitiesDropdownOpen)}
                        className="w-full px-4 py-3 text-left bg-gray-800/50 text-white rounded-lg hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 flex items-center justify-between transition-all duration-200"
                    >
                        <span>{getSelectedActivitiesDisplay()}</span>
                        {activitiesDropdownOpen ? 
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        }
                    </button>

                    {activitiesDropdownOpen && (
                        <div className="absolute z-20 w-full mt-2 bg-black/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                            {/* Quick select all/none */}
                            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400">{selectedCategories.length} of {ACTIVITY_CATEGORIES.length} activity types selected</span>
                                    {selectedCategories.length > 0 && (
                                        <span className="text-xs text-green-400 mt-0.5">
                                            This will find activities matching your interests
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        if (selectedCategories.length === ACTIVITY_CATEGORIES.length) {
                                            setSelectedCategories([]);
                                        } else {
                                            setSelectedCategories(ACTIVITY_CATEGORIES.map(cat => cat.id));
                                        }
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    {selectedCategories.length === ACTIVITY_CATEGORIES.length ? 'Clear all' : 'Select all'}
                                </button>
                            </div>

                            {/* Category grid */}
                            <div className="max-h-[300px] overflow-y-auto p-3 scrollbar-hide"
                                 style={{
                                     scrollbarWidth: 'none',
                                     msOverflowStyle: 'none'
                                 }}>
                                <div className="grid grid-cols-2 gap-2">
                                    {ACTIVITY_CATEGORIES.map(category => {
                                        const Icon = categoryIcons[category.id];
                                        const isSelected = selectedCategories.includes(category.id);
                                        
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => toggleCategory(category.id)}
                                                onMouseEnter={(e) => {
                                                    setHoveredCategory(category.id);
                                                    
                                                    // Calculate tooltip position based on element position and screen bounds
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const viewportHeight = window.innerHeight;
                                                    const tooltipHeight = 80; // Approximate tooltip height
                                                    
                                                    // Store both rect and positioning info for fixed positioning
                                                    setTooltipPosition({
                                                        rect: rect,
                                                        showAbove: rect.top > tooltipHeight + 20
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredCategory(null);
                                                    setTooltipPosition({});
                                                }}
                                                className={`relative p-3 rounded-lg border transition-all duration-200 text-left ${
                                                    isSelected 
                                                        ? 'bg-blue-500/20 border-blue-500/50' 
                                                        : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {Icon && <Icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-white text-sm truncate">{category.label}</h4>
                                                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                            {category.keywords.slice(0, 2).join(', ')}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                    )}
                                                </div>

                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Done button */}
                            <div className="p-3 border-t border-gray-800">
                                <button
                                    onClick={() => setActivitiesDropdownOpen(false)}
                                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trip Pace Section */}
            <div>
                <p className='flex items-center gap-2 mb-3 font-medium text-white'>
                    <MdSpeed className='h-5 w-5 text-blue-400' /> Trip Pace
                </p>

                <div className="space-y-2">
                    {paceOptions.map(pace => {
                        const isSelected = selectedPace === pace.id;
                        
                        return (
                            <button
                                key={pace.id}
                                onClick={() => setSelectedPace(isSelected ? '' : pace.id)}
                                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                                    isSelected 
                                        ? 'bg-blue-500/20 border-blue-500/50' 
                                        : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{pace.icon}</span>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white">{pace.label}</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">{pace.detail}</p>
                                    </div>
                                    {isSelected && (
                                        <CheckIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    )}
                                </div>
                            </button>
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
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-2'>
                            <MdOutlineDirectionsCarFilled className='h-5 w-5 text-blue-400' />
                            <div>
                                <p className="font-medium text-white">Include Transportation</p>
                                <p className="text-sm text-gray-400">Add transportation to your itinerary</p>
                            </div>
                        </div>
                        <Toggle 
                            enabled={transportationIncluded} 
                            setEnabled={() => setTransportationIncluded(!transportationIncluded)} 
                        />
                    </div>
                </div>
            </div>
        </GlassPanel>

        {/* Fixed positioned tooltip outside the dropdown to avoid clipping */}
        {hoveredCategory && tooltipPosition.rect && (
            <div 
                className="fixed z-[9999] p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl pointer-events-none"
                style={{
                    left: tooltipPosition.rect.left + tooltipPosition.rect.width / 2,
                    transform: 'translateX(-50%)',
                    ...(tooltipPosition.showAbove 
                        ? { bottom: window.innerHeight - tooltipPosition.rect.top + 10 }
                        : { top: tooltipPosition.rect.bottom + 10 }
                    ),
                    maxWidth: '200px',
                    whiteSpace: 'nowrap'
                }}
            >
                {(() => {
                    const category = ACTIVITY_CATEGORIES.find(cat => cat.id === hoveredCategory);
                    return category ? (
                        <>
                            <p className="text-xs text-gray-300 font-medium mb-1">This will find activities tagged with:</p>
                            <p className="text-xs text-gray-400">
                                {category.relatedTags.slice(0, 4).join(', ')}
                                {category.relatedTags.length > 4 && '...'}
                            </p>
                        </>
                    ) : null;
                })()}
            </div>
        )}
        </>
    );
}