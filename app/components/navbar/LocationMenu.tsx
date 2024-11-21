import React from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import { MapPinIcon } from '@heroicons/react/20/solid';
import Button from '../figma/Button';
import MapPage from '../MapPage';


export default function LocationMenu() {


    return (
        <section className={`flex flex-col justify-between gap-6 py-6 h-full w-[584px] z-20`}>
            <ItineraryDropdown className="w-full m-0">
                <MapPinIcon className="h-6 w-6 text-white"/>
                <p className="text-lg">Select Location</p>
            </ItineraryDropdown>
            <div className="w-full">
                <MapPage visible={true} />
            </div>
            <Button className="bg-white text-black h-14 w-full">
                <p>Confirm Location</p>
            </Button>
        </section>
    )
}
