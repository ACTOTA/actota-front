import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Button from '../figma/Button';
import MapPage from '../MapPage';
import get_locations from '@/services/api/locations';

interface Location {
    city: string;
    state: string;
}

export default function LocationMenu() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedLocation(null);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            const fetchedResults = await get_locations(5, value);
            setResults(fetchedResults);
        }, 500);
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setSearchTerm(`${location.city}, ${location.state}`);
        setResults([]);
    };

    return (
        <section className={`flex flex-col justify-between gap-6 py-6 h-full w-[584px] z-20`}>
            <div>
                <h3 className="text-2xl font-bold">Destination</h3>
                <div className="h-2" />
                <div className="relative">
                    <div className="grid w-full grid-cols-1 translucent-black-30">
                        <input
                            name="search"
                            type="search"
                            placeholder="Search location"
                            className="col-start-1 row-start-1 block w-full rounded-md py-1.5 pl-10 pr-3 text-base text-gray-900 
                            outline outline-1 -outline-offset-1 outline-gray-300 translucent-black-30 text-neutral-06
                            placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleInputChange}
                            value={searchTerm}
                        />
                        <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                        />
                    </div>
                    {results.length > 0 && (
                        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {results.map((location, index) => (
                                <li
                                    key={index}
                                    className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                    onClick={() => handleLocationSelect(location)}
                                >
                                    {location.city}, {location.state}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="w-full">
                <MapPage visible={true} />
            </div>
            <Button className="bg-white text-black h-14 w-full" disabled={!selectedLocation}>
                <p>Confirm Location</p>
            </Button>
        </section>
    )
}

