"use client";

import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

type InputProps = {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  icon?: React.ReactNode;
  classname?: string;
  widthIcon?: string;
  rightIcon?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Input({ id, name, type, placeholder, value, icon, classname, widthIcon, rightIcon, onChange, readOnly }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className={`relative overflow-hidden text-white bg-black/50 focus-within:border-white border border-primary-gray focus-within:border-1 rounded-lg ${classname}`}>
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex justify-center items-center">
          {icon}
        </div>
      )}
      <input
        readOnly={readOnly}
        id={id}
        name={name}
        type={type === 'password' && !showPassword ? 'password' : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`block w-full bg-transparent placeholder:text-primary-gray py-4 !font-manrope
          focus:ring-0 focus:outline-none sm:text-sm sm:leading-6 h-full border-none
          ${icon && 'pl-12'} ${type === 'password' && 'pr-10 bg-transparent'}
        `}
      />

      {type === 'password' && ( // Only show eye icon for password inputs
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-white cursor-pointer" onClick={toggleShowPassword}>
          {/* Assuming you have an EyeOpen and EyeClosed icon component */}
          {showPassword ? <HiEyeOff className={widthIcon} /> : <HiEye className={widthIcon} />}
        </div>
      )}
    {rightIcon && (
      <div className='absolute inset-y-0 right-0 px-3 flex items-center bg-black z-50 text-white cursor-pointer'>
        {rightIcon}
      </div>
    )}
    </div>
  )
}
