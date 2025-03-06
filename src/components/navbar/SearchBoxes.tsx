import React from 'react';
import { STEPS } from '@/src/types/steps';
import { useEffect, useMemo, useState } from 'react';
import LocationMenu from './LocationMenu';
import DateMenu from './DateMenu';
import GuestMenu from './GuestMenu';
import ActivitiesMenu from './ActivitiesMenu';
import { LoadScript } from '@react-google-maps/api';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

type SearchBoxesProps = {
  step: STEPS;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SearchBoxes({ step, ...rest }: SearchBoxesProps) {

  const [mapLoaded, setMapLoaded] = useState(false);

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

  useEffect(() => {
    if (step === STEPS.LOCATION) {
      setMapLoaded(true);
    }

  }, [step, dimensions]);



  return (
    <div  className={`m-auto mt-4 bg-black/60 backdrop-filter   
        before:rounded-3xl rounded-3xl flex flex-col justify-center items-center box-content  w-[${dimensions.w}px] max-md:!w-full`}  {...rest}>
      {step === STEPS.LOCATION && <LocationMenu />    }
      {step === STEPS.DATE && <DateMenu />}
      {step == STEPS.GUESTS && <GuestMenu />}
      {step === STEPS.ACTIVITIES &&

        <ActivitiesMenu />
      }
    </div>
  )
}
