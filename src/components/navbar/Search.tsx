import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';

import { STEPS } from '@/src/types/steps';
import SearchBoxes from './SearchBoxes';
import { useRouter } from "next/navigation";

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

      // Only close if click is outside both search-bar and search-box
      if (searchBar && searchBox && !searchBar.contains(target) && !searchBox.contains(target)) {
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
      {/* Subtle backdrop for mobile when search boxes are open */}
      {currStep !== null && !navbar && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setCurrStep?.(null)}></div>
      )}

      <div className={`relative ${navbar ? '' : 'max-lg:fixed max-lg:bottom-5 max-lg:h-[60px] max-lg:left-0 max-lg:right-0 max-lg:px-4 max-lg:z-50 max-lg:pb-2'}`} id="search-bar">
        <div className={`items-center justify-between ${navbar ? 'w-[500px] h-[60px] text-primary-gray max-2xl:h-[60px]' : 'w-[720px] max-lg:w-full max-lg:h-[64px] max-lg:mx-0 text-white'} 
        ${isTop && !navbar ? 'h-[82px]' : 'h-[60px]'}
        grid grid-cols-9 
        ${navbar ? 'rounded-full border-2 border-border-primary bg-black/40 backdrop-filter backdrop-blur-sm' : 'max-lg:rounded-2xl max-lg:bg-black/80 max-lg:backdrop-blur-md max-lg:border max-lg:border-gray-600 lg:rounded-full lg:border-2 lg:border-border-primary lg:bg-black/40 lg:backdrop-filter lg:backdrop-blur-sm'}
        text-sm text-left m-auto z-50
        shadow-lg max-lg:shadow-2xl
        transition-all duration-300 ease-in-out ${className}`} ref={searchRef}>

          <section onClick={() => handleSelect(STEPS.LOCATION)}
            id={STEPS.LOCATION.toString()}
            className={`
            ${currStep == STEPS.LOCATION ? 'border-2 border-white bg-black/50' : currStep !== STEPS.DATE && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'}
            rounded-full cursor-pointer z-10 h-full w-full col-span-2
            flex flex-col justify-center gap-1 text-center relative
          `}>
            <p>{locationValue.length > 0 ? locationValue[0] : "Where"}</p>
            {!navbar && (
              <p className="text-primary-gray max-md:hidden">
                {locationValue.length > 0 ? locationValue[0] : "Location"}
              </p>
            )}
          </section>

          <section onClick={() => handleSelect(STEPS.DATE)}
            id={STEPS.DATE.toString()}
            className={`${currStep == STEPS.DATE ? 'border-2 border-white bg-black/50' : currStep !== STEPS.GUESTS && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center relative`}>
            <p>{durationValue.length > 0 ? durationValue[0].split(' ')[0] : "When"}</p>
            {!navbar && (
              <p className="text-primary-gray max-md:hidden">
                {durationValue.length > 0 ? durationValue[0] : "Duration"}
              </p>
            )}
          </section>

          <section onClick={() => handleSelect(STEPS.GUESTS)}
            id={STEPS.GUESTS.toString()}
            className={`${currStep == STEPS.GUESTS ? 'border-2 border-white bg-black/50' : currStep !== STEPS.ACTIVITIES && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center relative
       `}>
            <p>{guestsValue.length > 0 ? guestsValue[0].split(' ')[0] : "Who"}</p>
            {!navbar && (
              <p className="text-primary-gray max-md:hidden">
                {guestsValue.length > 0 ? guestsValue[0] : "Add Guests"}
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

          <section className={`${navbar ? ' h-[55px] w-[55px] pr-1 -ml-2' : 'm-auto max-2xl:h-[58px] max-2xl:w-[58px] max-md:h-[55px] max-md:w-[55px] max-sm:h-[45px] max-sm:w-[45px] max-md:pr-1 max-md:-ml-2 h-full w-full px-2'} col-span-1 flex justify-center items-center`}>
            <div onClick={() => handleSearch()} className="w-full aspect-square relative rounded-full bg-white cursor-pointer m-auto
            transition-all duration-300 ease-in-out">
              <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black" />
            </div>
          </section>
        </div>

        {currStep != null && (
          <div 
            id='search-box' 
            className={`
              w-full 
              lg:absolute lg:top-[calc(100%+10px)] lg:left-1/2 lg:-translate-x-1/2 lg:w-[720px]
              max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:z-[60]
              max-lg:bg-black max-lg:rounded-t-3xl max-lg:pt-3 max-lg:px-4 max-lg:pb-6
              max-lg:shadow-2xl max-lg:border-t max-lg:border-gray-600
              max-lg:animate-slide-up max-lg:min-h-[50vh] max-lg:max-h-[80vh]
              mt-4 lg:mt-0
            `}
            style={{
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Mobile handle indicator - swipe to dismiss */}
            <div 
              className="lg:hidden flex justify-center mb-4 cursor-pointer"
              onClick={() => setCurrStep?.(null)}
            >
              <div className="w-12 h-1 bg-gray-500 rounded-full hover:bg-gray-400 transition-colors"></div>
            </div>
            
            <div className="max-lg:text-white">
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
        )}
      </div>
    </>
  );
}
