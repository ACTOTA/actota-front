import React from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';

export enum ButtonType {
  plus = "plus",
  minus = "minus"
}

interface PlusMinusButtonProps {
  className?: string;
  buttonType: ButtonType;
  onClick?: () => void;
}

const PlusMinusButton: React.FC<PlusMinusButtonProps> = ({ className, buttonType, onClick }) => {

    return (
      <button 
        className={`hover:cursor-pointer border border-gray-600 rounded-full p-1.5 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200 ${className}`} 
        onClick={onClick}
      >
       { buttonType === "plus" ? 
         <PlusIcon className="h-5 w-5 text-gray-300 hover:text-white"/> : 
         <MinusIcon className="h-5 w-5 text-gray-300 hover:text-white"/> 
       } 
      </button>
    )
}

export default PlusMinusButton;
