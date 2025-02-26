import { useEffect, useState, useMemo, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';

import { STEPS } from '@/src/types/steps';
import SearchBoxes from './SearchBoxes';
import { LoadScript } from '@react-google-maps/api';
import { useRouter } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

export default function Search({ setClasses, currStep, setCurrStep, navbar }: { setClasses?: Dispatch<SetStateAction<string>>, currStep?: STEPS | null, setCurrStep?: Dispatch<SetStateAction<STEPS | null>>, navbar?: boolean }) {
  const router = useRouter();
  const [className, setClassName] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchBar = document.getElementById('search-bar');
      const searchBox = document.getElementById('search-box');

      // Only close if click is outside both search-bar and search-box
      if (!searchBar?.contains(target) && !searchBox?.contains(target)) {
        console.log('click outside');
        setCurrStep?.(null);
      }
    };

    if (currStep !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currStep]);
  const handleSelect = (step: STEPS) => {
    const ele = document.getElementById(step.toString());
    // if (ele) {
    //   step == currStep ? ele.classList.remove(...selectedClasses, 'after:hidden') : ele.classList.add(...selectedClasses, 'after:hidden');
    // }

    console.log("step", step);
    // currStep != null ? setCurrStep?.(null) : setCurrStep?.(step);
    setCurrStep?.(step);

  }


  useEffect(() => {
    setTimeout(() => {
      const searchElement = searchRef.current;
      if (!searchElement) return;

      const initialPosition = searchElement.getBoundingClientRect().top + window.scrollY;

      const handleScroll = () => {
        console.log('scrolling');
        if (window.scrollY >= initialPosition && !navbar) {
          console.log('reached initial position');
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
  }, [searchRef, setClasses]);





  return (
    <div className="w-full  relative" id="search-bar">
      {/* <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={['places', 'drawing', 'visualization', 'marker']}
        language="en"
        region="EN"
        version="weekly"> */}

        <div className={`items-center    justify-between ${navbar ? 'w-[420px]   h-[60px] text-primary-gray' : 'w-[720px] max-md:w-[520px] max-sm:w-[360px] max-sm:h-[50px] max-md:h-[60px] h-[82px] text-white'}  grid grid-cols-9 rounded-full border-2 border-border-primary
      bg-black/40 backdrop-filter  backdrop-blur-sm text-sm  text-left m-auto z-50
          transition-all duration-300 ease-in-out ${className}`} ref={searchRef}>

          <section onClick={() => handleSelect(STEPS.LOCATION)}
            id={STEPS.LOCATION.toString()}
            className={`
            ${currStep == STEPS.LOCATION ? 'border-2 border-white bg-black/50' : currStep !== STEPS.DATE && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'}
            rounded-full cursor-pointer z-10 h-full w-full col-span-2
            flex flex-col justify-center gap-1 text-center relative
          `}>
            <p>Where</p>
            {!navbar && <p className="text-primary-gray max-md:hidden">Location</p>}
          </section>

          <section onClick={() => handleSelect(STEPS.DATE)}
            id={STEPS.DATE.toString()}
            className={`${currStep == STEPS.DATE ? 'border-2 border-white bg-black/50' : currStep !== STEPS.GUESTS && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center relative`}>
            <p >When</p>
            {!navbar && <p className="text-primary-gray max-md:hidden">Duration</p>}
          </section>

          <section onClick={() => handleSelect(STEPS.GUESTS)}
            id={STEPS.GUESTS.toString()}
            className={`${currStep == STEPS.GUESTS ? 'border-2 border-white bg-black/50' : currStep !== STEPS.ACTIVITIES && 'after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center relative
       `}>
            <p>Who</p>
            {!navbar && <p className="text-primary-gray max-md:hidden">Add Guests</p>}
          </section>

          <section onClick={() => handleSelect(STEPS.ACTIVITIES)}
            id={STEPS.ACTIVITIES.toString()}
            className={`${currStep == STEPS.ACTIVITIES ? 'border-2 border-white bg-black/50' : ' border-transparent'} rounded-full cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 text-center `}>
            <p>What</p>
            {!navbar && <p className="text-primary-gray max-md:hidden">Trip Details</p>}
          </section>

          <section className={`${navbar ? ' h-[55px] w-[55px] pr-1  -ml-2' : ' max-md:h-[55px] max-md:w-[55px] max-sm:h-[45px] max-sm:w-[45px] max-md:pr-1  max-md:-ml-2  h-full w-full px-2'} col-span-1 flex justify-center items-center`}>
            <div onClick={() => router.push('/itineraries')} className="w-full aspect-square relative rounded-full bg-white cursor-pointer
            transition-all duration-300 ease-in-out">
              <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black" />
            </div>
          </section>
        </div>

        {currStep != null && (

          <div id='search-box' className="w-full">
            <SearchBoxes step={currStep} />
          </div>
        )}

      {/* </LoadScript > */}
    </div>

  );
}
