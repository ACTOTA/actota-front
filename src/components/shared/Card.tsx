import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  variant?: 'default' | 'subtle' | 'bordered';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  variant = 'default' 
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-[#141414] border border-gray-800',
    subtle: 'bg-[#0A0A0A] border border-gray-900',
    bordered: 'bg-transparent border border-gray-700 hover:border-gray-600'
  };
  
  const paddingStyles = noPadding ? '' : 'p-6';
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;