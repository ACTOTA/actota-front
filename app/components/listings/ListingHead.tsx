'use client';

import Image from "next/image";
import Heading from "../Heading";
import StarButton from "../StarButton";

import { SafeUser } from "@/app/types";

import useTowns from "@/app/hooks/useTowns";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  imageSrc: string;
  id: string;
  currentUser?: SafeUser | null
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser
}) => {
  const { getByValue } = useTowns();

  const location = getByValue(locationValue);
  
    return ( 
    <>
      <Heading 
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        <Image
          src={imageSrc}
          fill
          className="object-cover w-full"
          alt="Image"
        />
        <div
          className="absolute top-5 right-5"
        >
          <StarButton
            listingId={id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
   );
}
 
export default ListingHead;









