import React from 'react';

type InputProps = {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  classname?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Input({id, name, type, placeholder, icon, classname}: InputProps) { 

  return (
      <div className={`relative mt-2 rounded-md shadow-sm ${classname}`}>
      {icon ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 top-1/2 -translate-y-1/2">
          {icon} 
        </div>
        ) : null
      }
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="block w-full rounded-full border-0 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-full translucent-black-30 neutral-03"
        /> 
      </div>
  )
}
