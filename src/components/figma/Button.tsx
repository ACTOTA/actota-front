import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  variant?: 'simple' | 'primary' | 'secondary' | 'outline' | 'disabled';
  size?: 'sm' | 'md' | 'lg' | 'none';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ 
  children, 
  className = '', 
  isLoading, 
  onClick, 
  variant = 'simple',
  size = 'md',
  ...rest 
}: ButtonProps) {

  const baseStyles = "rounded-full text-center flex justify-center items-center font-bold hover:cursor-pointer transition-all duration-200";
  
  const variantStyles = {
    simple: "bg-transparent text-white hover:bg-white/10",
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "bg-black/30 text-white hover:bg-black/40",
    outline: "bg-transparent border border-border-primary text-white hover:bg-white/10",
    disabled: "opacity-50 cursor-not-allowed"

  };

  const sizeStyles = {

    sm: "py-2 px-4 text-sm leading-5",
    md: "py-[16px] px-6 text-[16px] leading-[24px]",
    lg: "py-5 px-8 text-lg leading-7",
    none: "p-2"
  };

  return (
    <button
      type="button"
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={isLoading || variant === 'disabled'}
      {...rest}
    >
      {isLoading ? (
        <div className="animate-pulse flex justify-center gap-2">
          <div className="rounded-full h-5 w-5 bg-gray-200"></div>
          <div className="rounded-full h-5 w-5 bg-gray-200"></div>
          <div className="rounded-full h-5 w-5 bg-gray-200"></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </button>
  );
}
