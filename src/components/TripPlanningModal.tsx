'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    XMarkIcon, 
    MapPinIcon, 
    CalendarIcon, 
    UsersIcon, 
    SparklesIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { 
    BuildingLibraryIcon, 
    UserGroupIcon, 
    HeartIcon
} from '@heroicons/react/24/solid';
import GlassPanel from './figma/GlassPanel';
import LocationMenu from './navbar/LocationMenu';
import DateMenu from './navbar/DateMenu';
import GuestMenu from './navbar/GuestMenu';
import CompactActivitiesMenu from './navbar/CompactActivitiesMenu';

interface TripPlanningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TripPlanningModal: React.FC<TripPlanningModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const [searchValues, setSearchValues] = useState({
        location: '',
        duration: '',
        guests: '',
        activities: ''
    });
    
    const updateSearchValue = (key: string, value: string) => {
        setSearchValues(prev => ({ ...prev, [key]: value }));
    };

    const totalSteps = 4;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Build search parameters
        const searchParams = new URLSearchParams();
        
        if (searchValues.location) {
            searchParams.append('location', searchValues.location);
        }
        
        if (searchValues.duration) {
            // Parse duration value which comes in format like "2024-12-25T09:00:00|2024-12-27T17:00:00"
            const [startDateTime, endDateTime] = searchValues.duration.split('|');
            if (startDateTime) searchParams.append('arrival_datetime', startDateTime);
            if (endDateTime) searchParams.append('departure_datetime', endDateTime);
        }
        
        if (searchValues.guests) {
            searchParams.append('guests', searchValues.guests);
        }
        
        if (searchValues.activities) {
            // Split the activities string and add each as a separate parameter
            const activities = searchValues.activities.split(', ').filter(a => a.trim());
            activities.forEach(activity => {
                searchParams.append('activities', activity.trim());
            });
        }

        // Redirect to search results
        router.push(`/itineraries?${searchParams.toString()}`);
        onClose();
        setIsLoading(false);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-md:p-2">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <GlassPanel 
                variant="dark" 
                blur="xl" 
                className="relative w-full max-w-6xl h-[90vh] max-md:h-[95vh] rounded-3xl overflow-hidden"
            >
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white text-lg font-semibold">Creating your perfect trip...</p>
                            <p className="text-gray-400 text-sm">AI is crafting personalized recommendations</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="relative p-8 pb-6 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl mx-auto mb-4">
                        <SparklesIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-2">Plan Your Perfect Trip</h2>
                    <p className="text-gray-400">Tell us about your dream adventure</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                            <span>Step {currentStep} of {totalSteps}</span>
                            <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-8 max-md:px-4 pb-4 flex-1 overflow-y-auto">
                    <div className="min-h-full flex flex-col">
                        {/* Step 1: Destination */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade-in-up flex-1 flex flex-col justify-center">
                                <div className="text-center">
                                    <MapPinIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Where would you like to go?</h3>
                                    <p className="text-gray-400 text-sm">Choose a destination or leave blank for AI suggestions</p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <LocationMenu 
                                        locationValue={searchValues.location}
                                        updateSearchValue={(value) => updateSearchValue('location', value)}
                                        onConfirm={() => setCurrentStep(2)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Dates */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fade-in-up flex-1 flex flex-col justify-center">
                                <div className="text-center">
                                    <CalendarIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">When do you want to travel?</h3>
                                    <p className="text-gray-400 text-sm">Select your preferred travel dates and times</p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <DateMenu 
                                        durationValue={searchValues.duration}
                                        updateSearchValue={(value) => updateSearchValue('duration', value)}
                                        onConfirm={() => setCurrentStep(3)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Travelers */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fade-in-up flex-1 flex flex-col justify-center">
                                <div className="text-center">
                                    <UsersIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Who&apos;s traveling?</h3>
                                    <p className="text-gray-400 text-sm">Tell us about your travel group</p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <GuestMenu 
                                        guestsValue={searchValues.guests}
                                        updateSearchValue={(value) => updateSearchValue('guests', value)}
                                        onConfirm={() => setCurrentStep(4)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Activities */}
                        {currentStep === 4 && (
                            <div className="animate-fade-in-up flex-1">
                                <div className="text-center mb-6">
                                    <HeartIcon className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">What would you like to do?</h3>
                                    <p className="text-gray-400 text-sm">Choose activity types and preferences for your trip</p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <CompactActivitiesMenu 
                                        activitiesValue={searchValues.activities}
                                        updateSearchValue={(value) => updateSearchValue('activities', value)}
                                        onConfirm={() => handleSubmit()}
                                        className="h-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="px-8 max-md:px-4 pb-4">
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 gap-4">
                        <GlassPanel
                            variant="dark"
                            className={`flex-1 transition-all duration-300 ${
                                currentStep === 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'cursor-pointer hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-400/20'
                            }`}
                            onClick={currentStep === 1 ? undefined : handlePrevious}
                        >
                            <div className="flex items-center justify-center gap-2 px-6 py-4 text-gray-300 hover:text-white transition-colors">
                                <ArrowLeftIcon className="w-4 h-4" />
                                <span className="font-medium">Previous</span>
                            </div>
                        </GlassPanel>

                        <GlassPanel
                            variant="light"
                            className={`flex-1 transition-all duration-300 ${
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20'
                            }`}
                            onClick={isLoading ? undefined : handleNext}
                        >
                            <div className="flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold">
                                <span>{currentStep === totalSteps ? 'Find My Trip' : 'Next'}</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};

export default TripPlanningModal;