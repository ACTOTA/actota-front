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
        <div className="flex  justify-between  max-w-[843px] bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 border border-border-primary rounded-xl ">


            <div className="flex flex-col items-start gap-2 relative p-4">

                <div className="flex items-center gap-2">
                    <h3 className="text-white text-xl font-bold">{name}</h3>
                </div>
                <div className="flex items-center gap-2 ">
                    <IoCheckmark className="text-white h-4 w-4" /> <p className="text-white text-sm">$199 due today, $199 on March 28</p>
                </div>
                <div className="flex items-center gap-2 ">
                    <IoCheckmark className="text-white h-4 w-4" /> <p className="text-white text-sm">0% interest</p>
                </div>

                <p className=" text-[#BBD4FB] text-sm border-b border-b-[#BBD4FB] text-left">Learn more</p>
            </div>

            <div className="flex flex-col items-end justify-between p-4">

                <input type="checkbox" className="w-8 h-8 rounded-full text-primary-gray bg-transparent" />

            </div>
        </div>

    );
};

export default SplitPaymentCard; 