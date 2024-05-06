import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useTowns from '@/app/hooks/useTowns';
import useActivitiesModal from '@/app/hooks/useActivitiesModal';


const Search = () => {
  const searchModal = useSearchModal();
  const [search, setSearch] = useState(false);
  
  const params = useSearchParams();
  const { getByValue } = useTowns();

  const  locationValue = params?.get('locationValue'); 
  const  startDate = params?.get('startDate');
  const  endDate = params?.get('endDate');
  const  guestCount = params?.get('guestCount');

  const initialActivities = params?.get('activities');
  const [selectedActivitiesCount, setSelectedActivitiesCount] = useState<number>(initialActivities ? initialActivities.split(',').length : 0);

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }

    return 'Denver, CO';
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

  const activitiesLabel = useMemo(() => {
    if (selectedActivitiesCount > 0) {
      return `${selectedActivitiesCount} Activities`;
    }
    return 'Add Activities';
  }, [selectedActivitiesCount]);


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
          <div className="hidden sm:block">{guestLabel}
          </div>
          <div 
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
          {activitiesLabel}
        </div>
          <div 
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
            className="p-2 text-white rounded-full bg-logo-blue"
          >
            <BiSearch size={18} />
          </div>
        </div>
       
      </div>
    </div>
  );
}
 
export default Search;
