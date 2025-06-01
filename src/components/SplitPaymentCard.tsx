'use client';
import React from 'react';
import Image from 'next/image';
import { IoCheckmark, IoLocationOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';

interface SplitPaymentCardProps {
    name: string;
};


const SplitPaymentCard = ({ name }: SplitPaymentCardProps) => {
    return (
        <div className="p-6">
            <div className="flex items-start justify-between">
                {/* Left side - Split payment details */}
                <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    
                    {/* Benefits */}
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <IoCheckmark className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">$199 due today, $199 on March 28</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <IoCheckmark className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">0% interest</p>
                        </div>
                    </div>
                    
                    {/* Learn more link */}
                    <button className="flex items-center gap-1 text-[#BBD4FB] hover:text-white transition-colors">
                        <span className="text-sm">Learn more</span>
                    </button>
                </div>

                {/* Right side - Checkbox */}
                <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                        />
                        <div className="w-6 h-6 rounded-md border-2 bg-transparent border-gray-600 hover:border-gray-400 transition-all duration-200 flex items-center justify-center peer-checked:bg-[#BBD4FB] peer-checked:border-[#BBD4FB]">
                            <IoCheckmark className="text-black h-4 w-4 opacity-0 peer-checked:opacity-100" />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SplitPaymentCard; 