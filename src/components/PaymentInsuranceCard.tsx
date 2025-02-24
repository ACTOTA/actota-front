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
        <div className={`relative flex justify-between max-w-[843px] bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 border ${selected ? 'border-[#BBD4FB]' : 'border-primary-gray'} rounded-xl`}>
            <div className="flex flex-col gap-2 relative p-4">
                {selected && (
                    <Image 
                        src="/images/payment-page-card-blur-bg.png" 
                        className="absolute top-[100px] left-[-100px]" 
                        alt="background effect" 
                        layout="fill" 
                    />
                )}

                <div className="flex items-center gap-2">
                    <Image src={image} alt={name} width={32} height={32} />
                    <h3 className="text-white text-xl font-bold">{name}</h3>
                </div>
                
                {/* Benefits list */}
                {['Up to 100% reimbursement for covered reasons.',
                  'Flight delay reimbursements up to $235',
                  'Free cancellation due to illness and more'
                ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 ml-9">
                        <IoCheckmark className="text-white h-4 w-4" />
                        <p className="text-white text-sm">{benefit}</p>
                    </div>
                ))}
                 <div className="flex items-center gap-2 sm:hidden">
                        <p className="text-white text-xl font-bold">${price}</p>
                        <span className="text-primary-gray text-xs">per person</span>
                    </div>
            </div>

            <div className="max-sm:absolute max-sm:right-0 max-sm:top-0 max-sm:bottom-0 flex flex-col items-end justify-between p-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 max-sm:hidden">
                        <p className="text-white text-xl font-bold">${price}</p>
                        <span className="text-primary-gray text-xs">per person</span>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={selected}
                        onChange={() => onToggleSelect(id)}
                        className="w-8 h-8 rounded-lg text-primary-gray bg-transparent" 
                    />
                </div>
                <button className="flex items-center gap-1 border-b border-b-[#BBD4FB]">
                    <p className="text-[#BBD4FB] text-sm">Learn more</p>
                    <CgArrowTopRight className="text-[#BBD4FB] h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default PaymentInsuranceCard; 