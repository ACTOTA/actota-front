'use Client';

import qs from 'query-string';
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";

interface ActivityBoxProps {
  icon: IconType,
  label: string;
  selected?: boolean;
}

const ActivityBox: React.FC<ActivityBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};
    
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      activity: label
    }

    if (params?.get('activity') === label) {
      delete updatedQuery.activity;
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, { skipNull: true });

    router.push(url);
  }, [label, router, params]);

  return ( 
    <div
      onClick={handleClick}
      className={`

        border-2
        rounded-full
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
        ${selected ? 'bg-logo-blue text-white border-3' : ' hover:bg-slate-200 bg-white'}
      `}
    >
      
      {/* <Icon size={40} className= "bg-logo-blue border-2 border-black my-auto rounded-full text-white" style={{ marginLeft: '5px' }} /> */}
      <Icon
        size={40}
        className={`
          bg-white 
          border-2
          
          my-auto 
          rounded-full 
          text-black
          ${selected ? ' bg-logo-blue  border-logo-yellow' : 'text-slate-500 bg-logo-blue '
          }
        `}
        style={{ marginLeft: '5px' }}
      />
      <div className="font-medium text-sm my-auto ">
        {label}
      </div>
    </div>
   );
}
 
export default ActivityBox;