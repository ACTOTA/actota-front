'use client';

import useTowns from "@/app/hooks/useTowns";
import { SafeUser } from "@/app/types";
import dynamic from "next/dynamic";
import { IconType } from "react-icons";
import { useEffect, useState } from "react";

import Avatar from "../Avatar";
import ListingActivity from "./ListingActivity";
import ListingDays from "./ListingDays";
import ListingItinerary from "./ListingItinerary";
import LodgingDetailsCounter from "../inputs/LodgingDetailsCounter";
import ListingType from "./ListingType";
import ListingHead from "./ListingHead";
import Heading from "../Heading";
interface ListingInfoProps {
  user: SafeUser,
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  activity: {
    icon: IconType,
    label: string;
    description: string;
  } | undefined
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  activity,
  locationValue,
}) => {
  // This will be replaced with the actual data from the backend later
  const dayInfo: Object = {
    1: { title: 'Day 1', dayDescription: 'Day 1 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    2: { title: 'Day 2', dayDescription: 'Day 2 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    3: { title: 'Day 3', dayDescription: 'Day 3 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    4: { title: 'Day 4', dayDescription: 'Day 4 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    5: { title: 'Day 5', dayDescription: 'Day 5 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    6: { title: 'Day 6', dayDescription: 'Day 6 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    7: { title: 'Day 7', dayDescription: 'Day 7 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
    8: { title: 'Day 8', dayDescription: 'Day 8 Description', date: '12/12/12', startTime: '12:00', endTime: '12:00', driveTime: '12:00', dayActivities: 'A1,A2,A3', dayLodging: 'Lodging', dayActivityCount: 1 },
  }

  const [guests, setGuests] = useState(guestCount);
  const [rooms, setRooms] = useState(roomCount);
  const [bathrooms, setBathrooms] = useState(bathroomCount);

  const { getByValue } = useTowns();
  const location = getByValue(locationValue);

  const [day, setDay] = useState<number>(1); // This will be the current day
  const [dayItinerary, setDayItinerary] = useState<Object>(dayInfo[day]); // This will be the current day's itinerary

  useEffect(() => { // This is a hook that runs after the component is rendered
    setDayItinerary(dayInfo[day]); // This will set the dayItinerary to the day that is selected
  }, [day]) // This hook will run every time the day changes

  const coordinates = getByValue(locationValue)?.latlng
  const Map = dynamic(() => import('../Map'), {
    ssr: false
  });
  
  return (
    <div className="flex flex-col col-span-4 gap-2">
    <div className="flex flex-col gap-2">
      <div 
        className="flex flex-row items-center gap-2 text-xl font-semibold "
      >
        <div>Hosted by {user?.name}</div>
        <Avatar src={user?.image} />
      </div>
      <div className="flex flex-row items-center font-light text-neutral-500"
      >
        
        {/* <div>
          {guestCount} guests
        </div>
        <div>
          {roomCount} rooms
        </div>
        <div>
          {bathroomCount} bathrooms
        </div> */}
      </div>
      <ListingType />
      <hr />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <ListingDays days={dayInfo} day={day} setDay={setDay} />
      </div>
    </div>
    {/* <hr />
      {activity && (
        <ListingActivity
          icon={activity.icon}
          label={activity?.label}
          description={activity?.description}
        />
      )} */}
      <hr />


      <ListingItinerary {...dayItinerary} />
      {/* <Map center={coordinates} /> */}

    </div>

  );
}

export default ListingInfo;
