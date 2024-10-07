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
        className={`rounded-[200px] bg-white text-black text-center py-3 px-6 flex justify-center items-center text-lg ${className}`}
        style={{ lineHeight: '1' }}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    </>
  )
}
