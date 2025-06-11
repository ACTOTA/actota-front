import React from 'react';

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface InfoGridProps {
  items: InfoItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const InfoGrid: React.FC<InfoGridProps> = ({ 
  items, 
  columns = 4, 
  className = '' 
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className='flex flex-col gap-1'>
          <p className='flex items-center gap-2 text-xs text-gray-400'>
            {item.icon} {item.label}
          </p>
          <p className='text-white text-sm font-medium'>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;