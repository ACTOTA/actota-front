'use client';

import React, { useState, useEffect } from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import get_activities from '@/services/api/activities';
import get_lodging from '@/services/api/lodging';
import Toggle from '../figma/Toggle';
import { MultiSelect } from "react-multi-select-component";
import { BiCar, BiHome, BiWalk } from 'react-icons/bi';
import { HomeIcon } from '@heroicons/react/20/solid';

interface Activity {
    _id: string;
    label: string;
}
interface Lodging {
    _id: string;
    label: string;
}

export default function ActivitiesMenu() {
    const [activities, setActivities] = useState([]); // Add this state
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [lodging, setLodging] = useState([]);
    const [selectedLodging, setSelectedLodging] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trans, setTrans] = useState(false);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const fetchedActivities = await get_activities();
                setActivities(fetchedActivities); // Store fetched activities
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setIsLoading(false);
            }
        }
        async function fetchLodging() {
            try {
                const fetchedLodging = await get_lodging();
                setLodging(fetchedLodging);
            } catch (error) {
                console.error('Failed to fetch lodging options:', error);
            }
        }

        fetchActivities();
        fetchLodging();
    }, []);

    const toggle = () => {
        setTrans(!trans);
        console.log('Transportation: ', trans);
    }

    return (
        <section className="flex flex-col gap-4 h-full w-[520px] z-20 text-lg p-4">
            <div>

                <div className='flex gap-3'>
                    <BiWalk className='h-6 w-6' />
                    <p>Activities</p>
                </div>
                <div className="h-2" />
                <MultiSelect
                    options={activities.map((act: Activity) => ({
                        label: act.label,
                        value: act._id
                    }))}
                    value={selectedActivities}
                    onChange={setSelectedActivities}
                    labelledBy="Select activities"
                    isLoading={isLoading}
                    className="multi-select-container"
                />
            </div>

            <div>
                <div className='flex gap-3'>
                    <BiHome className='h-6 w-6' />
                    <p>Lodging</p>
                </div>
                <div className="h-2" />
                <MultiSelect
                    options={lodging.map((lodge: Lodging) => ({
                        label: lodge.label,
                        value: lodge._id
                    }))}
                    value={selectedLodging}
                    onChange={setSelectedLodging}
                    labelledBy="Select lodging"
                    isLoading={isLoading}
                    className="multi-select-container"
                />
            </div>

            <div className='flex justify-between'>
                <div className='flex gap-3'>
                    <BiCar className='h-6 w-6' />
                    <p>Transportation</p>
                </div>
                <Toggle
                    enabled={trans}
                    setEnabled={setTrans}
                />
            </div>
        </section>
    );
}

