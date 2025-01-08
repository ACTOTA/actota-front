'use client';

import { useEffect, useState, useMemo, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';
import { LoadScript } from '@react-google-maps/api';
import LocationMenu from './LocationMenu';
import DateMenu from './DateMenu';
import GuestMenu from './GuestMenu';
import ActivitiesMenu from './ActivitiesMenu';
import { STEPS } from '../../types/steps';
import { Location } from "@/db/models/itinerary";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

export interface Activity {
  _id: string;
  label: string;
}

export interface Lodging {
  _id: string;
  label: string;
}

export interface Guests {
  adults: number;
  children: number;
  infants: number;
}

type SearchSection = {
  step: STEPS;
  title: string;
  subtitle: string;
  hasLine: boolean;
  isSelected: boolean;
}



export default function Search({ setClasses }: { setClasses?: Dispatch<SetStateAction<string>> }) {


  const [currStep, setCurrStep] = useState<STEPS | null>(null);
  const [className, setClassName] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  // Where
  const [mapLocation, setMapLocation] = useState<Location>();
  // When
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // Who
  const [selectedGuests, setSelectedGuests] = useState<Guests>({ adults: 1, children: 0, infants: 0 });
  // What
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [lodging, setLodging] = useState<Lodging[]>([]);

  const [searchSections, setSearchSections] = useState<SearchSection[]>([
    { step: STEPS.LOCATION, title: "Where", subtitle: "Location", hasLine: true, isSelected: false },
    { step: STEPS.DATE, title: "When", subtitle: "Duration", hasLine: true, isSelected: false },
    { step: STEPS.GUESTS, title: "Who", subtitle: "Add Guests", hasLine: true, isSelected: false },
    { step: STEPS.ACTIVITIES, title: "What", subtitle: "Trip Details", hasLine: false, isSelected: false }
  ]);
  const searchRef = useRef<HTMLDivElement>(null);
  const stepsEle = useRef<HTMLDivElement>(null);

  const dimensions = useMemo(() => {
    switch (currStep) {
      case STEPS.LOCATION:
        return { w: 584, h: 596 };
      case STEPS.GUESTS:
        return { w: 400, h: 290 };
      case STEPS.ACTIVITIES:
        return { w: 520, h: 304 };
      case STEPS.DATE:
        return { w: 680, h: 424 };
      default:
        return { w: 584, h: 596 };
    }
  }, [currStep]);

  useEffect(() => {
    if (currStep === STEPS.LOCATION) {
      setMapLoaded(true);
    }
  }, [currStep]);

  useEffect(() => {
    setTimeout(() => {
      const searchElement = searchRef.current;
      if (!searchElement) return;

      const initialPosition = searchElement.getBoundingClientRect().top + window.scrollY;

      const handleScroll = () => {
        if (window.scrollY >= initialPosition) {
          setClasses('fixed top-0 left-1/2 -translate-x-1/2 py-2');
          setClassName('w-[580px] md:w-[640px] xl:w-[700px] 2xl:w-[720px]');
        } else {
          setClasses('');
          setClassName('');
        }
      };

      document.addEventListener('scroll', handleScroll, { passive: true });
      return () => document.removeEventListener('scroll', handleScroll);
    }, 100);
  }, [searchRef, setClasses]);

  useEffect(() => {
    setSearchSections(prev => prev.map(section =>
      section.step === STEPS.LOCATION
        ? {
          ...section,
          subtitle: mapLocation ? `${mapLocation.city}, ${mapLocation.state}` : "Trip Details"
        }
        : section
    ));
  }, [mapLocation]);

  useEffect(() => {
    setSearchSections(prev => prev.map(section =>
      section.step === STEPS.ACTIVITIES
        ? {
          ...section,
          subtitle: selectedActivities.length
            ? `${selectedActivities.length} ${selectedActivities.length === 1 ? 'activity' : 'activities'} selected`
            : "Location"
        }
        : section
    ));
  }, [selectedActivities]);

  useEffect(() => {
    const total = selectedGuests.adults + selectedGuests.children + selectedGuests.infants;
    setSearchSections(prev => prev.map(section =>
      section.step === STEPS.GUESTS
        ? {
          ...section,
          subtitle: total <= 1 ? '1 Guest' : `${total} Guests`
        }
        : section
    ));
  }, [selectedGuests]);

  useEffect(() => {
    setSearchSections(prev => prev.map(section =>
      section.step === STEPS.DATE
        ? {
          ...section,
          subtitle: startDate && endDate
            ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
            : 'Duration'
        }
        : section
    ));
  }, [startDate, endDate]);

  const handleSelect = (selectedStep: STEPS) => {
    setCurrStep(prevStep => prevStep === selectedStep ? null : selectedStep);
    setSearchSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        isSelected: section.step === selectedStep ? !section.isSelected : false
      }))
    );
  };

  const handleSubmit = () => {
    console.log('Search submitted');
    const form = {
      location: mapLocation,
      startDate,
      endDate,
      guests: selectedGuests,
      activities: selectedActivities,
      lodging
    }

    console.log(form);
  }

  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      language="en"
      region="EN"
      version="weekly">
      <div className={`items-center justify-between w-[720px] h-[82px] grid grid-cols-9 rounded-full neutral-01
          stroke-glass-01 glass-corner backdrop-filter backdrop-blur-md text-sm text-white text-left m-auto z-50
          transition-all duration-300 ease-in-out ${className}`} ref={searchRef}>
        {searchSections.map(({ step, title, subtitle, hasLine, isSelected }, index) => {
          const nextItemSelected = index < searchSections.length - 1 && searchSections[index + 1].isSelected;
          return (
            <section
              key={step}
              onClick={() => handleSelect(step)}
              id={step.toString()}
              className={`cursor-pointer z-10 h-full w-full col-span-2 flex flex-col justify-center gap-1 pl-8 pr-6 relative
                ${hasLine && !isSelected && !nextItemSelected ?
                  "after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2"
                  : ""}
                ${isSelected ? "border-2 border-white rounded-full" : ""}`}>
              <p>{title}</p>
              <p className="text-neutral-04">{subtitle}</p>
            </section>
          );
        })}

        <section className="px-2 col-span-1 h-full w-full flex justify-center items-center">
          <div className="w-full aspect-square relative rounded-full bg-white cursor-pointer
            transition-all duration-300 ease-in-out">
            <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black"
              onClick={handleSubmit} />
          </div>
        </section>
      </div>

      {currStep !== null && (
        <div className={`m-auto mt-4 glass-dark glass-corner backdrop-filter backdrop-blur-md stroke-glass-01
            before:rounded-3xl rounded-3xl flex flex-col justify-center items-center box-content w-[${dimensions.w}px]`}
          ref={stepsEle}>
          {currStep === STEPS.LOCATION && <LocationMenu
            mapLocation={mapLocation}
            setMapLocation={setMapLocation} />}
          {currStep === STEPS.DATE && <DateMenu
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />}
          {currStep === STEPS.GUESTS && <GuestMenu
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
          />}
          {currStep === STEPS.ACTIVITIES &&
            <ActivitiesMenu
              selectedActivities={selectedActivities}
              setSelectedActivities={setSelectedActivities}
              lodging={lodging}
              setLodging={setLodging}
            />
          }
        </div>
      )}
    </LoadScript>
  );
}
