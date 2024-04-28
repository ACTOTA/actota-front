'use client';

import { IconType } from "react-icons";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


interface ActivityBoxProps {
  icon: IconType,
  label: string;
  checked?: [];
}

const ActivityBox: React.FC<ActivityBoxProps> = ({
  icon: Icon,
  label,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const [check, setCheck] = useState(false);


  const handleClick = useCallback(() => {

    setCheck(!check);

  }, [router, params, check]); 

  useEffect(() => {
    console.log("ActivityBox check:    ", check);
  }, [check, handleClick]);

  return ( 
    <div
      onClick={handleClick}
      className={`
      hover:bg-slate-300
        border-blue-100
        border-2
        rounded-full
        m-auto
        flex
        gap-6
        h-14
        w-1/2
        hover:text-logo-blue
        transition
        cursor-pointer
        ${check ? 'bg-slate-300' : 'bg-white'}
      `}
    >
      <Icon size={26} className="my-auto"/>
      <div className="font-medium text-sm my-auto">
        {label}
      </div>
    </div>
   );
}
 
export default ActivityBox;