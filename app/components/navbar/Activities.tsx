'use client';

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

import ActivityBox from "../ActivityBox";
import Container from '../Container';
import { FaT } from 'react-icons/fa6';


export const activities = [
  {
    label: 'Surprise Me!',
    icon: FaRandom,
    description: 'This property is in a barn!'
  },
  {
    label: 'ATVing',
    icon: GiWindmill,
    description: 'Go on the best ATVing in Colorado!',
  },
  {
    label: 'Backpacking',
    icon: BsFillBackpack2Fill,
    description: 'Best backpacking spots in Colorado!',
  },
  {
    label: 'Biking',
    icon: FaBiking,
    description: 'Best biking trails in Colorado!'
  },
  {
    label: 'Camping',
    icon: GiForestCamp,
    description: 'This property offers camping activities!'
  },
  {
    label: 'Caves',
    icon: GiCaveEntrance,
    description: 'Explore the best caves in Colorado!',
  },
  {
    label: 'Challenge',
    icon: GiJumpAcross,
    description: 'Experience the best challenges in Colorado!'
  },
  {
    label: 'Chefs',
    icon: GiChefToque,
    description: 'Best chefs in Colorado!'
  },
  {
    label: 'Fishing',
    icon: GiBoatFishing,
    description: 'Go fishing in the best spots in Colorado!',
  },
  {
    label: 'Golfing',
    icon: MdGolfCourse,
    description: 'Best golf courses in Colorado!'
  },
  {
    label: 'Mines',
    icon: GiMineWagon,
    description: 'Experience the best gold mines in Colorado!',
  },
  {
    label: 'Hiking',
    icon: FaHiking,
    description: 'Hike on the best hiking trails in Colorado!',
  },
  {
    label: 'History',
    icon: FaHatCowboy,
    description: 'Learn about the history of Colorado!'
  },
  {
    label: 'Horse back',
    icon: GiHorseHead,
    description: 'Best horse riding in Colorado!'
  },

  {
    label: 'Lux',
    icon: IoDiamond,
    description: 'Experience most luxurious places in Colorado!'
  },

  {
    label: 'Sightseeing',
    icon: BiSolidBinoculars,
    description: 'Best sightseeing in Colorado!'
  },
  {
    label: 'Snowshoeing',
    icon: MdSnowshoeing,
    description: 'Best snowshoeing in Colorado!'
  },
  {
    label: 'Snowmobiling',
    icon: MdSnowmobile,
    description: 'Best Snowmobiling in Colorado!'
  },

  {
    label: 'Water',
    icon: MdOutlineKayaking,
    description: 'Paddleboard, kayak, and more!'
  },
  {
    label: 'Trains',
    icon: FaTrainSubway,
    description: 'Experience most luxurious places in Colorado!'
  },

  {
    label: 'Springs',
    icon: FaHotTub,
    description: 'Experience the best hot springs in Colorado!',
  },

  {
    label: 'Skiing',
    icon: FaSkiing,
    description: 'Experience the best skiing in Colorado!'
  },
  {
    label: 'White Water',
    icon: GiRiver,
    description: 'Best white water rafting in Colorado!'
  },
  

  
]

const Activities = () => {
  const params = useSearchParams();
  const activity = params?.get('activity');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          w-full
          h-auto
          m-0
          grid
          gap-1
          gap-y-1.5
          grid-cols-3
        

          max-xl:grid-cols-3
          max-lg:grid-cols-2
          max-sm:grid-cols-1
        "
      >
        {activities.map((item) => 
          <ActivityBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
          />
        )}
      </div>
    </Container>
  );
}
 
export default Activities;