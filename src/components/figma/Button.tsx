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
        className={`rounded-full text-center py-[16px] px-6 flex justify-center items-center text-[16px] font-bold leading-[24px] hover:cursor-pointer ${className}`}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    </>
  )
}
