import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState, useEffect, useRef } from "react";
import { TbArrowsSort } from "react-icons/tb";

export interface SortOption {
  id: string;
  name: string;
}

interface SortDropdownProps {
  options: SortOption[];
  onSelect: (selectedOption: SortOption) => void;
  selectedId?: string;
  placeholder?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export default function SortDropdown({
  options,
  onSelect,
  selectedId,
  placeholder = "Sort by",
  className = "",
  showLabel = true,
  label = "Sort By"
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.id === selectedId);
  const displayText = selectedOption?.name || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: SortOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <TbArrowsSort className="w-4 h-4" />
          {label}
        </label>
      )}
      
      <div className={`relative w-full ${className}`} ref={dropdownRef}>
        <button
          type="button"
          className="w-full px-4 py-3 text-left bg-[#141414] text-white rounded-lg hover:bg-[#262626] focus:outline-none border border-gray-800 hover:border-gray-600 focus:border-blue-500 flex items-center justify-between gap-2 transition-all duration-200 overflow-hidden"
          onClick={toggleDropdown}
        >
          <span className="text-sm font-medium truncate">{displayText}</span>
          <span className="flex-shrink-0">
            {isOpen ? (
              <ChevronUpIcon aria-hidden="true" className="h-5 w-5" />
            ) : (
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
            )}
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 w-full bg-[#141414] text-white rounded-lg shadow-lg mt-2 max-h-48 overflow-y-auto border border-gray-800">
            {options.map((option) => (
              <li
                key={option.id}
                className={`px-4 py-3 cursor-pointer hover:bg-[#262626] transition-colors ${
                  selectedId === option.id ? "bg-[#262626] text-yellow-400" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                <span className="text-sm font-medium">{option.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}