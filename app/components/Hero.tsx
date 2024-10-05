'use client';

import React from 'react';
import Image from 'next/image';
import Search from './navbar/Search';

export default function Hero() {
    return (
        <div className="relative w-full h-[100vh]">
            <Image src="/images/hero-bg.jpg" alt="beautiful mountain and lake view"
                layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>
            <div className="absolute inset-0 bg-[#00122D] opacity-40 mix-blend-color"></div>


            <div className="col-span-2 text-white text-7xl font-extrabold font-['Manrope'] leading-[88px]
                absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                <div className="">
                    <span className="m-auto w-full flex justify-start gap-8">
                        <h2 className="">Book</h2>
                        <h2 className="">Your</h2>
                        <h2 className="font-alex-brush">Dream</h2>
                        <h2 className="">Trip</h2>
                    </span>
                    <h2 className="m-auto text-center">with a Few Clicks</h2>
                    <div className="h-8"/>
                    <Search />
                </div>
            </div>
        </div>

    );
}

