import { XMarkIcon } from "@heroicons/react/20/solid";

const ActivityTag = ({ activities, activity, className = '', onClick, selected = false, unavailable = false }: any) => {
    const activityData = activities.find((a: any) => a.id === activity);

    if (!activityData) return null;
  
  
    const { icon: Icon, label } = activityData;
  
    return (
      <button 
        type="button" 
        onClick={onClick} 
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
          ${selected 
            ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-400/50' 
            : unavailable 
              ? 'bg-gray-800/50 text-gray-500 border border-gray-700 cursor-not-allowed opacity-60'
              : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 hover:text-white'
          } 
          ${className}`}
        disabled={unavailable}
      >
        <Icon className={`w-4 h-4 ${selected ? 'text-white' : unavailable ? 'text-gray-600' : 'text-gray-400'}`} />
        <span className="text-sm">
          {label}
        </span>
        {selected && <XMarkIcon className="w-4 h-4 text-white ml-1" />}
      </button>
    );
  };

  export default ActivityTag;