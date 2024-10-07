import React from 'react';
import { STEPS } from '../../types/steps';
import { useEffect, useMemo, useState } from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import { MapPinIcon } from '@heroicons/react/20/solid';
import Button from '../figma/Button';
import MapPage from '../MapPage';
import dynamic from 'next/dynamic';

type SearchBoxesProps = {
    step: STEPS;
    reference: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SearchBoxes({ step, reference, ...rest } : SearchBoxesProps) {

    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        console.log(step);
        if (step === STEPS.LOCATION) {
            setMapLoaded(true);
        }
    }, [step]);

   

    return (
        <div className="w-[584px] h-[596px] m-auto mt-4 glass-dark glass-corner backdrop-filter backdrop-blur-md stroke-glass-01
        before:rounded-3xl rounded-3xl px-6" ref={reference} {...rest}>

            <div className='flex flex-col justify-between h-full'>
            {step === STEPS.LOCATION && ( // Conditionally render the Map component
                <div>
                    <ItineraryDropdown className="w-full m-auto">
                        <MapPinIcon className="h-6 w-6 text-white"/>
                        <p className="text-lg">Select Location</p>
                    </ItineraryDropdown>
                    <MapPage visible={true} />
                    <Button className="h-14 w-full text-lg">Confirm Location</Button>
                </div>
            )}
            </div>
        </div>
    )
}
