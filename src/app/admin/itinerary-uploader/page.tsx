'use client';

import React from 'react';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import Button from '@/src/components/figma/Button';
import { HiOutlineUpload } from 'react-icons/hi';

// Import custom hooks
import { useItineraryForm } from './hooks/useItineraryForm';

// Import components
import BasicInfoSection from './components/BasicInfoSection';
import LocationsSection from './components/LocationsSection';
import DescriptionSection from './components/DescriptionSection';
import ImagesSection from './components/ImagesSection';
import DaysSection from './components/DaysSection';

export default function ItineraryUploader() {
  const {
    formData,
    errors,
    newImage,
    isLoading,
    message,
    renumberNotification,
    activities,
    isLoadingActivities,
    activitySearchQuery,
    filteredActivities,
    activeSearchItem,
    setNewImage,
    handleChange,
    handleLocationChange,
    handleSelectActivity,
    handleAddImage,
    handleRemoveImage,
    handleAddDay,
    handleRemoveDay,
    handleAddDayItem,
    handleRemoveDayItem,
    handleDayItemChange,
    handleSubmit,
    fetchActivities,
    setActivitySearchQuery,
    setActiveSearchItem
  } = useItineraryForm();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 pb-20">
      <GlassPanel className="w-[900px] max-w-full flex flex-col justify-around relative text-white p-8 mb-8">
        <div className="text-white flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Admin - Featured Itinerary Uploader</h3>
          <Image src="/images/actota-logo.png" alt="logo" width={110} height={20} />
        </div>
        
        {message && (
          <div className={`px-4 py-3 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
          }`}>
            <p className="text-white text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* Basic Information Section */}
          <BasicInfoSection 
            tripName={formData.trip_name}
            fareharborId={formData.fareharbor_id}
            minAge={formData.min_age}
            minGroup={formData.min_group}
            maxGroup={formData.max_group}
            lengthDays={formData.length_days}
            lengthHours={formData.length_hours}
            handleChange={handleChange}
            errors={{
              trip_name: errors.trip_name,
              min_group: errors.min_group,
              max_group: errors.max_group
            }}
          />

          {/* Locations Section */}
          <LocationsSection 
            startLocation={formData.start_location}
            endLocation={formData.end_location}
            handleLocationChange={handleLocationChange}
            errors={{
              start_location: errors.start_location,
              end_location: errors.end_location
            }}
          />

          {/* Description Section */}
          <DescriptionSection 
            description={formData.description}
            handleChange={handleChange}
            error={errors.description}
          />

          {/* Images Section */}
          <ImagesSection 
            images={formData.images || []}
            newImage={newImage}
            setNewImage={setNewImage}
            handleAddImage={handleAddImage}
            handleRemoveImage={handleRemoveImage}
          />

          {/* Days and Activities Section */}
          <DaysSection
            days={formData.days}
            day_durations={formData.day_durations}
            renumberNotification={renumberNotification}
            handleAddDay={handleAddDay}
            handleRemoveDay={handleRemoveDay}
            handleAddDayItem={handleAddDayItem}
            handleRemoveDayItem={handleRemoveDayItem}
            handleDayItemChange={handleDayItemChange}
            error={errors.days}
            activitySearchQuery={activitySearchQuery}
            activeSearchItem={activeSearchItem}
            isLoadingActivities={isLoadingActivities}
            filteredActivities={filteredActivities}
            activities={activities}
            setActivitySearchQuery={setActivitySearchQuery}
            setActiveSearchItem={setActiveSearchItem}
            fetchActivities={fetchActivities}
            handleSelectActivity={handleSelectActivity}
          />

          <Button
            type="submit"
            variant="primary"
            className="bg-white text-black w-full mt-4"
            isLoading={isLoading}
          >
            <HiOutlineUpload className="mr-2" size={20} />
            Upload Featured Itinerary
          </Button>
        </form>
      </GlassPanel>
      
      <div className="text-white text-sm opacity-50 mt-2 mb-10">
        Note: This page is for administrative use only.
      </div>
    </div>
  );
}