import React from 'react';

interface ActivityTagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const ActivityTag: React.FC<ActivityTagProps> = ({ 
  children, 
  icon, 
  variant = 'primary',
  className = '' 
}) => {
  const baseClasses = 'rounded-full px-3 h-8 flex items-center justify-center gap-2 text-xs font-medium';
  
  const variantClasses = {
    primary: 'bg-blue-500/20 text-blue-400',
    secondary: 'bg-[#0F0F0F] border border-[#222] text-white'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {icon && icon}
      <span className='text-center'>{children}</span>
    </div>
  );
};

export default ActivityTag;