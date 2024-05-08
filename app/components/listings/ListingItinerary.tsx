import React from 'react';
import { DateRange } from 'react-date-range';

const ListingItinerary = () => {
  const itinerary = {
    title: "Tubing in Glenwood Springs",
    dayDescription: "enjoy the day tubing down the river",
    date: "July 4, 2022",
    startTime: "8:00 AM",
    endTime: "5:00 PM",
    driveTime: "2 hours",
    dayActivities: "tubing, lunch, hiking",
    dayLodging: "Hotel Colorado",
  };

  return (
    <div>
      <h1>{itinerary.title}</h1>
      <p>Description: {itinerary.dayDescription}</p>
      <p>Date: {itinerary.date}</p>
      <p>Start Time: {itinerary.startTime}</p>
      <p>End Time: {itinerary.endTime}</p>
      <p>Drive Time: {itinerary.driveTime}</p>
      <p>Activities: {itinerary.dayActivities}</p>
      <p>Lodging: {itinerary.dayLodging}</p>
    </div>
  );
}

export default ListingItinerary;
