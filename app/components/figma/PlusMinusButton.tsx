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

const PlusMinusButton: React.FC<PlusMinusButtonProps> = ({ className, buttonType, onClick }) : PlusMinusButtonProps => {

    return (
      <button className={`hover:cursor-pointer stroke-glass-01-thin glass-corner rounded-full p-1 ${className}`} onClick={onClick}>
       { buttonType === "plus" ? <PlusIcon className="h-6 w-6 text-white"/> : <MinusIcon className="h-6 w-6 text-white"/> } 
      </button>
    )
}

export default PlusMinusButton;
