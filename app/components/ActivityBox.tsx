'use client';

import qs from "query-string";
import { IconType } from "react-icons";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";


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
        ${selected ? 'text-logo-blue' : 'text-neutral-500'}
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