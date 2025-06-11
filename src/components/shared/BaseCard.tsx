import React from 'react';

interface BaseCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333] rounded-2xl p-6 hover:border-[#555] transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default BaseCard;