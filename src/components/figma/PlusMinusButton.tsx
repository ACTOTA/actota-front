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
      <button className={`hover:cursor-pointer  border border-border-primary rounded-full p-1 bg-gradient-to-br from-[#6B6B6B]/50 to-black/20  ${className}`} onClick={onClick}>
       { buttonType === "plus" ? <PlusIcon className="h-6 w-6 text-white"/> : <MinusIcon className="h-6 w-6 text-white"/> } 
      </button>
    )
}

export default PlusMinusButton;
