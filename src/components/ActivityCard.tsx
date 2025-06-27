'use client';
import React, { useEffect } from 'react';
import { BiSolidMap } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDirections, MdOutlineDirectionsCarFilled, MdOutlineExplore, MdBed, MdFoodBank, MdLocationOn } from 'react-icons/md';
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
  setIsFeedbackDrawerOpen?: (isFeedbackDrawerOpen: boolean) => void;
  cardType?: CardType;
}

const ActivityCard = ({ activity, formatTime, setIsFeedbackDrawerOpen, cardType = CardType.ACTIVITY }: ActivityCardProps) => {

  // Helper function to get the display name for any day item
  const getItemDisplayName = (item: PopulatedDayItem): string => {
    if (isActivity(item)) {
      return item.title;
    } else if (isAccommodation(item) || isTransportation(item)) {
      return item.name;
    }
    return "Unknown";
  };

  // Get icon for activity type
  const getActivityIcon = (item: PopulatedDayItem) => {
    // Transportation icon
    if (isTransportation(item)) {
      return <MdOutlineDirectionsCarFilled className="w-5 h-5 text-white" />;
    }

    // Accommodation icon
    if (isAccommodation(item)) {
      return <MdBed className="w-5 h-5 text-white" />;
    }

    // Activity icons based on name
    const displayName = isActivity(item) ? item?.title.toLowerCase() : '';

    // Check for food-related activities
    if (displayName.includes('breakfast') || displayName.includes('lunch') ||
      displayName.includes('dinner') || displayName.includes('restaurant')) {
      return <MdFoodBank className="w-5 h-5 text-white" />;
    }

    switch (displayName) {
      case 'hiking':
        return <MdOutlineExplore className="w-5 h-5 text-white" />;
      case 'sightseeing':
        return <BiSolidMap className="w-5 h-5 text-white" />;
      case 'safari':
        return <MdOutlineExplore className="w-5 h-5 text-white" />;
      default:
        return <MdLocationOn className="w-5 h-5 text-white" />;
    }
  };

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
      if (duration === undefined || duration === null) return null; // No duration provided

      if (duration < 60) return `${duration} minutes`;
      else if (duration === 60) return "1 hour";

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
    }
    return null;
  };


  useEffect(() => {
    console.log('ActivityCard:', activity);
    console.log("CardType: ", cardType);
  }, []);

  return (
    <div className="flex items-start gap-4 relative">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-border-primary -ml-[25px]"></div>
      <div className="absolute left-0 top-6 w-3 h-3 bg-blue-500 rounded-full -ml-[31px] border-2 border-black"></div>
      
      {/* Time */}
      <div className="flex-shrink-0 w-20 text-right pr-4">
        <span className="text-white text-sm">{formatTime(activity.time)}</span>
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

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              {/* Image/Icon Section */}
              <div className="flex-shrink-0">
                {cardType === CardType.TRANSPORTATION ? (
                  <div className="w-16 h-16 rounded-lg bg-black/30 flex items-center justify-center">
                    {getActivityIcon(activity)}
                  </div>
                ) : (
                  <div className="bg-black/30 rounded-lg w-24 h-24 relative overflow-hidden">
                    <Image
                      src={getImageSource()}
                      alt={getDisplayName()}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-white font-bold text-lg">{getDisplayName()}</h3>

                {/* Location */}
                {(activity.location?.name || (isActivity(activity) && activity.address)) && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <IoLocationOutline className="w-4 h-4" />
                    <span>
                      {activity.location?.name ||
                        (isActivity(activity) && activity.address
                          ? `${activity.address.street}, ${activity.address.city}`
                          : '')}
                    </span>
                  </div>
                )}

                {/* Duration (only for activities) */}
                {isActivity(activity) && getDuration() && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <FaRegClock className="w-4 h-4" />
                    <span>{getDuration()}</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 text-white text-sm">
                  <p className="font-semibold">{getPriceInfo().amount}</p>
                  <span className="text-primary-gray">{getPriceInfo().label}</span>
                </div>
              </div>

              {/* Action/Feedback Button (if needed) */}
              {setIsFeedbackDrawerOpen && (
                <div className="flex-shrink-0 mt-4 sm:mt-0">
                  <Button
                    variant="primary"
                    onClick={() => setIsFeedbackDrawerOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    Give Feedback
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ActivityCard;
