'use client';
import React from 'react';
import Image from 'next/image';
import { IoCheckmark, IoLocationOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';

interface PaymentInsuranceCardProps {
    name: string;
    price: number;
    imageSrc?: string;
};


const PaymentInsuranceCard = ({ name, price, imageSrc }: PaymentInsuranceCardProps) => {
    return (
        <div className="flex  justify-between  max-w-[843px] bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 border border-border-primary rounded-xl ">


            <div className="flex flex-col gap-2 relative p-4">
                <Image src="/images/payment-page-card-blur-bg.png" className="absolute top-[100px] left-[-100px]" alt="logo" layout="fill" />

                <div className="flex items-center gap-2">
                    {imageSrc && <Image src={imageSrc} alt="logo" width={32} height={32} />}
                    <h3 className="text-white text-xl font-bold">{name}</h3>
                </div>
                <div className="flex items-center gap-2 ml-9">
                    <IoCheckmark className="text-white h-4 w-4" /> <p className="text-white text-sm">Up to 100% reimbursement for covered reasons.</p>
                </div>
                <div className="flex items-center gap-2 ml-9">
                    <IoCheckmark className="text-white h-4 w-4" /> <p className="text-white text-sm">Up to 100% reimbursement for covered reasons.</p>
                </div>
                <div className="flex items-center gap-2 ml-9">
                    <IoCheckmark className="text-white h-4 w-4" /> <p className="text-white text-sm">Up to 100% reimbursement for covered reasons.</p>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between p-4">

                <div className="flex items-center gap-8">

                    <div className=" flex  items-center gap-2">
                        <p className="text-white text-xl font-bold">${price}</p>
                        <span className="text-primary-gray text-xs">per person</span>
                    </div>
                    <input type="checkbox" className="w-8 h-8 rounded-lg text-primary-gray bg-transparent" />
                </div>
                <div className="flex items-center gap-1 border-b border-b-[#BBD4FB]">
                    <p className="text-[#BBD4FB] text-sm">Learn more</p>
                    <CgArrowTopRight className="text-[#BBD4FB] h-5 w-5" />
                </div>
            </div>
        </div>

    );
};

export default PaymentInsuranceCard; 