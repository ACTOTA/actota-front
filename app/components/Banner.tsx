import React from 'react';
import Image from 'next/image';

function Banner() {
    return (
        <div className="relative w-full h-[700px] overflow-hidden">
            <Image src="/images/hero-bg.jpg" alt="beautiful mountain and lake view"
                layout="fill" objectFit="cover" />
        </div>
    );
}

export default Banner;
