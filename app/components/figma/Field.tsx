import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React from 'react';

type FieldProps = {
    children: React.ReactNode;
    className?: string;
    imageProps?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;


export default function Field({children, className, imageProps}: FieldProps) {
    return (    
        <div className='flex justify-start'>
          {imageProps}
        <button className="rounded-[16px] border-[1px] top-[1327px] left-[217px] w-[536px] h-[56px] translucent-black30 neutral-03 p-[
0px, 16px, 0px, 16px] justify-between">
          {children}
          <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px] text-gray-400" />
        </button>
      </div>
    )
}