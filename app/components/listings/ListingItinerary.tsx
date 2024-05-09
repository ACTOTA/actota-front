import React from 'react';
import { DateRange } from 'react-date-range';

interface DayItineraryProps {
  title: string;
  dayDescription: string;
  date: string;
  startTime: string;
  endTime: string;
  driveTime: string;
  dayActivities: string;
  dayLodging: string;
  dayActivityCount: number;
};

const ListingItinerary: React.FC<DayItineraryProps> = ({
  title,
  dayDescription,
  date,
  startTime,
  endTime,
  driveTime,
  dayActivities,
  dayLodging,
  dayActivityCount
}) => {


  return (
    <div>
      <h1>{title}</h1>
      <p>Description: {dayDescription}</p>
      <p>Date: {date}</p>
      <p>Start Time: {startTime}</p>
      <p>End Time: {endTime}</p>
      <p>Drive Time: {driveTime}</p>
      <p>Activities: {dayActivities}</p>
      <p>Lodging: {dayLodging}</p>
    </div>
  );
}

export default ListingItinerary;
