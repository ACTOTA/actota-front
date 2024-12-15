'use client';

import React from 'react';
import Image from 'next/image';
import Search from './navbar/Search';

export default function Hero() {

    const [classes, setClasses] = React.useState<string>('');

    return (
        <div className="w-full h-[100vh] relative">
            <Image src="/images/hero-bg.jpg" alt="beautiful mountain and lake view"
                layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>
            <div className="absolute inset-0 bg-[#00122D] opacity-40 mix-blend-color"></div>

            <div className="relative h-full w-full flex items-center justify-center">
                <div className="text-white text-7xl font-extrabold font-['Manrope'] leading-[88px]">
                    <div className="flex flex-col justify-center items-center">
                        <span className="m-auto w-full flex justify-start gap-8">
                            <h2>Book</h2>
                            <h2>Your</h2>
                            <h2 className="font-alex-brush">Dream</h2>
                            <h2>Trip</h2>
                        </span>
                        <h2 className="m-auto text-center">with a Few Clicks</h2>
                        <div className="h-8" />
                        <div className={`h-full z-50 ${classes}`}>
                            <Search setClasses={setClasses} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

