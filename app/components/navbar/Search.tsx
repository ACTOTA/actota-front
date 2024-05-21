import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useTowns from '@/app/hooks/useTowns';
import { STEPS } from '../../types/steps';
import useActivitiesModal from '@/app/hooks/useActivitiesModal';

const Search = () => {
  const searchModal = useSearchModal();

  const params = useSearchParams();

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
        <div onClick={() => searchModal.onOpen(STEPS.LOCATION)}
          className="w-full px-6 text-sm font-semibold rounded-full cursor-pointer md:w-auto hover:bg-slate-200"
        >
          {searchModal.locationLabel}
        </div>
        <div onClick={() => searchModal.onOpen(STEPS.DATE)}
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
          {searchModal.durationLabel}
        </div>
        <div
          className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600 "
        >
          <div onClick={() => searchModal.onOpen(STEPS.INFO)}
            className="hidden sm:block">{searchModal.guestLabel}
          </div>
          <div onClick={() => searchModal.onOpen(STEPS.ACTIVITIES)}
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
            {searchModal.activitiesLabel}
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
            {searchModal.typeLabel}
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
    </div >
  );
}

export default Search;
