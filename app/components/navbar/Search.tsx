import { useEffect, useState, useMemo, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';

import { STEPS } from '../../types/steps';
import SearchBoxes from './SearchBoxes';
import { LoadScript } from '@react-google-maps/api';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';


export default function Search({ setClasses }: { setClasses?: Dispatch<SetStateAction<string>> }) {

  const [currStep, setCurrStep] = useState<STEPS | null>(null);
  const [className, setClassName] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const stepsEle = useRef<HTMLDivElement>(null);

  const selectedClasses = useMemo(() => {
    return ['border-solid', 'border-[2px]', 'border-[#FFF]', 'rounded-full'];
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      console.log("currStep", currStep);
      console.log("stepsEle", stepsEle.current);

      const targetEle = event.target as HTMLElement;

      if ((stepsEle.current && !stepsEle.current.contains(event.target as Node)
        || !stepsEle.current) || targetEle.id == currStep?.toString()) {
        console.log('click outside');

        setCurrStep(null);
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [currStep, selectedClasses]);

  const handleSelect = (step: STEPS) => {
    const ele = document.getElementById(step.toString());
    // if (ele) {
    //   step == currStep ? ele.classList.remove(...selectedClasses, 'after:hidden') : ele.classList.add(...selectedClasses, 'after:hidden');
    // }

    console.log("step", step);
    currStep != null ? setCurrStep(null) : setCurrStep(step);

  }


  useEffect(() => {
    setTimeout(() => {
      const searchElement = searchRef.current;
      if (!searchElement) return;

      const initialPosition = searchElement.getBoundingClientRect().top + window.scrollY;

      const handleScroll = () => {
        console.log('scrolling');
        if (window.scrollY >= initialPosition) {
          setClasses('fixed top-0 left-1/2 -translate-x-1/2');
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





  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      libraries={['places', 'drawing', 'visualization', 'marker']}
      language="en"
      region="EN"
      version="weekly">
      <div className={`items-center justify-between w-[720px] h-[82px] grid grid-cols-9 rounded-full neutral-01
          stroke-glass-01 glass-corner backdrop-filter backdrop-blur-md text-sm text-white text-left m-auto z-50
          transition-all duration-300 ease-in-out ${className}`} ref={searchRef}>
        <section onClick={() => handleSelect(STEPS.LOCATION)}
          id={STEPS.LOCATION.toString()}
          className="cursor-pointer z-10 h-full w-full col-span-2 flex flex-col justify-center gap-1 pl-8 pr-6 relative 
        after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2">
          <p>Where</p>
          <p className="text-neutral-04">Location</p>
        </section>

        <section onClick={() => handleSelect(STEPS.DATE)}
          id={STEPS.DATE.toString()}
          className="cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 pl-8 pr-6 relative
        after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2">
          <p >When</p>
          <p className="text-neutral-04">Duration</p>
        </section>

        <section onClick={() => handleSelect(STEPS.GUESTS)}
          id={STEPS.GUESTS.toString()}
          className="cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 pl-8 pr-6 relative
        after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2">
          <p>Who</p>
          <p className="text-neutral-04">Add Guests</p>
        </section>

        <section onClick={() => handleSelect(STEPS.ACTIVITIES)}
          id={STEPS.ACTIVITIES.toString()}
          className="cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 pl-8 pr-6">
          <p>What</p>
          <p className="text-neutral-04">Trip Details</p>
        </section>

        <section className="px-2 col-span-1 h-full w-full flex justify-center items-center">
          <div className="w-full aspect-square relative rounded-full bg-white cursor-pointer
            transition-all duration-300 ease-in-out">
            <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black" />
          </div>
        </section>
      </div>

      {currStep != null && (
        <SearchBoxes step={currStep} reference={stepsEle} />
      )}

    </LoadScript>
  );
}
