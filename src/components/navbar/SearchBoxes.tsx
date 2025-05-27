import React from 'react';
import { STEPS } from '@/src/types/steps';
import { useEffect, useMemo, useState } from 'react';
import LocationMenu from './LocationMenu';
import DateMenu from './DateMenu';
import GuestMenu from './GuestMenu';
import ActivitiesMenu from './ActivitiesMenu';

type SearchBoxesProps = {
  step: STEPS;
  updateSearchValue?: (step: STEPS, value: string) => void;
  locationValue?: string;
  durationValue?: string;
  guestsValue?: string;
  activitiesValue?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SearchBoxes({
  step,
  updateSearchValue,
  locationValue,
  durationValue,
  guestsValue,
  activitiesValue,
  ...rest
}: SearchBoxesProps) {

  const dimensions = useMemo(() => {
    switch (step) {
      case STEPS.LOCATION:
        return { w: 584, h: 596 };
      case STEPS.GUESTS:
        return { w: 400, h: 290 };
      case STEPS.ACTIVITIES:
        return { w: 520, h: 304 };
      case STEPS.DATE:
        return { w: 720, h: 424 };
      default:
        return { w: 584, h: 596 };
    }
  }, [step]);

  return (
    <div className={`m-auto mt-4 max-lg:mt-0
        before:rounded-3xl rounded-3xl flex flex-col justify-center items-center box-content 
        max-lg:w-full
        w-full lg:w-[${dimensions.w}px] max-w-full mx-auto`} {...rest}>
      {step === STEPS.LOCATION &&
        <LocationMenu
          updateSearchValue={(value) => updateSearchValue?.(STEPS.LOCATION, value)}
          locationValue={locationValue}
          className='max-lg:bg-black max-lg:mt-0'
        />
      }

      {step === STEPS.DATE &&
        <DateMenu
          updateSearchValue={(value) => updateSearchValue?.(STEPS.DATE, value)}
          durationValue={durationValue}
          className='max-lg:bg-black max-lg:mt-0'
        />
      }

      {step === STEPS.GUESTS &&
        <GuestMenu
          updateSearchValue={(value) => updateSearchValue?.(STEPS.GUESTS, value)}
          guestsValue={guestsValue}
          className='max-lg:bg-black max-lg:mt-0'
        />
      }

      {step === STEPS.ACTIVITIES &&
        <ActivitiesMenu
          updateSearchValue={(value) => updateSearchValue?.(STEPS.ACTIVITIES, value)}
          activitiesValue={activitiesValue}
          className='max-lg:bg-black max-lg:mt-0'
        />
      }
    </div>
  )
}
