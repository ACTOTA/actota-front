import React from 'react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa6';
import { CiCalendar } from 'react-icons/ci';

interface StatusBadgeProps {
  status: string;
  label: string;
  variant?: 'default' | 'small';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  variant = 'default' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400";
      case "ongoing":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-gray-500/20 text-gray-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <CiCalendar className='size-4' />;
      case "ongoing":
        return <Image src="/svg-icons/ongoing-icon.svg" alt="clock" width={16} height={16} />;
      case "completed":
        return <FaCheck className='size-3' />;
      case "cancelled":
        return <span className='text-xs'>✕</span>;
      default:
        return <FaCheck className='size-3' />;
    }
  };

  const sizeClasses = variant === 'small' 
    ? 'px-2 py-1 text-xs' 
    : 'px-3 py-1.5 text-xs';

  return (
    <div className={`${sizeClasses} rounded-full font-medium flex items-center gap-2 ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {label}
    </div>
  );
};

export default StatusBadge;