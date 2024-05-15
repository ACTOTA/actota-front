import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useTowns from '@/app/hooks/useTowns';
import { STEPS } from '../../types/steps';
import useActivitiesModal from '@/app/hooks/useActivitiesModal';

// Assuming useSearchModal returns a function to close the modal
const Search = () => {
  const searchModal = useSearchModal();

  const params = useSearchParams();
  const { getByValue } = useTowns();

  const locationValue = params?.get('locationValue');
  const startDate = params?.get('startDate');
  const endDate = params?.get('endDate');
  const guestCount = params?.get('guestCount');
  const initialActivities = params?.get('activities');

  const [selectedActivities, setSelectedActivities] = useState<string[]>(initialActivities ? initialActivities.split(',') : []);
  const [selectedActivitiesCount, setSelectedActivitiesCount] = useState(selectedActivities.length);

  useEffect(() => {
    // This effect runs when `initialActivities` changes.
    const activitiesArray = initialActivities ? initialActivities.split(',') : [];
    setSelectedActivities(activitiesArray);
    setSelectedActivitiesCount(activitiesArray.length);
  }, [initialActivities]);

  const locationLabel = useMemo(() => locationValue ? getByValue(locationValue as string)?.label : 'Denver, CO', [locationValue, getByValue]);
  const durationLabel = useMemo(() => startDate && endDate ? `${differenceInDays(new Date(endDate), new Date(startDate)) || 1} Days` : 'Any Week', [startDate, endDate]);
  const guestLabel = useMemo(() => guestCount ? `${guestCount} Guests` : 'Add Guests', [guestCount]);
  const activitiesLabel = useMemo(() => selectedActivitiesCount > 0 ? `${selectedActivitiesCount} Activities` : 'Add Activities', [selectedActivitiesCount]);


  return (
    <div
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
          onClick={() => searchModal.onOpen(STEPS.LOCATION)}
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
          onClick={() => searchModal.onOpen(STEPS.DATE)}
        >
          {durationLabel}
        </div>
        <div
          className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600 "
          onClick={() => searchModal.onOpen(STEPS.INFO)}
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
            onClick={() => searchModal.onOpen(STEPS.ACTIVITIES)}
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
            <div className="icon-container">
              <BiSearch size={18} style={{ position: 'relative', zIndex: 1 }} />
              <div className="icon-gradient-outline">

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Search;
