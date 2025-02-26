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
        className={`w-full px-4 py-3 text-left bg-black/20 text-white rounded-lg hover:bg-[#262626] focus:outline-none border border-primary-gray whitespace-nowrap flex items-center justify-between ${className}`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          {displaySelectedItems()}
        </div>
        <span className="float-right">{isOpen ? <ChevronUpIcon aria-hidden="true" className="h-[24px] w-[24px " /> : <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px " />}</span>
      </button>

      {isOpen && (
        <div className="absolute p-3 z-10 w-full bg-black border border-primary-gray text-white rounded-lg shadow-lg mt-2 max-h-[466px] overflow-auto">
          <p className="text-lg font-bold text-white"> <span className="max-lg:hidden "> Select Preferred </span> {title}</p>
          <p className="text-sm  text-white">{selected.length} Selected</p>
          <p className="text-sm  text-white flex items-center gap-2 mt-4 "><input type="checkbox" checked={anySelected} onChange={() => setAnySelected(!anySelected)} className="rounded ring-0 focus:ring-0 focus:ring-offset-0" /> Any</p>

          <div className="flex flex-wrap gap-1 my-4">
            {activities.filter(activity => !activity.unavailable).map((activity) => (
              <ActivityTag key={activity.id} activities={activities} activity={activity.id} onClick={() => handleSelect(activity.id)} selected={selected.includes(activity.id)} />
            ))}
          </div>


          {title == "Activities" && <div>
            <p className="text-sm text-white flex items-center gap-2"><GoAlert /> Unavailable</p>
            <p className="text-sm text-primary-gray">These activities are only available on December-March.</p>
            <div className="flex flex-wrap gap-1 my-4">
              {activities.filter(activity => activity.unavailable).map((activity) => (
                <ActivityTag unavailable={true} key={activity.id} activities={activities} activity={activity.id} onClick={() => handleSelect(activity.id)} selected={selected.includes(activity.id)} />
              ))}
            </div>
          </div>}
          {showSaveButton && <div className="flex justify-end mt-4">
            <Button variant="primary" size="md" className="">Save</Button>
          </div>}

        </div>
      )}
    </div>
  );

};




