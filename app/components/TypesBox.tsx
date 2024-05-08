'use client';

import { IconType } from "react-icons";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


interface TypesBoxProps {
  icon: IconType,
  label: string;
  checked?: [];
}

const TypesBox: React.FC<TypesBoxProps> = ({
  icon: Icon,
  label,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const [check, setCheck] = useState(false);


  const handleClick = useCallback(() => {

    setCheck(!check);

  }, [ check]); 

  useEffect(() => {
    console.log("Types Box check:    ", check);
  }, [check, handleClick]);

  return ( 
    <div
      onClick={handleClick}
      className={`
        border-b-2
       
        m-auto
        flex
        gap-6
        h-12
        w-full
        hover:scale-105
        transition 
        transform 
        duration-200 
        ease-in
        cursor-pointer
        ${check ? 'bg-logo-blue text-white border-3' : ' hover:bg-slate-200 bg-white'}
      `}
    >
      
      {/* <Icon size={40} className= "my-auto text-white border-2 border-black rounded-full bg-logo-blue" style={{ marginLeft: '5px' }} /> */}
      <Icon
        size={40}
        className={`
          bg-white 
          border-2
          
          my-auto 
          rounded-full 
          text-black
          ${check ? ' bg-logo-blue  border-logo-yellow' : 'text-slate-500 bg-logo-blue '
          }
        `}
        style={{ marginLeft: '5px' }}
      />
      <div className="my-auto text-sm font-medium ">
        {label}
      </div>
    </div>
   );
}
 
export default TypesBox;