'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";

import ClientOnly from "./ClientOnly";

interface HeartButtonProps {
  listingId: string
  currentUser?: SafeUser | null
}

const HeartButton: React.FC<HeartButtonProps> = ({ 
  listingId,
  currentUser
}) => {


  return (
    <div 
      onClick={toggleFavorite}
      className="flex justify-center items-center transition cursor-pointer hover:opacity-80 
      rounded-full h-10 w-10 glass-blur glass-light glass-stroke-1"
    >
      {hasFavorited ? (
        <AiFillHeart
          size={24}
          className="red-04" />
      ) : (
        <AiOutlineHeart
          size={28}
          className="fill-white" />
        )}  
    </div>
   );
}
 
export default HeartButton;
