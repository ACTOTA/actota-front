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

      <div className="flex flex-row items-center justify-between w-[720px] h-[82px] rounded-full neutral-01
          stroke-glass-01 glass-corner backdrop-filter backdrop-blur-md border-none text-sm text-white text-left">
      <section onClick={() => searchModal.onOpen(STEPS.LOCATION)} className="hover:bg-slate-200 cursor-pointer px-10">
        <p>Where</p>
        <p className="">
          {searchModal.locationLabel}
        </p>
      </section>
      <section onClick={() => searchModal.onOpen(STEPS.DATE)} className="">
        <p>When</p>
        <p>{searchModal.durationLabel}</p>
      </section>
        <div
          className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
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
          
          <div className="w-[64px] h-[64px] relative bg-white rounded-full">
            <BiSearch size={24} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"/>
          </div>
        </div>

      </div>
  );
}

export default Search;
