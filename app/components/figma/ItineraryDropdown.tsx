import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";

type DropdownOption = {
  label: string;
  value: string | number;
};

type ItineraryDropdownProps = {
  children: React.ReactNode;
  options: DropdownOption[]; // Array of options for the dropdown
  className?: string;
  onSelect?: (value: string | number) => void; // Callback when an option is selected
} & React.HTMLAttributes<HTMLButtonElement>;

export default function ItineraryDropdown({
  children,
  options,
  className,
  onSelect,
  ...rest
}: ItineraryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (value: string | number) => {
    if (onSelect) {
      onSelect(value); // Trigger callback with the selected value
    }
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      {/* Button to trigger dropdown */}
      <button
        className={`rounded-[8px] h-[56px] neutral-03 px-4 text-md stroke-glass-01-thin translucent-black-30 before:rounded-[8px] border-none flex justify-between items-center ${className}`}
        onClick={handleToggle}
        {...rest}
      >
        <div className="flex gap-6 text-neutral-04">{children}</div>
        <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px]" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute mt-2 translucent-black-30 shadow-lg rounded-[8px] w-full z-10 text-white">
          {options?.map((option, i) => (
            <li
              key={i}
              className="h-4 px-4 py-2 cursor-pointer"
              onClick={() => handleOptionClick(option.value)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

