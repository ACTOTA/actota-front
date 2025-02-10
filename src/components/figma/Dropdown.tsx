// components/Dropdown.js
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface DropdownProps {
  label?: string;
  options: string[];
  onSelect: (selected: string | string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  className?: string;
}

export default function Dropdown({ 
  label, 
  options, 
  onSelect, 
  placeholder = "Select", 
  multiSelect = false,
  className
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[] | string | null>(multiSelect ? [] : null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    if (multiSelect) {
      const isSelected = (selected as string[])?.includes(option);
      const newSelected = isSelected
        ? (selected as string[]).filter((item) => item !== option)
        : [...(selected as string[] || []), option];
      setSelected(newSelected);
      onSelect(newSelected);
    } else {
      setSelected(option);
      onSelect(option);
      setIsOpen(false);
    }
  };

  const isSelected = (option: string) =>
    multiSelect ? (selected as string[])?.includes(option) : selected === option;

  return (
    <div className={`relative inline-block w-full `}>
      <button
        type="button"
        className={`w-full px-4 py-3 text-left bg-black/20 text-white rounded-lg  hover:bg-[#262626] focus:outline-none border border-primary-gray ${className}`}
        onClick={toggleDropdown}
      >
        {multiSelect
          ? (selected as string[])?.length > 0
            ? (selected as string[]).join(", ")
            : placeholder
          : selected || placeholder}
        <span className="float-right">{isOpen ? <ChevronUpIcon aria-hidden="true" className="h-[24px] w-[24px " /> : <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px " />}</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-black border border-primary-gray text-white rounded-lg shadow-lg mt-2 max-h-48 overflow-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-[#262626] ${
                isSelected(option) ? "bg-[#262626]" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
