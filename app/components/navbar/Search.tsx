import { useEffect, useState, useMemo, useRef, Dispatch, SetStateAction } from "react";
import { BiSearch } from 'react-icons/bi';

import { STEPS } from '../../types/steps';
import SearchBoxes from './SearchBoxes';
import { LoadScript } from '@react-google-maps/api';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

type SearchSection = {
  step: STEPS;
  title: string;
  subtitle: string;
  hasLine: boolean;
  isSelected: boolean;
}

export default function Search({ setClasses }: { setClasses?: Dispatch<SetStateAction<string>> }) {

  const [searchSections, setSearchSections] = useState<SearchSection[]>([
    { step: STEPS.LOCATION, title: "Where", subtitle: "Location", hasLine: true, isSelected: false },
    { step: STEPS.DATE, title: "When", subtitle: "Duration", hasLine: true, isSelected: false },
    { step: STEPS.GUESTS, title: "Who", subtitle: "Add Guests", hasLine: true, isSelected: false },
    { step: STEPS.ACTIVITIES, title: "What", subtitle: "Trip Details", hasLine: false, isSelected: false }
  ]);
  const [currStep, setCurrStep] = useState<STEPS | null>(null);
  const [className, setClassName] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const stepsEle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const searchElement = searchRef.current;
      if (!searchElement) return;

      const initialPosition = searchElement.getBoundingClientRect().top + window.scrollY;

      const handleScroll = () => {
        console.log('scrolling');
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


  const handleSelect = (selectedStep: STEPS) => {
    // Toggle the selected step
    setCurrStep(prevStep => prevStep === selectedStep ? null : selectedStep);

    // Update the searchSections to show which one is selected
    setSearchSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        isSelected: section.step === selectedStep ? !section.isSelected : false
      }))
    );
  };


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
        ${isSelected ? "border-2 border-white rounded-full" : ""}`}
            >
              <p>{title}</p>
              <p className="text-neutral-04">{subtitle}</p>
            </section>
          );
        })}


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
