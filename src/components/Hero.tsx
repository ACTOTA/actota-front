'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Search from '@/src/components/navbar/Search';
import { Alex_Brush } from 'next/font/google';
import { STEPS } from '../types/steps';
import { useRouter } from 'next/navigation';
import { FaHiking } from 'react-icons/fa';
const alexBrush = Alex_Brush({
    weight: ['400'],
    subsets: ['latin'],
});

export default function Hero() {
    const router = useRouter();
    const [currStep, setCurrStep] = useState<STEPS | null>(null);
    const [classes, setClasses] = React.useState<string>('');
    const [showCookieBanner, setShowCookieBanner] = React.useState<boolean>(false);
    // setTimeout(() => {
    //     if ( !showCookieBanner) {
    //         router.push("?modal=cookieBanner");
    //         setShowCookieBanner(true);
    //     }
    // }, 5000);
    return (
        <div className="w-full h-[100vh] relative flex items-center justify-center">
            <Image
                width={10}
                height={10}
                src="/hero-bg.svg"
                alt="hero background"
                className="absolute inset-0 w-full h-screen object-cover"
                priority
            />

            <div className={`relative w-full transition-all duration-700 ease-in-out  flex flex-col items-center justify-center
                ${currStep != null ? 'h-full' : 'h-0'}`}>
                <div className={` py-[50px] flex flex-col justify-center items-center bg-[url('/hero-bg-airoplane.svg')] bg-cover bg-center 
                     duration-700 ease-in-out
                     ${currStep != null ? 'opacity-0  pointer-events-none h-0' : 'opacity-100 h-[400px] translate-y-0'}
                     `}>
                    <p className='text-white text-7xl max-md:text-4xl font-extrabold leading-[88px] text-center'>
                        Book Your
                        <span className={alexBrush.className}> Dream </span>
                        Trip
                    </p>

                    <p className='text-white text-7xl max-md:text-4xl font-extrabold leading-[88px] text-center flex items-center gap-2'>
                        with a Few Clicks <img src="/svg-icons/mingcute-cursor.svg" alt="hero background" className="mt-6 max-md:hidden" />
                    </p>
                </div>
                <div className={`  z-40 
                    ${classes !== '' ? 'fixed top-[8px]  left-1/2 -translate-x-1/2  h-auto' : 'h-full'}`}>
                    <Search setClasses={setClasses} currStep={currStep} setCurrStep={setCurrStep} navbar={false} />
                </div>
            </div>
        </div>
    );
}

