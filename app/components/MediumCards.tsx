import React from 'react';
import Image from 'next/image';

interface Town {
  img: string;
  label: string;
  subtitle: string;
}

interface TravelModeProps {
  towns: Town[];
}
export const TravelModeData = [

  
  { img: "/images/TravelModeImages/Mindfulness/Mindfulness4.jpg", 
    label: "Mindfulness Focused", 
    subtitle: "Calm contemplation in the Rockies" 
    },
    
    
  {
    img: "/images/TravelModeImages/NatureImerssion/NatureImerssion2.jpg",
    label: "Nature Focused",
    subtitle: "Connect Deep with Nature's Beauty"
    },
   
    { img: "/images/TravelModeImages/CulturalImerssion/CulturalImerssion2.jpg", 
  label: "Culture Focused", 
  subtitle: "Engage with local history" 
    },
    
    { img: "/images/TravelModeImages/Intense/Intense1.jpg", 
  label: "Challenge Focused", 
  subtitle: "Challenge yourself in the Rockies" 
    },

    { img: "/images/TravelModeImages/Exciting/Exciting.jpg", 
    label: "Exciting Focused", 
    subtitle: "Enjoy the thrill of Colorado" 
      },
    


];

interface Town {
    img: string;
    label: string;
    distance: string;
    subtitle: string; // Add the 'subtitle' property
}

const MediumCards: React.FC<TravelModeProps> = ({ towns }) => {
    return (
        <div className='flex pb-6 space-x-4 overflow-scroll'>
            {towns.map((town, index) => (
                <div key={index} className="transition duration-300 ease-out transform cursor-pointer hover:scale-105"> 
                    <div className="relative h-72 w-72">
                        <Image src={town.img} alt={town.label} layout="fill" className="rounded-xl" />
                        </div>
                        <h2 className="mx-2 mt-3 text-2xl font-semibold">{town.label}</h2>
                        <h3 className="mx-2 text-gray-500 text-s">{town.subtitle}</h3>
                </div>
            ))}
        </div>
    );
};

export default MediumCards;
{/* <div key={index} className="relative w-16 w-full h-16">
<Image src={town.img} alt={town.location} layout="fill" objectFit="cover" className="rounded-lg" />
<div className="absolute bottom-0 left-0 p-2 bg-white bg-opacity-75">
  <h2 className="text-lg font-semibold">{town.location}</h2>
  <p className="text-gray-500">{town.distance}</p>
</div>
</div> */}