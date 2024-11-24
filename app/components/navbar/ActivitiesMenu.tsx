'use client';

import React, { useState, useEffect } from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';
import get_activities from '@/services/api/activities';

export default function ActivitiesMenu() {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

        fetchActivities();
    }, []);

    return (
        <section className="flex flex-col gap-4 h-full w-[520px] z-20 text-lg p-4">
            <div>
                <p>Activities</p>
                <div className="h-2" />
                <ItineraryDropdown
                    className="w-full m-0"
                    options={activities}
                    isLoading={isLoading}
                />
            </div>

            <div>
                <p>Lodging</p>
                <div className="h-2" />
            </div>

            <div>
                <p>Transportation</p>
            </div>
        </section>
    );
}
