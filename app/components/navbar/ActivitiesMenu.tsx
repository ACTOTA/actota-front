'use client';

import React, { useState, useEffect } from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import get_activities from '@/services/api/activities';
import get_lodging from '@/services/api/lodging';
import Toggle from '../figma/Toggle';

export default function ActivitiesMenu() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('Select preferred activities');
    const [lodging, setLodging] = useState([]);
    const [selectedLodging, setSelectedLodging] = useState('Select preferred lodging');
    const [isLoading, setIsLoading] = useState(true);
    const [trans, setTrans] = useState(false);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const fetchedActivities = await get_activities();
                setActivities(fetchedActivities);
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
            } finally {
                setIsLoading(false);
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
                <p>Activities</p>
                <div className="h-2" />
                <ItineraryDropdown
                    className="w-full m-0"
                    options={activities}
                    isLoading={isLoading}
                    selected={selectedActivity}
                    onSelect={(value) => setSelectedActivity(value.toString())}
                />
            </div>

            <div>
                <p>Lodging</p>
                <div className="h-2" />
                <ItineraryDropdown
                    className="w-full m-0"
                    options={lodging}
                    isLoading={isLoading}
                    selected={selectedLodging}
                    onSelect={(value) => setSelectedLodging(value.toString())}
                />
            </div>

            <div>
                <p>Transportation</p>
                <Toggle enabled={trans} setEnabled={setTrans} onClick={toggle} />
            </div>
        </section>
    );
}
