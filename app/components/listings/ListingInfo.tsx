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
  const { getByValue } = useTowns();

  const [day, setDay] = useState("Day 1");

  useEffect(() => {
    console.log(day);
  }, [day])

  const coordinates = getByValue(locationValue)?.latlng
  const Map = dynamic(() => import('../Map'), {
    ssr: false
  });
  return (
    <div className="flex flex-col col-span-4 gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="flex flex-row items-center gap-2 text-xl font-semibold //"
        >
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light // text-neutral-500"
        >
          <div>
            {guestCount} guests
          </div>
          <div>
            {roomCount} rooms
          </div>
          <div>
            {bathroomCount} bathrooms
          </div>
        </div>
      </div>
      <hr />
      {activity && (
        <ListingActivity
          icon={activity.icon}
          label={activity?.label}
          description={activity?.description}
        />
      )}
      <hr />
      <div className="text-lg font-light // text-neutral-500">
        {description}
      </div>
      <hr />
      <div className="display: max-w-screen-lg mx-auto flex; justify-content: center; align-items: center; height: 100%;">
        <ListingDays day={day} setDay={setDay} />
        <ListingItinerary
          title={"title"}
          dayDescription={"dayDescription"}
          date={"date"}
          startTime={"startTime"}
          endTime={"endTime"}
          driveTime={"driveTime"}
          dayActivities={"dayActivities"}
          dayLodging={"dayLodging"}
          dayActivityCount={1}
        />
      </div>
      <Map center={coordinates} />

    </div>

  );
}

export default ListingInfo;









//
