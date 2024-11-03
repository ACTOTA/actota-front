import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { HiEye, HiEyeOff } from 'react-icons/hi';

type InputProps = {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  classname?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Input({id, name, type, placeholder, icon, classname}: InputProps) { 
  const [showPassword, setShowPassword] = React.useState(false);

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
          className={`block w-full text-white placeholder:text-gray-400 py-4 rounded-xl
          focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-full translucent-black-30 neutral-03
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
