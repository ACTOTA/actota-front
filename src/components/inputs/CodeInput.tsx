'use client';

import React, { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';

interface CodeInputProps {
  length: number;
  onChange: (code: string) => void;
  value: string;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
}

export default function CodeInput({
  length,
  onChange,
  value,
  disabled = false,
  autoFocus = true,
  error = false
}: CodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    const newValue = inputValue.slice(-1);
    const newCode = value.split('');
    newCode[index] = newValue;
    
    const updatedCode = newCode.join('');
    onChange(updatedCode);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedCode.length === length && !updatedCode.includes('')) {
      onChange(updatedCode);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = value.split('');
      
      if (newCode[index]) {
        newCode[index] = '';
        onChange(newCode.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = '';
        onChange(newCode.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData) {
      onChange(pastedData);
      
      const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className={`
            w-12 h-14 text-center text-xl font-semibold rounded-lg
            border-2 transition-all duration-200
            ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white text-black'}
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            focus:outline-none focus:ring-2
          `}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}