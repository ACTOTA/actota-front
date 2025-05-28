import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import { RiMapPinLine } from 'react-icons/ri';
import { MdLocationOn, MdDateRange, MdPeople, MdLocalActivity } from 'react-icons/md';

import { STEPS } from '@/src/types/steps';
import SearchBoxes from './SearchBoxes';
import { useRouter } from "next/navigation";
import GlassPanel from '../figma/GlassPanel';

export default function Search({ setClasses, currStep, setCurrStep, navbar }: { setClasses?: Dispatch<SetStateAction<string>>, currStep?: STEPS | null, setCurrStep?: Dispatch<SetStateAction<STEPS | null>>, navbar?: boolean }) {
  const router = useRouter();
  const [className, setClassName] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const [isTop, setIsTop] = useState(true);

  // State for search inputs
  const [locationValue, setLocationValue] = useState<string[]>([]);
  const [durationValue, setDurationValue] = useState<string[]>([]);
  const [guestsValue, setGuestsValue] = useState<string[]>([]);
  const [activitiesValue, setActivitiesValue] = useState<string[]>([]);

  // Touch/swipe handling for mobile bottom sheet
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -50; // At least 50px down swipe
    
    if (isDownSwipe) {
      setCurrStep?.(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchBar = document.getElementById('search-bar');
      const searchBox = document.getElementById('search-box');
      const bottomNav = target.closest('.bottom-nav-tabs');

      // Only close if click is outside search-bar, search-box, and bottom navigation
      if (searchBar && searchBox && !searchBar.contains(target) && !searchBox.contains(target) && !bottomNav) {
        setCurrStep?.(null);
      }
    };

    // Add a short delay before adding the click listener to prevent immediate closure
    let timeoutId: NodeJS.Timeout;

    if (currStep !== null) {
      timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      clearTimeout(timeoutId);
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
        setLocationValue(value ? [value] : []);
        break;
      case STEPS.DATE:
        setDurationValue(value ? [value] : []);
        break;
      case STEPS.GUESTS:
        setGuestsValue(value ? [value] : []);
        break;
      case STEPS.ACTIVITIES:
        // Split the comma-separated string into an array of values
        setActivitiesValue(value ? value.split(',').map(item => item.trim()).filter(item => item.length > 0) : []);
        break;
      default:
        break;
    }
  };

  // Function to handle search submission
  const handleSearch = () => {
    console.log('Search button clicked with values:', {
      locations: locationValue,
      duration: durationValue,
      guests: guestsValue,
      activities: activitiesValue,
    });

    // Collect search parameters and encode them for URL
    const params = new URLSearchParams();

    // Handle array values by adding each item with the same parameter name
    if (locationValue.length > 0) {
      locationValue.forEach(loc => params.append('location', loc));
    }

    if (durationValue.length > 0) {
      durationValue.forEach(dur => params.append('duration', dur));
    }

    if (guestsValue.length > 0) {
      guestsValue.forEach(guest => params.append('guests', guest));
    }

    if (activitiesValue.length > 0) {
      activitiesValue.forEach(activity => params.append('activities', activity));
    }

    console.log('Search parameters:', params.toString());
    // Redirect to itineraries page with search params
    router.push(`/itineraries?${params.toString()}`);
  };

  // Function to get activity count for display
  const getActivityCount = (activities: string[], showDetails: boolean = false) => {
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
        // Only apply scroll-based positioning on desktop screens
        if (window.innerWidth >= 1024) {
          if (window.scrollY >= initialPosition && !navbar) {
            // Set fixed position for large screens
            setClasses?.('fixed top-[8px] left-1/2 -translate-x-1/2 h-[60px]');
            setClassName('w-[580px] md:w-[640px] xl:w-[700px] 2xl:w-[720px] h-[60px]');
            setIsTop(false);
          } else {
            setClasses?.('');
            setClassName('');
            setIsTop(true);
          }
        } else {
          // On mobile, no special positioning needed
          setClasses?.('');
          setClassName('');
          setIsTop(true);
        }
      };

      // Initial check
      handleScroll();

      // Also listen for window resize
      const handleResize = () => {
        handleScroll();
      };

      window.addEventListener('resize', handleResize);
      document.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        document.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }, 100);
  }, [searchRef, setClasses, navbar]);

  return (
    <>
      {/* Backdrop for mobile when search is active */}
      {currStep != null && !navbar && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setCurrStep?.(null)}
        />
      )}

      <div 
        className={`relative ${navbar ? '' : `max-lg:fixed max-lg:left-0 max-lg:right-0 max-lg:z-50 max-lg:transition-all max-lg:duration-300 ${currStep != null ? 'max-lg:bottom-0 max-lg:px-2' : 'max-lg:bottom-5 max-lg:px-4'}`}`} 
        id="search-bar"
        onTouchStart={currStep != null ? handleTouchStart : undefined}
        onTouchMove={currStep != null ? handleTouchMove : undefined}
        onTouchEnd={currStep != null ? handleTouchEnd : undefined}
      >
        <div className={`relative ${currStep != null && !navbar ? 'max-lg:overflow-visible' : ''}`}>
          <GlassPanel
            variant={navbar ? 'default' : 'light'}
            blur="xl"
            padding="none"
            rounded={navbar ? 'full' : currStep != null ? '3xl' : 'full'}
            className={`
              ${navbar ? 'w-[500px] h-[60px] text-primary-gray max-2xl:h-[60px]' : 'w-[760px] max-lg:w-full text-white'} 
              ${isTop && !navbar ? 'h-[86px]' : 'h-[66px]'}
              ${currStep != null && !navbar ? 'max-lg:h-auto max-lg:max-h-[90vh]' : 'max-lg:h-[64px]'}
              m-auto z-50
              ${currStep != null && !navbar ? 'max-lg:transition-[height,max-height] max-lg:duration-300' : 'transition-all duration-300'} 
              ease-in-out ${className}
            `} 
            ref={searchRef}
          >
          {/* Mobile expanded content */}
          {currStep != null && !navbar && (
            <div className="lg:hidden">
              {/* Search options content */}
              <div className="pt-3 px-4 pb-4 max-h-[70vh] overflow-y-auto">
                {/* Mobile header with current selection */}
                <div>
                  <div 
                    className="flex justify-center mb-2 cursor-pointer"
                    onClick={() => setCurrStep?.(null)}
                  >
                    <div className="w-12 h-1 bg-white/40 rounded-full hover:bg-white/60 transition-colors"></div>
                  </div>
                  
                  {/* Selection header */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/20">
                    <button 
                      onClick={() => setCurrStep?.(null)}
                      className="text-white/60 hover:text-white transition-colors p-2 -ml-2"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <h3 className="text-white text-lg font-semibold">
                      {currStep === STEPS.LOCATION && "Select Location"}
                      {currStep === STEPS.DATE && "Select Dates"}
                      {currStep === STEPS.GUESTS && "Add Guests"}
                      {currStep === STEPS.ACTIVITIES && "Choose Activities"}
                    </h3>
                    
                    <div className="w-10"></div> {/* Spacer for centering */}
                  </div>
                </div>
                
                <div className="text-white">
                  <SearchBoxes
                    step={currStep}
                    updateSearchValue={updateSearchValue}
                    locationValue={locationValue.length > 0 ? locationValue[0] : ""}
                    durationValue={durationValue.length > 0 ? durationValue[0] : ""}
                    guestsValue={guestsValue.length > 0 ? guestsValue[0] : ""}
                    activitiesValue={activitiesValue.length > 0 ? activitiesValue.join(", ") : ""}
                  />
                </div>
              </div>
              
              {/* Divider line */}
              <div className="h-px bg-white/20"></div>
            </div>
          )}
          
          {/* Search bar - always visible */}
          <div className={`
            ${currStep != null && !navbar ? 'max-lg:p-2' : ''} 
            ${navbar || currStep == null ? 'grid grid-cols-9 h-full' : 'lg:grid lg:grid-cols-9 lg:h-full'} 
            ${currStep != null && !navbar ? 'max-lg:grid max-lg:grid-cols-9 max-lg:h-[60px]' : ''}
            items-center justify-between text-sm text-left transition-all duration-300
          `}>

          <section onClick={() => handleSelect(STEPS.LOCATION)}
            id={STEPS.LOCATION.toString()}
            className={`
            ${currStep == STEPS.LOCATION ? 'lg:border-2 lg:border-white lg:bg-white/10' : currStep !== STEPS.DATE && 'lg:after:content-[""] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-8 lg:after:w-[1px] lg:after:bg-white/20 lg:after:-translate-y-1/2'}
            rounded-full cursor-pointer z-10 h-full w-full col-span-2
            flex flex-col justify-center gap-0.5 px-4 relative
            hover:bg-white/5 transition-all duration-200
          `}>
            <div className="flex items-center gap-2 max-md:justify-center">
              <MdLocationOn className={`w-4 h-4 ${currStep != null && !navbar ? '' : 'max-md:hidden'} ${locationValue.length > 0 ? 'text-white/80' : 'text-white/40'}`} />
              <div className="max-md:text-center">
                <p className={`font-medium ${locationValue.length > 0 ? 'text-white' : 'text-white/90'} ${currStep != null && !navbar ? 'max-md:text-xs' : ''}`}>
                  {locationValue.length > 0 ? locationValue[0].split(',')[0] : "Where"}
                </p>
                {!navbar && currStep == null && (
                  <p className="text-xs text-white/60 max-md:hidden truncate">
                    {locationValue.length > 0 ? locationValue[0].split(',')[1]?.trim() || 'Selected' : "Search destinations"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section onClick={() => handleSelect(STEPS.DATE)}
            id={STEPS.DATE.toString()}
            className={`${currStep == STEPS.DATE ? 'lg:border-2 lg:border-white lg:bg-white/10' : currStep !== STEPS.GUESTS && 'lg:after:content-[""] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-8 lg:after:w-[1px] lg:after:bg-white/20 lg:after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-0.5 px-4 relative
        hover:bg-white/5 transition-all duration-200`}>
            <div className="flex items-center gap-2 max-md:justify-center">
              <MdDateRange className={`w-4 h-4 ${currStep != null && !navbar ? '' : 'max-md:hidden'} ${durationValue.length > 0 ? 'text-white/80' : 'text-white/40'}`} />
              <div className="max-md:text-center">
                <p className={`font-medium ${durationValue.length > 0 ? 'text-white' : 'text-white/90'} ${currStep != null && !navbar ? 'max-md:text-xs' : ''}`}>
                  {durationValue.length > 0 ? durationValue[0].split(' ')[0] : "When"}
                </p>
                {!navbar && currStep == null && (
                  <p className="text-xs text-white/60 max-md:hidden">
                    {durationValue.length > 0 ? `${durationValue[0].split(' ').slice(1).join(' ')}` : "Add dates"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section onClick={() => handleSelect(STEPS.GUESTS)}
            id={STEPS.GUESTS.toString()}
            className={`${currStep == STEPS.GUESTS ? 'lg:border-2 lg:border-white lg:bg-white/10' : currStep !== STEPS.ACTIVITIES && 'lg:after:content-[""] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-8 lg:after:w-[1px] lg:after:bg-white/20 lg:after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-0.5 px-4 relative
        hover:bg-white/5 transition-all duration-200
       `}>
            <div className="flex items-center gap-2 max-md:justify-center">
              <MdPeople className={`w-4 h-4 ${currStep != null && !navbar ? '' : 'max-md:hidden'} ${guestsValue.length > 0 ? 'text-white/80' : 'text-white/40'}`} />
              <div className="max-md:text-center">
                <p className={`font-medium ${guestsValue.length > 0 ? 'text-white' : 'text-white/90'} ${currStep != null && !navbar ? 'max-md:text-xs' : ''}`}>
                  {guestsValue.length > 0 ? guestsValue[0].split(' ')[0] : "Who"}
                </p>
                {!navbar && currStep == null && (
                  <p className="text-xs text-white/60 max-md:hidden">
                    {guestsValue.length > 0 ? `${guestsValue[0].split(' ').slice(1).join(' ')}` : "Add guests"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section onClick={() => handleSelect(STEPS.ACTIVITIES)}
            id={STEPS.ACTIVITIES.toString()}
            className={`${currStep == STEPS.ACTIVITIES ? 'lg:border-2 lg:border-white lg:bg-white/10' : ' border-transparent'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-0.5 px-4 relative
        hover:bg-white/5 transition-all duration-200`}>
            <div className="flex items-center gap-2 max-md:justify-center">
              <MdLocalActivity className={`w-4 h-4 ${currStep != null && !navbar ? '' : 'max-md:hidden'} ${activitiesValue.length > 0 ? 'text-white/80' : 'text-white/40'}`} />
              <div className="max-md:text-center">
                <p className={`font-medium ${activitiesValue.length > 0 ? 'text-white' : 'text-white/90'} ${currStep != null && !navbar ? 'max-md:text-xs' : ''}`}>
                  {activitiesValue.length > 0 ? `${activitiesValue.length} Activities` : "What"}
                </p>
                {!navbar && currStep == null && (
                  <p className="text-xs text-white/60 max-md:hidden truncate">
                    {activitiesValue.length > 0 ? activitiesValue.slice(0, 2).join(", ") + (activitiesValue.length > 2 ? "..." : "") : "Choose activities"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={`${navbar ? ' h-[55px] w-[55px] pr-1 -ml-2' : 'm-auto h-[52px] w-[52px] lg:h-[56px] lg:w-[56px] max-md:h-[55px] max-md:w-[55px] max-sm:h-[45px] max-sm:w-[45px] max-md:pr-1 max-md:-ml-2'} col-span-1 flex justify-center items-center`}>
            <div onClick={() => handleSearch()} className="w-full h-full relative rounded-full bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer
            hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out
            shadow-lg hover:shadow-xl transform hover:scale-105">
              <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white" />
            </div>
          </section>
          </div>
        </GlassPanel>

        {currStep != null && (
          <>
            {/* Desktop search box */}
            <div 
              id='search-box' 
              className="hidden lg:block absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[720px] mt-4"
            >
              <SearchBoxes
                step={currStep}
                updateSearchValue={updateSearchValue}
                locationValue={locationValue.length > 0 ? locationValue[0] : ""}
                durationValue={durationValue.length > 0 ? durationValue[0] : ""}
                guestsValue={guestsValue.length > 0 ? guestsValue[0] : ""}
                activitiesValue={activitiesValue.length > 0 ? activitiesValue.join(", ") : ""}
              />
            </div>

          </>
        )}
        </div>
      </div>
    </>
  );
}
