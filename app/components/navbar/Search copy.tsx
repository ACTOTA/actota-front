'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useCountries from '@/app/hooks/useCountries';

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const  locationValue = params?.get('locationValue'); 
  const  startDate = params?.get('startDate');
  const  endDate = params?.get('endDate');
  const  guestCount = params?.get('guestCount');

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }

    return 'Anywhere';
  }, [locationValue, getByValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);

      if (diff === 0) {
        diff = 1;
      }

      return `${diff} Days`;
    }

    return 'Any Week'
  }, [startDate, endDate]);

  const guestLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} Guests`;
    }

    return 'Add Guests';
  }, [guestCount]);

  return ( 
    <div
      onClick={searchModal.onOpen}
      className="
        border-[1px] 
        w-full 
        md:w-auto 
        py-2 
        rounded-full 
        shadow-sm 
        hover:shadow-md 
        transition 
        cursor-pointer
      "
    >
      <div 
        className="flex flex-row items-center justify-between "
      >
        <div 
          className="px-6 text-sm font-semibold "
        >
          {locationLabel}
        </div>
        <div 
          className="
            hidden 
            sm:block 
            text-sm 
            font-semibold 
            px-6 
            border-x-[1px] 
            flex-1 
            text-center
          "
        >
          {durationLabel}
        </div>
        <div 
          className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600 "
        >
          <div className="hidden sm:block">{guestLabel}</div>
          <div 
            className="p-2 text-white rounded-full bg-rose-500"
          >
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Search;



'use client';
import { useCallback, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import useLoginModal from "@/app/hooks/useLoginModal";

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';

import useTowns from "@/app/hooks/useTowns";

import ActivitiesModal from "../modals/ActivitiesModal";
import useActivitiesModal from "@/app/hooks/useActivitiesModal";

import TypesModal from "../modals/TypesModal";
import useTypesModal from "@/app/hooks/useTypesModal";
import { types } from "util";
import useSearchModal from "@/app/hooks/useSearchModal";


const Search = () => {
    const SearchModal = useSearchModal();
    
    const [search, setSearch] = useState(false);
    const activitiesModal = useActivitiesModal();
    const typesModal = useTypesModal();
    const loginModal = useLoginModal();

    const handleClick = useCallback(() => {

        setSearch(!search);
        console.log("search: ", search);

        if(search) {
            activitiesModal.onOpen();
        }
    
    }, [search, activitiesModal]); 
    

    return (  
        <div
            className="
                boarder-[1px]
                w-full
                md:w-auto
                py-2
                rounded-full
                shadow-sm
                hover:shadow-md
                transistion
                cursor-pointer
            "
        >
            <div
                className="flex flex-row items-center justify-between "
                >
                <div
                className="h-full px-6 text-sm font-semibold "
                >
                Denver, CO
                </div>
                <div
                className="
                    hidden
                    sm:block
                    text-sm
                    font-semibold
                    px-6
                    border-x-[1px]
                    flex-1
                    text-center
                "
                >
                Any Week
                </div>
                <div onClick={activitiesModal.onOpen}
                    className="
                        hidden
                        sm:block
                        text-sm
                        text-black-600
                        font-semibold
                        px-6
                        border-r-[1px]
                        flex-1
                        text-center
                    "
                >
                Any Activities
                </div>

                <div onClick={typesModal.onOpen}
                className="
                    hidden
                    sm:block
                    text-sm
                    font-semibold
                    px-6
                    border-r-[1px]
                    flex-1
                    text-center
                "
                >
                Any Type
                </div>
                <div
                    className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600 "
                >

                
                <div 
                    className="hidden sm:block"
                >
                Add Guests
                </div>
                    <div
                        className="p-2 text-white rounded-full bg-logo-blue"
                    >
                        <BiSearch onClick={() => console.log("clicked")} size={18}/>
                    </div>
                </div>
                <ActivitiesModal />
                <TypesModal />
            </div>
        </div>
    );
}


export default Search;