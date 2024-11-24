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
} & React.HTMLAttributes<HTMLButtonElement>;

export default function ItineraryDropdown({
  children,
  options = [],
  className,
  isLoading = false,
  onSelect,
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
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className={`rounded-[8px] h-[56px] neutral-03 px-4 text-md stroke-glass-01-thin translucent-black-30 before:rounded-[8px] border-none flex justify-between items-center ${className}`}
        onClick={handleToggle}
        disabled={isLoading}
        {...rest}
      >
        <div className="flex gap-6 text-neutral-04">
          {isLoading ? "Loading activities..." : children}
        </div>
        <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px]" />
      </button>

      {isOpen && !isLoading && (
        <ul className="absolute mt-2 translucent-black-30 shadow-lg rounded-[8px] w-full z-10 text-white">
          {options.map((option, i) => (
            <li
              key={i}
              className="h-4 px-4 py-2 cursor-pointer hover:bg-opacity-20 hover:bg-white"
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
