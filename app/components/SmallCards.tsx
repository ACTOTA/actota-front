import React from 'react';
import Image from 'next/image';

interface Town {
  img: string;
  location: string;
  distance: string;
}

interface NearbyProps {
  towns: Town[];
}
export const NearbyData = [
  { img: "/images/TownImages/Golden.jpg", location: "Golden", distance: "30-minute drive" },
  { img: "/images/TownImages/Boulder.jpg", location: "Boulder", distance: "45-minute drive" },
  { img: "/images/TownImages/IdahoSprings.jpg", location: "Idaho Springs", distance: "40-minute drive" },
  { img: "/images/TownImages/ColoradoSprings.jpg", location: "Colorado Springs", distance: "1-hour drive" },
  { img: "/images/TownImages/FortCollins.jpg", location: "Fort Collins", distance: "1-hour drive" },
  { img: "/images/TownImages/EstesPark.jpg", location: "Estes Park", distance: "1.5-hour drive" },
  { img: "/images/TownImages/Vail.jpg", location: "Vail", distance: "1.5-hour drive" },
  { img: "/images/TownImages/FortCollins.jpg", location: "Glenwood Springs", distance: "2.5-hour drive" },
  { img: "/images/TownImages/Aspen.jpg", location: "Aspen", distance: "3.5-hour drive" },

];

const SmallCards: React.FC<NearbyProps> = ({ towns }) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {towns.map((town, index) => (
        <div key={index} className="flex flex-row items-center p-1 space-x-4 transition duration-200 ease-out transform bg-white cursor-pointer rounded-xl hover:bg-gray-100 hover:scale-105"> 
          
          {/* Left side: Image */}
          <div className="relative flex-shrink-0 w-16 h-16">
            <Image src={town.img} alt={town.location} layout="fill" className="rounded-lg" />
          </div>
          
          {/* Right side: Text details */}
          <div className="flex flex-col justify-center">
            <h2 className="font-semibold text-md">{town.location}</h2>
            <h3 className="text-sm text-gray-500">{town.distance}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmallCards;
{/* <div key={index} className="relative w-16 w-full h-16">
<Image src={town.img} alt={town.location} layout="fill" objectFit="cover" className="rounded-lg" />
<div className="absolute bottom-0 left-0 p-2 bg-white bg-opacity-75">
  <h2 className="text-lg font-semibold">{town.location}</h2>
  <p className="text-gray-500">{town.distance}</p>
</div>
</div> */}