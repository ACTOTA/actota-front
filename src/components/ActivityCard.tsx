'use client';
import React, { useEffect } from 'react';
import { BiSolidMap } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDirections, MdOutlineDirectionsCarFilled, MdOutlineExplore } from 'react-icons/md';
import Image from 'next/image';
import { IoLocationOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { LuRoute } from 'react-icons/lu';
import Button from './figma/Button';
import {
  PopulatedDayItem,
  isActivity,
  isAccommodation,
  isTransportation,
  ActivityItem,
  AccommodationItem
} from '../types/itineraries';

export enum CardType {
  ACTIVITY = 'activity',
  ACCOMMODATION = 'accommodation',
  TRANSPORTATION = 'transportation'
}

export interface ActivityCardProps {
  activity: PopulatedDayItem;
  formatTime: (time: string) => string;
  getActivityIcon: (type: string) => JSX.Element;
  setIsFeedbackDrawerOpen?: (isFeedbackDrawerOpen: boolean) => void;
  cardType?: CardType;
}

const ActivityCard = ({ activity, formatTime, getActivityIcon, setIsFeedbackDrawerOpen, cardType = CardType.ACTIVITY }: ActivityCardProps) => {

  const getBorderGradient = () => {
    switch (cardType) {
      case CardType.ACCOMMODATION:
        return "from-[#F10E3B] via-border-primary to-border-primary";
      case CardType.ACTIVITY:
        return "from-[#0553CE] via-border-primary to-border-primary";
      case CardType.TRANSPORTATION:
        return "from-[#FEDB25] via-border-primary to-border-primary";
      default:
        return "from-[#FEDB25] via-border-primary to-border-primary";
    }
  };

  // Helper function to get the display name based on activity type
  const getDisplayName = () => {
    if (isActivity(activity)) {
      return activity.title;
    } else if (isAccommodation(activity) || isTransportation(activity)) {
      return activity.name;
    }
    return "Unknown";
  };

  // Get image source based on activity type
  const getImageSource = () => {
    if (isActivity(activity)) {
      return activity.primary_image || '/images/default-activity.jpeg';
    } else if (isAccommodation(activity) && activity.images && activity.images.length > 0) {
      return activity.images[0];
    }
    return '/images/default-activity.jpeg';
  };

  // Get price based on activity type
  const getPriceInfo = () => {
    if (isActivity(activity)) {
      return {
        amount: `$${activity.price_per_person.toFixed(2)}`,
        label: 'per person'
      };
    } else if (isAccommodation(activity) && activity.price_per_night) {
      return {
        amount: `$${activity.price_per_night.toFixed(2)}`,
        label: 'per night'
      };
    }
    return {
      amount: '$0.00',
      label: 'per person'
    };
  };

  const getDuration = () => {
      if (isActivity(activity)) {
        const duration = activity.duration_minutes;
        if (duration < 60) return `{duration} minutes`;
        else if (duration == 60) return "1 hour";

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours} hours and ${minutes} minutes.`;
      }
  }


  useEffect(() => {
    console.log('ActivityCard:', activity);
    console.log("CardType: ", cardType);
  }, []);

  return (
    <div className="flex flex-col gap-4 border-border-primary">
      {/* Time Column */}
      <div className="w-fit -ml-16 text-sm bg-gray-900 rounded-full px-2 py-1">
        <span className="text-white">{formatTime(activity.time)}</span>
      </div>

      {/* Activity Card */}
      <div className={`flex-1 bg-gradient-to-br ${getBorderGradient()} rounded-xl p-[2px]`}>
        <div className="flex-1 bg-black rounded-xl">

          <div className="flex-1 bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-4 relative">
            {cardType === CardType.ACCOMMODATION && (
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold">{getDisplayName()}</h3>
                </div>
              </div>
            )}

            <div className="flex justify-between items-end ">
              {cardType === CardType.TRANSPORTATION ? (
                <div className="flex items-start gap-10">

                  {/* Location Info */}
                  <div className="bg-black/30 rounded-lg p-3 w-[250px]">
                    <div className="flex items-center gap-2 text-white/70 mb-2">
                      <BiSolidMap className="w-4 h-4" />
                      <span>Location</span>
                    </div>
                    <p className="text-white text-sm">{activity.location.name}</p>
                  </div>

                  {/* Duration */}
                  <div className='flex flex-col gap-1 max-sm:hidden'>

                    <div className="flex items-center gap-2">
                      <FaRegClock className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">1 hour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdOutlineDirectionsCarFilled className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">1 hour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuRoute className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">4.9 miles</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-10">

                  {/* Image Goes Here */}
                  <div className="bg-black/30 rounded-lg w-[150px] h-[116px] -m-2 relative">
                    <Image
                      src={getImageSource()}
                      alt="Activity Picture"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>

                  {/* Duration */}
                  <div className='flex flex-col gap-1 max-sm:hidden'>
                    <p><b>{getDisplayName()}</b></p>

                    <div className="flex items-center gap-2">
                      <FaRegClock className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">
                        {isActivity(activity) && `${getDuration()}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdOutlineDirectionsCarFilled className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">UPDATE THIS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuRoute className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">4.9 miles</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col items-end">
                {/*{setIsFeedbackDrawerOpen && (
                                    <Button variant='primary' onClick={() => setIsFeedbackDrawerOpen(true)} className='absolute top-4 right-4'> Give Feedback</Button>
                                )}*/}

                <p className='text-white'>{getPriceInfo().amount}</p>
                <span className="text-primary-gray text-sm">{getPriceInfo().label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ActivityCard;
