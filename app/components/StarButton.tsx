'use client';

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

// import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";

import ClientOnly from "./ClientOnly";
import useFavorite from "../hooks/useFavorite";

interface StarButtonProps {
  listingId: string
  currentUser?: SafeUser | null
}

const StarButton: React.FC<StarButtonProps> = ({ 
  listingId,
  currentUser
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser
  });

  return (
    <div 
      onClick={toggleFavorite}
      className="relative transition cursor-pointer hover:opacity-80"
    >
      <AiOutlineStar
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillStar
        size={24}
        className={
          hasFavorited ? 'fill-logo-yellow ' : 'fill-neutral-500/70'
        }
      />
    </div>
   );
}
 
export default StarButton;