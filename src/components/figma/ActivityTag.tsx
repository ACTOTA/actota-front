import React from 'react';
import { IconType } from 'react-icons';
import { 
  FaHiking, 
  FaCampground, 
  FaFire, 
  FaFish,
  FaHorse,
  FaMountain,
  FaWater,
  FaUtensils,
  FaRoute,
  FaCamera,
  FaTrain,
  FaMotorcycle,
} from 'react-icons/fa';
import { GiGoldMine } from 'react-icons/gi';

type ActivityType = {
  id: string;
  label: string;
  icon: IconType;
}

const activities: ActivityType[] = [
  { id: 'atving', label: 'ATVing', icon: FaMotorcycle },
  { id: 'backpacking', label: 'Backpacking', icon: FaCampground },
  { id: 'camping', label: 'Camping', icon: FaCampground },
  { id: 'campfire', label: 'Campfire', icon: FaFire },
  { id: 'caveExploring', label: 'Cave Exploring', icon: FaCampground },
  { id: 'fishing', label: 'Fishing', icon: FaFish },
  { id: 'goldMineTours', label: 'Gold Mine Tours', icon: GiGoldMine },
  { id: 'hiking', label: 'Hiking', icon: FaHiking },
  { id: 'hotSprings', label: 'Hot Springs', icon: FaWater },
  { id: 'horsebackRiding', label: 'Horseback Riding', icon: FaHorse },
  { id: 'mountainBiking', label: 'Mountain Biking', icon: FaMountain },
  { id: 'paddleBoarding', label: 'Paddle Boarding', icon: FaWater },
  { id: 'privateChef', label: 'Private Chef', icon: FaUtensils },
  { id: 'ropesCourse', label: 'Ropes Course', icon: FaRoute },
  { id: 'sightSeeing', label: 'Sight Seeing', icon: FaCamera },
  { id: 'trainRiding', label: 'Train Riding', icon: FaTrain },
];

type ActivityTagProps = {
  activity: string;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function ActivityTag({ 
  activity, 
  className = '', 
  onClick,
  selected = false 
}: ActivityTagProps) {
  const activityData = activities.find(a => a.id === activity);

  if (!activityData) return null;

  const { icon: Icon, label } = activityData;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-2 py-1 rounded-lg
        text-sm font-medium transition-all duration-200
        ${selected 
          ? 'bg-white text-black' 
          : 'bg-[#262626] text-white hover:bg-[#262626]/40'
        }
        ${className}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

// Optional: Export the activities array if needed elsewhere
export { activities }; 