import React from 'react';
import Image from 'next/image';

export default function Hero() {
    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            <Image src="/images/hero-bg.jpg" alt="beautiful mountain and lake view"
                layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>
            <div className="absolute inset-0 bg-[#00122D] opacity-40 mix-blend-color"></div>
        </div>

    );
}

