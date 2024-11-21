import React from 'react';
import ItineraryDropdown from '../figma/ItineraryDropdown';

export default function ActivitiesMenu() {

    const activities = ["Hiking", "Biking", "Sightseeing", "Shopping", "Eating", "Drinking", "Relaxing", "Swimming", "Skiing", "Snowboarding", "Surfing", "Fishing", "Camping", "Boating", "Horseback Riding", "Golfing", "Tennis", "Running", "Walking", "Yoga", "Meditating", "Reading", "Writing", "Painting", "Drawing", "Photography", "Videography", "Music", "Dancing", "Singing", "Acting", "Cooking", "Baking", "Gardening", "Farming", "Volunteering", "Working", "Studying", "Teaching", "Learning", "Exploring", "Adventuring", "Traveling", "Road Tripping", "Cruising", "Flying", "Sailing", "Cycling", "Motorcycling", "Driving", "Riding", "Walking", "Hiking", "Running", "Swimming", "Surfing", "Skiing", "Snowboarding", "Skating", "Skateboarding", "Rollerblading", "Biking", "Mountain Biking", "Road Biking", "BMX Biking", "Dirt Biking", "Camping", "Backpacking", "Glamping", "RVing", "Van Life", "Boating", "Sailing", "Yachting", "Fishing", "Hunting", "Shooting", "Archery", "Golfing", "Tennis", "Pickleball", "Squash", "Racquetball", "Badminton", "Ping Pong", "Foosball", "Pool", "Billiards", "Darts", "Bowling", "Shuffleboard", "Cornhole", "Horseshoes", "Croquet", "Bocce Ball", "Lawn Bowling", "Lawn Darts", "Lawn Games", "Board Games", "Card Games", "Video Games", "Computer Games", "Mobile Games", "Console Games", "Arcade Games", "Pinball", "Puzzle Games", "Strategy Games", "Role Playing Games", "Simulation Games", "Sports Games", "Racing Games", "Fighting Games", "Shooting Games", "Adventure Games", "Action Games",];

    return (
        <section className="flex flex-col gap-4 h-full w-[520px] z-20 text-lg p-4">
            <div>
                <p>Activities</p>
                <div className="h-2"/>
                <ItineraryDropdown className="w-full m-0" options={activities}/> 
            </div>

            <div>
                <p>Lodging</p>
                <div className="h-2"/>
                <ItineraryDropdown className="w-full m-0" />
            </div>

            <div>
                <p>Transportation</p>
            </div>
        </section>
    )
}
