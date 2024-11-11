import React from 'react';
import { STEPS } from '../../types/steps';
import { useEffect, useMemo, useState } from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import { MapPinIcon } from '@heroicons/react/20/solid';
import Button from '../figma/Button';
import MapPage from '../MapPage';
import PlusMinusButton, { ButtonType } from '../figma/PlusMinusButton';
import GuestMenu from './GuestMenu';

type SearchBoxesProps = {
    step: STEPS;
    reference: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SearchBoxes({ step, reference, ...rest } : SearchBoxesProps) {

    const [mapLoaded, setMapLoaded] = useState(false);

    const dimensions = useMemo(() => {
        console.log("step", step);
    switch (step) {
      case STEPS.LOCATION:
        return { w: 584, h: 596 };
      case STEPS.GUESTS:
        return { w: 400, h: 290 };
      case STEPS.ACTIVITIES:
        return { w: 520, h: 304 };
      case STEPS.DATE:
        return { w: 680, h: 424 };
      default:
        return { w: 0, h: 0 }; 
    }
  }, [step]);

    useEffect(() => {
        if (step === STEPS.LOCATION) {
            setMapLoaded(true);
        }
        console.log("dimensions", dimensions);
    
    }, [step]);

       

    return (
        <div className={`w-[${dimensions.w}px] h-[${dimensions.h}px] m-auto mt-4 glass-dark glass-corner backdrop-filter backdrop-blur-md stroke-glass-01
        before:rounded-3xl rounded-3xl px-6 flex flex-col justify-center items-center box-content`} ref={reference} {...rest}>

            {step === STEPS.LOCATION && ( // Conditionally render the Map component
                <section className={`flex flex-col justify-between gap-6 py-6 w-full`}>
                    <ItineraryDropdown className="w-full m-0">
                        <MapPinIcon className="h-6 w-6 text-white"/>
                        <p className="text-lg">Select Location</p>
                    </ItineraryDropdown>
                    <div className="">
                        <MapPage visible={true} />
                    </div>
                    <Button className="bg-white text-black h-14 w-full">
                        <p>Confirm Location</p>
                    </Button>
                </section>
            )}
            {step == STEPS.GUESTS && <GuestMenu />}
        </div>
    )
}
