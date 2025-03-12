import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';

import { STEPS } from '@/src/types/steps';
import SearchBoxes from './SearchBoxes';
import { useRouter } from "next/navigation";

export default function Search({ setClasses, currStep, setCurrStep, navbar }: { setClasses?: Dispatch<SetStateAction<string>>, currStep?: STEPS | null, setCurrStep?: Dispatch<SetStateAction<STEPS | null>>, navbar?: boolean }) {
  const router = useRouter();
  const [className, setClassName] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  // State for search inputs
  const [locationValue, setLocationValue] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [guestsValue, setGuestsValue] = useState("");
  const [activitiesValue, setActivitiesValue] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchBar = document.getElementById('search-bar');
      const searchBox = document.getElementById('search-box');

      // Only close if click is outside both search-bar and search-box
      if (!searchBar?.contains(target) && !searchBox?.contains(target)) {
        setCurrStep?.(null);
      }
    };

    if (currStep !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currStep, setCurrStep]);

  const handleSelect = (step: STEPS) => {
    setCurrStep?.(step);
  }

  // Function to update state values from child components
  const updateSearchValue = (step: STEPS, value: string) => {
    switch (step) {
      case STEPS.LOCATION:
        setLocationValue(value);
        break;
      case STEPS.DATE:
        setDurationValue(value);
        break;
      case STEPS.GUESTS:
        setGuestsValue(value);
        break;
      case STEPS.ACTIVITIES:
        setActivitiesValue(value);
        break;
      default:
        break;
    }
  };
  
  // Function to get activity count for display
  const getActivityCount = (value: string | undefined, showDetails: boolean = false) => {
    if (!value) return showDetails ? "Trip Details" : "What";
    
    // Count the activities by splitting the comma-separated list
    const activities = value.split(',').filter(item => item.trim().length > 0);
    const count = activities.length;
    
    if (count === 0) return showDetails ? "Trip Details" : "What";
    
    if (showDetails) {
      // For the secondary text, show "n Activities"
      return `${count} ${count === 1 ? 'Activity' : 'Activities'}`;
    } else {
      // For the primary text, just show the count or "What"
      return count > 0 ? `${count}` : "What";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const searchElement = searchRef.current;
      if (!searchElement) return;

      const initialPosition = searchElement.getBoundingClientRect().top + window.scrollY;

      const handleScroll = () => {
        if (window.scrollY >= initialPosition && !navbar) {
          setClasses?.(' fixed top-[8px]  left-1/2 -translate-x-1/2  h-fit');
          setClassName('w-[580px] md:w-[640px] xl:w-[700px] 2xl:w-[720px] ');
        } else {
          setClasses?.('');
          setClassName('');
        }
      };

      document.addEventListener('scroll', handleScroll, { passive: true });
      return () => document.removeEventListener('scroll', handleScroll);
    }, 100);
  }, [searchRef, setClasses, navbar]);

  return (
    <div className="w-full relative" id="search-bar">
      <div className={`items-center justify-between ${navbar ? 'w-[420px] h-[60px] text-primary-gray' : 'w-[720px] max-md:w-[520px] max-sm:w-[360px] max-sm:h-[50px] max-md:h-[60px] h-[82px] text-white'} grid grid-cols-9 rounded-full border-2 border-border-primary
      bg-black/40 backdrop-filter backdrop-blur-sm text-sm text-left m-auto z-50
      transition-all duration-300 ease-in-out ${className}`} ref={searchRef}>

        <section onClick={() => handleSelect(STEPS.LOCATION)}
          id={STEPS.LOCATION.toString()}
          className={`
            ${currStep == STEPS.LOCATION ? 'border-2 border-white bg-black/50' : currStep !== STEPS.DATE && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'}
            rounded-full cursor-pointer z-10 h-full w-full col-span-2
            flex flex-col justify-center gap-1 text-center relative
          `}>
          <p>{locationValue ? locationValue.split(',')[0] : "Where"}</p>
          {!navbar && (
            <p className="text-primary-gray max-md:hidden">
              {locationValue || "Location"}
            </p>
          )}
        </section>

        <section onClick={() => handleSelect(STEPS.DATE)}
          id={STEPS.DATE.toString()}
          className={`${currStep == STEPS.DATE ? 'border-2 border-white bg-black/50' : currStep !== STEPS.GUESTS && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center relative`}>
          <p>{durationValue ? durationValue.split(' ')[0] : "When"}</p>
          {!navbar && (
            <p className="text-primary-gray max-md:hidden">
              {durationValue || "Duration"}
            </p>
          )}
        </section>

        <section onClick={() => handleSelect(STEPS.GUESTS)}
          id={STEPS.GUESTS.toString()}
          className={`${currStep == STEPS.GUESTS ? 'border-2 border-white bg-black/50' : currStep !== STEPS.ACTIVITIES && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center relative
       `}>
          <p>{guestsValue ? guestsValue.split(' ')[0] : "Who"}</p>
          {!navbar && (
            <p className="text-primary-gray max-md:hidden">
              {guestsValue || "Add Guests"}
            </p>
          )}
        </section>

        <section onClick={() => handleSelect(STEPS.ACTIVITIES)}
          id={STEPS.ACTIVITIES.toString()}
          className={`${currStep == STEPS.ACTIVITIES ? 'border-2 border-white bg-black/50' : ' border-transparent'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center `}>
          <p>{getActivityCount(activitiesValue)}</p>
          {!navbar && (
            <p className="text-primary-gray max-md:hidden">
              {getActivityCount(activitiesValue, true)}
            </p>
          )}
        </section>

        <section className={`${navbar ? ' h-[55px] w-[55px] pr-1 -ml-2' : ' max-md:h-[55px] max-md:w-[55px] max-sm:h-[45px] max-sm:w-[45px] max-md:pr-1 max-md:-ml-2 h-full w-full px-2'} col-span-1 flex justify-center items-center`}>
          <div onClick={() => router.push('/itineraries')} className="w-full aspect-square relative rounded-full bg-white cursor-pointer
            transition-all duration-300 ease-in-out">
            <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black" />
          </div>
        </section>
      </div>

      {currStep != null && (
        <div id='search-box' className="w-full">
          <SearchBoxes 
            step={currStep} 
            updateSearchValue={updateSearchValue}
            locationValue={locationValue}
            durationValue={durationValue}
            guestsValue={guestsValue}
            activitiesValue={activitiesValue}
          />
        </div>
      )}
    </div>
  );
}
