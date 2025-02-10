'use client';

import React, { useState, useEffect } from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import Toggle from '../figma/Toggle';
import { GoHome } from "react-icons/go";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";
import Dropdown from '../figma/Dropdown';
export default function ActivitiesMenu() {
    const [activities, setActivities] = useState([{label: 'Activities', description: 'Select preferred activities', tags: ['Activities']}]);
    const [selectedActivity, setSelectedActivity] = useState('Select preferred activities');
    const [lodging, setLodging] = useState([]);
    const [selectedLodging, setSelectedLodging] = useState('Select preferred lodging');
    const [isLoading, setIsLoading] = useState(true);
    const [trans, setTrans] = useState(false);



    const toggle = () => {
        setTrans(!trans);
        console.log('Transportation: ', trans);
    }

    return (
        <section className="flex flex-col text-white border-2 border-border-primary rounded-3xl gap-4 h-full w-[520px] z-20 text-lg p-4">
            <div>
                <p className='flex items-center gap-2'><FaPersonWalking className='h-6 w-6' /> Activities</p>

                <div className="h-2" />
                <Dropdown
                    label='Select preferred activities'
                    options={["Activities", "Food", "Shopping", "Entertainment", "Other"]}
                    onSelect={(value) => setSelectedActivity(value.toString())}
                />
            </div>

            <div>
                <div className='flex items-center justify-between gap-2'>

                    <p className='flex items-center gap-2'><GoHome className='h-6 w-6' /> Lodging</p>
                    <Toggle enabled={true} setEnabled={() => { }} onClick={() => { }} />

                </div>

                <div className="h-2" />
                <ItineraryDropdown
                    className="w-full m-0"
                    options={lodging}
                    isLoading={isLoading}
                    selected={selectedLodging}
                    onSelect={(value) => setSelectedLodging(value.toString())}
                />
            </div>

            <div className='flex items-center justify-between '>

                <p className='flex items-center gap-2'><MdOutlineDirectionsCarFilled className='h-6 w-6' /> Transportation</p>
                <Toggle enabled={true} setEnabled={() => { }} />
            </div>
        </section>
    );
}
