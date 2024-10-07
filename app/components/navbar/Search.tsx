import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useTowns from '@/app/hooks/useTowns';
import { STEPS } from '../../types/steps';
import useActivitiesModal from '@/app/hooks/useActivitiesModal';
import SearchBoxes from './SearchBoxes';
import { LoadScript } from '@react-google-maps/api';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
const libs = ['places', 'drawing', 'visualization', 'marker'];

const Search = () => {
  const searchModal = useSearchModal();

  const [currStep, setCurrStep] = useState<STEPS | null>(null);
  const stepsEle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (currStep != null && stepsEle.current && !stepsEle.current.contains(event.target as Node)) {
        console.log('click outside');
        setCurrStep(null);
      } 
    }

    document.addEventListener('click', handleClick);

    return () => {
        document.removeEventListener('click', handleClick);
    };
  }, [currStep]);



  return (
    <LoadScript 
          googleMapsApiKey={API_KEY}
          libraries={libs}
          language="en"
          region="EN"
          version="weekly">
      <div className="items-center justify-between w-[720px] h-[82px] grid grid-cols-9 rounded-full neutral-01
          stroke-glass-01 glass-corner backdrop-filter backdrop-blur-md border-none text-sm text-white text-left">
        <section onClick={() => currStep != null ? setCurrStep(null) : setCurrStep(STEPS.LOCATION)} 
        className="cursor-pointer z-10 h-full w-full col-span-2 flex flex-col justify-center gap-1 pl-8 pr-6 relative 
        after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2">
          <p>Where</p>
          <p className="text-neutral-04">{searchModal.locationLabel}</p>
        </section>

        <section onClick={() => searchModal.onOpen(STEPS.DATE)} className="cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 pl-8 pr-6 relative
        after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2">
          <p >When</p>
          <p className="text-neutral-04">{searchModal.durationLabel}</p>
        </section>

        <section onClick={() => searchModal.onOpen(STEPS.INFO)} className="cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 pl-8 pr-6 relative
        after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[1px] after:bg-[#FFFFFF] after:-translate-y-1/2">
          <p>Who</p>
          <p className="text-neutral-04">Add Guests</p>
        </section>

        <section onClick={() => searchModal.onOpen(STEPS.ACTIVITIES)} className="cursor-pointer z-10 h-full w-full col-span-2
        flex flex-col justify-center gap-1 pl-8 pr-6">
          <p>What</p>
          <p className="text-neutral-04">Trip Details</p>
        </section>

        <section className="px-2 col-span-1">
          <div className="w-[64px] h-[64px] relative rounded-full bg-white cursor-pointer">
            <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-black"/>
          </div>
        </section>
      </div>

      {currStep != null && (
        <SearchBoxes step={currStep} reference={stepsEle}/>
      )}

      </LoadScript> 
  );
}

export default Search;
