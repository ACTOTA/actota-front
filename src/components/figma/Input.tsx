"use client";

import React, {useState} from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

type InputProps = {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  icon?: React.ReactNode;
  classname?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Input({id, name, type, placeholder, value, icon, classname, onChange}: InputProps) { 
  const [showPassword, setShowPassword] = useState(type === 'password'); 

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
      <div className={`relative`}>
      {icon ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex justify-center items-center">
          {icon} 
        </div>
        ) : null
      }
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`block w-full text-white bg-black/50 placeholder:text-primary-gray py-4 rounded-xl
            focus:border-white focus:border-1 focus:ring-0 sm:text-sm sm:leading-6 h-full 
          ${icon ? 'pl-10': ''} ${classname}`}
        /> 

      {type === 'password' && ( // Only show eye icon for password inputs
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-white cursor-pointer" onClick={toggleShowPassword}>
          {/* Assuming you have an EyeOpen and EyeClosed icon component */}
          {showPassword ? <HiEye /> : <HiEyeOff />} 
        </div>
      )}
      </div>
  )
}
