import { XMarkIcon } from "@heroicons/react/20/solid";

const ActivityTag = ({ activities, activity, className = '', onClick, selected = false, unavailable = false }: any) => {
    const activityData = activities.find((a: any) => a.id === activity);

    if (!activityData) return null;
  
  
    const { icon: Icon, label } = activityData;
  
    return (
      <button type="button" onClick={onClick} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${selected ? 'bg-white text-black' : `bg-[#262626] ${!unavailable ? 'text-white' : 'text-primary-gray'}    hover:bg-[#262626]/40`} ${className}`}>
        <Icon  />
        <p className="text-sm">
          {label}
        </p>
        {selected && <XMarkIcon className="w-5 h-5  text-black" />}
      </button>
    );
  };

  export default ActivityTag;