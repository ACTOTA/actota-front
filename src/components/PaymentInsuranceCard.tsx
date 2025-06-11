'use client';
import React from 'react';
import Image from 'next/image';
import { IoCheckmark } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';

interface InsuranceItem {
    id: number;
    name: string;
    price: number;
    image: string;
    selected: boolean;
}

interface PaymentInsuranceCardProps {
    insurance: InsuranceItem;
    onToggleSelect: (id: number) => void;
}

const PaymentInsuranceCard = ({ insurance, onToggleSelect }: PaymentInsuranceCardProps) => {
    const { id, name, price, image, selected } = insurance;
    
    return (
        <div className="p-6">
            <div className="flex items-start justify-between">
                {/* Left side - Insurance details */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${selected ? 'bg-[#BBD4FB]/20' : 'bg-gray-800'} flex items-center justify-center transition-colors`}>
                            <Image src={image} alt={name} width={24} height={24} className="opacity-80" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{name}</h3>
                        </div>
                    </div>
                    
                    {/* Benefits list */}
                    <div className="space-y-2 pl-13">
                        {['Up to 100% reimbursement for covered reasons',
                          'Flight delay reimbursements up to $235',
                          'Free cancellation due to illness and more'
                        ].map((benefit, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <IoCheckmark className="text-green-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300 text-sm">{benefit}</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Mobile price */}
                    <div className="flex items-baseline gap-1 sm:hidden pl-13">
                        <span className="text-2xl font-bold">${price}</span>
                        <span className="text-gray-400 text-sm">per person</span>
                    </div>
                </div>

                {/* Right side - Price and checkbox */}
                <div className="flex items-center gap-6 ml-4">
                    {/* Desktop price */}
                    <div className="hidden sm:flex items-baseline gap-1">
                        <span className="text-2xl font-bold">${price}</span>
                        <span className="text-gray-400 text-sm">per person</span>
                    </div>
                    
                    {/* Checkbox */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={selected}
                            onChange={() => onToggleSelect(id)}
                            className="sr-only peer" 
                        />
                        <div className={`w-6 h-6 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                            selected 
                                ? 'bg-[#BBD4FB] border-[#BBD4FB]' 
                                : 'bg-transparent border-gray-600 hover:border-gray-400'
                        }`}>
                            {selected && <IoCheckmark className="text-black h-4 w-4" />}
                        </div>
                    </label>
                </div>
            </div>
            
            {/* Learn more link */}
            <button className="flex items-center gap-1 text-[#BBD4FB] hover:text-white transition-colors mt-4 pl-13">
                <span className="text-sm">Learn more</span>
                <CgArrowTopRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export default PaymentInsuranceCard; 