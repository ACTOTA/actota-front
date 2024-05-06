'use client';

import { useState } from 'react';
import Container from './Container';
import ActivityBox from './ActivityBox';


import { usePathname, useSearchParams } from 'next/navigation';
import { TbBeach, TbMountain, TbPool, TbChefHat } from 'react-icons/tb';
import { FaSkiing, FaHiking, FaCampground, FaHotTub, FaBiking, FaHatCowboy, FaRandom, } from "react-icons/fa";
import { FaTrainSubway } from "react-icons/fa6"
import { BsBackpack2, BsFillBackpack2Fill, BsSnow } from "react-icons/bs";
import { BiSolidBinoculars } from "react-icons/bi";
import { 
  GiBarn, 
  GiBoatFishing, 
  GiCactus, 
  GiCastle, 
  GiCaveEntrance, 
  GiForestCamp, 
  GiIsland,
  GiMineWagon,
  GiWindmill,
  GiHorseHead,
  GiChefToque,
  GiJumpAcross,
  GiWaterSplash,
  GiRiver,

} from 'react-icons/gi';

import { IoDiamond } from 'react-icons/io5';

import { MdOutlineKayaking, MdGolfCourse, MdSnowmobile, MdSnowshoeing } from "react-icons/md";

import { FaT } from 'react-icons/fa6';



export const activities = [
  {
    label: 'Surprise Me!',
    icon: FaRandom,
    description: 'We will randomly select an activities for you!', 
    duration: 90,
  },
  {
    label: 'ATVing',
    icon: GiWindmill,
    description: 'Go on the best ATVing in Colorado!',
    duration: 90,
    
  },
  {
    label: 'Backpacking',
    icon: BsFillBackpack2Fill,
    description: 'Best backpacking spots in Colorado!',
    duration: 90,
  },
  {
    label: 'Biking',
    icon: FaBiking,
    description: 'Best biking trails in Colorado!',
    duration: 90,
  },
  {
    label: 'Camping',
    icon: GiForestCamp,
    description: 'This property offers camping activities!',
    duration: 90,
  },
  {
    label: 'Caves',
    icon: GiCaveEntrance,
    description: 'Explore the best caves in Colorado!',
    duration: 90,
  },
  {
    label: 'Challenge',
    icon: GiJumpAcross,
    description: 'Experience the best challenges in Colorado!',
    duration: 90,
  },
  {
    label: 'Chefs',
    icon: GiChefToque,
    description: 'Best chefs in Colorado!',
    duration: 90,
  },
  {
    label: 'Fishing',
    icon: GiBoatFishing,
    description: 'Go fishing in the best spots in Colorado!',
    duration: 90,
  },
  {
    label: 'Golfing',
    icon: MdGolfCourse,
    description: 'Best golf courses in Colorado!',
    duration: 90,
  },
  {
    label: 'Mines',
    icon: GiMineWagon,
    description: 'Experience the best gold mines in Colorado!',
    duration: 90,
  },
  {
    label: 'Hiking',
    icon: FaHiking,
    description: 'Hike on the best hiking trails in Colorado!',
    duration: 90,
  },
  {
    label: 'History',
    icon: FaHatCowboy,
    description: 'Learn about the history of Colorado!',
    duration: 90,
  },
  {
    label: 'Horse back',
    icon: GiHorseHead,
    description: 'Best horse riding in Colorado!',
    duration: 90,
  },

  {
    label: 'Lux',
    icon: IoDiamond,
    description: 'Experience most luxurious places in Colorado!',
    duration: 90,
  },

  {
    label: 'Sightseeing',
    icon: BiSolidBinoculars,
    description: 'Best sightseeing in Colorado!',
    duration: 90,
  },
  {
    label: 'Snowshoeing',
    icon: MdSnowshoeing,
    description: 'Best snowshoeing in Colorado!',
    duration: 90,
  },
  {
    label: 'Snowmobiling',
    icon: MdSnowmobile,
    description: 'Best Snowmobiling in Colorado!',
    duration: 90,
  },

  {
    label: 'Water',
    icon: MdOutlineKayaking,
    description: 'Paddleboard, kayak, and more!',
    duration: 90,
  },
  {
    label: 'Trains',
    icon: FaTrainSubway,
    description: 'Experience most luxurious places in Colorado!',
    duration: 90,
  },

  {
    label: 'Springs',
    icon: FaHotTub,
    description: 'Experience the best hot springs in Colorado!',
    duration: 90,
  },

  {
    label: 'Skiing',
    icon: FaSkiing,
    description: 'Experience the best skiing in Colorado!'
    ,duration: 90,
  },
  {
    label: 'White Water',
    icon: GiRiver,
    description: 'Best white water rafting in Colorado!',
    duration: 90,
  },
  

  
]

interface ActivitySelectValue {
  label: string;
  duration: number;
}

interface ActivitiesProps {
  value: ActivitySelectValue[];
  onChange: (activities: ActivitySelectValue[]) => void;
}

const Activities: React.FC<ActivitiesProps> = ({ value, onChange }) => {
  const handleActivityClick = (activity: ActivitySelectValue) => {
    const isAlreadySelected = value.some(a => a.label === activity.label);
    if (isAlreadySelected) {
      onChange(value.filter(a => a.label !== activity.label));
    } else {
      onChange([...value, activity]);
    }
  };

  const activityCount = value.length;
  const activityDuration = value.reduce((acc, a) => acc + a.duration, 0);

  return (
    <Container>
      <div className="grid h-auto grid-cols-3 gap-1 m-0 width-full gap-y-2 gap-x-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {activities.map((item) => 
          <ActivityBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            duration={item.duration}
            selected={value.some(a => a.label === item.label)}
            onClick={() => handleActivityClick(item)}
          />
        )}
      </div>
      <div>
        Selected Activities: {value.map(a => a.label).join(', ')}
      </div>
      <div>
        Activity Count: {activityCount}
      </div>
      <div>
        Activity Total Duration: {activityDuration}
      </div>
    </Container>
  );
};

export default Activities;