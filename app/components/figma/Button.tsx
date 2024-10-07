import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, onClick, ...rest }: ButtonProps) {


  return (
    <>
      <button
        type="button"
        className={`rounded-[200px] bg-white text-black py-3 px-6 ${className}`}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    </>
  )
}
