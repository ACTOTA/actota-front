// components/Dropdown.js
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Button from "../figma/Button";
import ActivityTag from "./ActivityTag";
import { FaMotorcycle } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { GoAlert } from "react-icons/go";


type ActivityType = {
  id: string;
  label: string;
  icon: IconType;
  unavailable?: boolean;
}

interface ActivityDropdownProps {
  onSelect: (selected: string | string[]) => void;
  className?: string;
  activities: ActivityType[];
  title?: string;
  showSaveButton?: boolean;
}


export default function ActivityDropdown({
  onSelect,
  className,
  activities,
  title,
 showSaveButton = true
}: ActivityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [anySelected, setAnySelected] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    const isSelected = selected.includes(option);
    const newSelected = isSelected
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    setSelected(newSelected);
    onSelect(newSelected);
    // setIsOpen(false);
  }

  const displaySelectedItems = () => {
    if (selected.length === 0) return `Select  ${title}`;

    if (selected.length > 3) {
      const displayItems = selected.slice(0, 2);
      return (
        <>
          {displayItems.map((item) => (
            <ActivityTag
              activities={activities}
              key={item}
              activity={item}
              onClick={() => { }}
              selected={false}
            />
          ))}
          <span className="text-white">{`+${selected.length - 2} `}</span>
        </>
      );
    }

    return selected.map((item) => (
      <ActivityTag
        activities={activities}
        key={item}
        activity={item}
        onClick={() => { }}
        selected={false}
      />
    ));
  };

  return (
    <div className={`relative inline-block w-full `}>
      <button
        type="button"
        className={`w-full px-4 py-3 text-left bg-gray-800/50 text-white rounded-lg hover:bg-gray-800/70 focus:outline-none border border-gray-700 hover:border-gray-600 whitespace-nowrap flex items-center justify-between transition-all duration-200 ${className}`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          {displaySelectedItems()}
        </div>
        <span className="float-right">{isOpen ? <ChevronUpIcon aria-hidden="true" className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />}</span>
      </button>

      {isOpen && (
        <div className="absolute p-4 z-10 w-full bg-black/95 backdrop-blur-xl border border-gray-700 text-white rounded-xl shadow-2xl mt-2 max-h-[466px] overflow-auto">
          <div className="mb-4">
            <p className="text-lg font-semibold text-white">Select {title}</p>
            <p className="text-sm text-gray-400 mt-1">{selected.length} selected</p>
          </div>
          
          <label className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              checked={anySelected} 
              onChange={() => setAnySelected(!anySelected)} 
              className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" 
            /> 
            <span className="text-sm font-medium">Any {title?.toLowerCase()}</span>
          </label>

          <div className="flex flex-wrap gap-1 my-4">
            {activities.filter(activity => !activity.unavailable).map((activity) => (
              <ActivityTag key={activity.id} activities={activities} activity={activity.id} onClick={() => handleSelect(activity.id)} selected={selected.includes(activity.id)} />
            ))}
          </div>


          {title == "Activities" && activities.some(activity => activity.unavailable) && (
            <div className="mt-6 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-sm text-yellow-400 flex items-center gap-2 font-medium">
                <GoAlert className="h-4 w-4" /> Seasonal Activities
              </p>
              <p className="text-sm text-gray-400 mt-1">Available December - March only</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {activities.filter(activity => activity.unavailable).map((activity) => (
                  <ActivityTag unavailable={true} key={activity.id} activities={activities} activity={activity.id} onClick={() => handleSelect(activity.id)} selected={selected.includes(activity.id)} />
                ))}
              </div>
            </div>
          )}
          
          {showSaveButton && (
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-800">
              <Button 
                variant="primary" 
                size="md" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Save Selection
              </Button>
            </div>
          )}

        </div>
      )}
    </div>
  );

};




