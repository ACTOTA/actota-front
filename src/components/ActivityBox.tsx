import { IconType } from "react-icons";
import { useCallback, useEffect, useState } from "react";

interface ActivityBoxProps {
  icon: IconType;
  label: string;
  duration: number;
  selected?: boolean;
  onClick: (activity: ActivitySelectValue) => void;
}

type ActivitySelectValue = {
  label: string;
  duration: number;
};

const ActivityBox: React.FC<ActivityBoxProps> = ({
  icon: Icon,
  label,
  duration,
  selected,
  onClick,
}) => {
  const [isChecked, setIsChecked] = useState(selected);

  useEffect(() => {
    setIsChecked(selected);
  }, [selected]);

  const handleClick = useCallback(() => {
    setIsChecked(!isChecked);
    onClick({ label, duration }); // Pass label and duration to the onClick function
  }, [isChecked, label, duration, onClick]);

  return (
    <div
      onClick={handleClick}
      className={`
        border-2
        rounded-full
        m-auto
        flex
        gap-6
        h-12
        w-full
        hover:scale-105
        transition 
        transform 
        duration-200 
        ease-in
        cursor-pointer
        ${isChecked ? 'bg-logo-blue text-white border-3' : 'hover:bg-slate-200 bg-white'}
      `}
    >
      <Icon
        size={40}
        className={`
          bg-white 
          border-2
          my-auto 
          rounded-full 
          text-black
          ${isChecked ? ' bg-logo-blue  border-logo-yellow' : 'text-slate-500 bg-logo-blue'}
        `}
        style={{ marginLeft: '5px' }}
      />
      <div className="my-auto text-sm font-medium">
        {label}
      </div>
    </div>
  );
}

export default ActivityBox;
