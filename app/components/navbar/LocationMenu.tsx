import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Button from '../figma/Button';
import MapPage from '../MapPage';


export default function LocationMenu() {


    return (
        <section className={`flex flex-col justify-between gap-6 py-6 h-full w-[584px] z-20`}>
            <div>
                <h3 className="text-2xl font-bold">Destination</h3>
                <div className="h-2" />
                <div className="grid w-full grid-cols-1 translucent-black-30">
                    <input
                        name="search"
                        type="search"
                        placeholder="Search location"
                        className="col-start-1 row-start-1 block w-full rounded-md py-1.5 pl-10 pr-3 text-base text-gray-900 
                        outline outline-1 -outline-offset-1 outline-gray-300 translucent-black-30 text-neutral-06
                        placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                    />
                </div>
            </div>
            <div className="w-full">
                <MapPage visible={true} />
            </div>
            <Button className="bg-white text-black h-14 w-full">
                <p>Confirm Location</p>
            </Button>
        </section>
    )
}
