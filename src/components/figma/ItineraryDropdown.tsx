'use client';

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";

type DropdownOption = {
  label: string;
  description?: string;
  tags?: string[];
};

type ItineraryDropdownProps = {
  children?: React.ReactNode;
  options: DropdownOption[]; // Array of options for the dropdown
  className?: string;
  isLoading?: boolean;
  onSelect?: (value: string | number) => void; // Callback when an option is selected
  selected: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function ItineraryDropdown({
  children,
  options = [],
  className,
  isLoading = false,
  onSelect,
  selected,
  ...rest
}: ItineraryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isLoading) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (value: string | number) => {
    if (onSelect) {
      onSelect(value);
    }

    console.log(value);
    setIsOpen(false);
  };

  return (
    <div className="relative border border-primary-gray rounded-lg">
      <button
        className={`rounded-[8px] h-[48px]  px-4 text-md  before:rounded-[8px]  w-full  flex items-center  ${className}`}
        onClick={handleToggle}
        disabled={isLoading}
        {...rest}
      >
        <p className="flex gap-6 text-left mr-auto">
          {selected}
        </p>

        <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px " />
      </button>

      {!isOpen && (
        <ul className="absolute bg-black shadow-lg rounded-[8px] w-full z-10 text-white text-center">
          {options.map((option, i) => (
            <li
              key={i}
              className="h-6 px-2 py-2 cursor-pointer text-sm hover:bg-opacity-20 hover:bg-white"
              onClick={() => handleOptionClick(option.label)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
