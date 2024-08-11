'use client';

import React from 'react';
import Image from 'next/image';
import Search from './navbar/Search';

export default function Hero() {
    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            <Image src="/images/hero-bg.jpg" alt="beautiful mountain and lake view"
                layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>
            <div className="absolute inset-0 bg-[#00122D] opacity-40 mix-blend-color"></div>


            <div className="absolute inset-0 grid grid-cols-3 justify-center content-center px-6 max-w-7xl m-auto">
                <div className="col-span-2 text-white text-7xl font-extrabold font-['Manrope'] leading-[88px]">
                    <div className="w-full h-full px-6 relative">
                        <span className="h-full w-full bg-black">
                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-[25%] right-[30%]">
                                <path d="M28.7548 8.58972C30.2754 7.53731 32.3634 7.93475 33.3911 9.47223C34.3906 10.9676 34.0133 12.9874 32.5414 14.0211L28.1513 17.1042C27.8072 17.3459 27.6351 17.4667 27.5127 17.6239C27.4043 17.7631 27.3245 17.9224 27.2781 18.0926C27.2257 18.2849 27.2322 18.495 27.245 18.9153L27.5586 29.1563C27.5719 29.5877 27.5785 29.8034 27.5234 29.9999C27.4748 30.1737 27.3913 30.3359 27.278 30.4765C27.1501 30.6354 26.9706 30.7554 26.6118 30.9952L26.0306 31.3837C25.0803 32.0189 24.6052 32.3364 24.1853 32.3276C23.8186 32.3198 23.4714 32.1614 23.2252 31.8895C22.9432 31.5782 22.8717 31.0112 22.7285 29.8773L21.6673 21.4701L16.423 24.9755C16.1099 25.1848 15.9534 25.2894 15.8355 25.4258C15.731 25.5466 15.6492 25.6853 15.5937 25.8351C15.5312 26.0042 15.5151 26.1917 15.4829 26.5669L15.2935 28.7769C15.2613 29.152 15.2452 29.3396 15.1827 29.5087C15.1272 29.6585 15.0453 29.7971 14.9409 29.918C14.823 30.0544 14.6665 30.159 14.3534 30.3682L14.0438 30.5752C13.3022 31.0709 12.9314 31.3187 12.5699 31.34C12.2528 31.3587 11.9394 31.2635 11.6862 31.0716C11.3976 30.8529 11.2273 30.4406 10.8866 29.6162L9.44708 26.1321C9.38622 25.9849 9.35579 25.9112 9.31718 25.8422C9.28288 25.781 9.2438 25.7225 9.2003 25.6674C9.15132 25.6053 9.09491 25.549 8.98208 25.4365L6.31322 22.7741C5.68171 22.1441 5.36595 21.8291 5.2742 21.4788C5.19371 21.1715 5.22559 20.8455 5.36408 20.5596C5.52198 20.2337 5.89278 19.9858 6.63438 19.4902L6.944 19.2832C7.25704 19.074 7.41356 18.9693 7.58468 18.9125C7.73628 18.8622 7.89568 18.8396 8.05529 18.8457C8.23546 18.8525 8.41493 18.9094 8.77388 19.0231L10.8884 19.6931C11.2473 19.8068 11.4268 19.8637 11.6069 19.8705C11.7666 19.8766 11.926 19.8539 12.0776 19.8036C12.2487 19.7469 12.4052 19.6422 12.7182 19.433L17.9626 15.9276L10.6001 11.7323C9.60704 11.1664 9.11051 10.8835 8.93065 10.5039C8.7736 10.1725 8.76 9.79103 8.89305 9.44926C9.04542 9.05787 9.52054 8.74029 10.4708 8.10514L11.052 7.71663C11.4108 7.47678 11.5902 7.35686 11.786 7.29939C11.9592 7.24853 12.141 7.23339 12.3203 7.25488C12.5229 7.27917 12.7196 7.36775 13.1132 7.54492L22.4206 11.7347C22.8073 11.9088 23.0007 11.9958 23.1991 12.0208C23.3907 12.0449 23.5853 12.0271 23.7693 11.9686C23.9599 11.9081 24.1343 11.7874 24.4831 11.546L28.7548 8.58972Z" fill="#F1F6FE" />
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" width="574" height="226" viewBox="0 0 574 226" fill="none" className="absolute top-[28%] right-[32%]">
                                <path d="M234.986 21.0406L163.74 56.3298L97.4841 98.3317C84.1248 106.801 71.416 116.254 59.4635 126.614L29.6548 152.451C22.948 158.264 17.2468 165.144 12.7808 172.814L5.58647 185.17C3.56016 188.65 2.43355 192.58 2.30859 196.605L2.23698 198.912C2.10166 203.271 3.54825 207.531 6.30954 210.907V210.907C8.07874 213.069 10.3256 214.792 12.8734 215.939L19.0471 218.718C24.4651 221.157 30.2977 222.542 36.2337 222.801L54.155 223.582C62.4816 223.944 70.824 223.564 79.0831 222.445L118.534 217.102L200.289 195.626L323.392 148.213L374.503 123.148C437.487 92.2604 498.008 56.5849 555.532 16.4359V16.4359L572.772 1.51017" stroke="url(#paint0_linear_109_6572)" stroke-width="3" stroke-dasharray="26 26" />
                                <defs>
                                    <linearGradient id="paint0_linear_109_6572" x1="162.866" y1="63.2929" x2="197.3" y2="156.799" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#B0B0B0" stop-opacity="0" />
                                        <stop offset="1" stop-color="#B0B0B0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>

                        <div className="absolute top-1/2 -translate-y-1/2 font-manrope">
                            <span className="m-auto w-full flex justify-start gap-8">
                                <h2 className="">Book Your</h2>
                                <h2 className="font-alex-brush">Dream</h2>
                                <h2 className="">Trip</h2>
                            </span>
                            <h2 className="m-auto">with a Few Clicks</h2>

                            <p className="mt-10 text-[#f7f7f7] text-base font-normal font-['Manrope'] leading-normal">We create personalized itineraries for you to help you<br />book your dream vacation in less than 60 seconds.</p>

                            <Search />
                        </div>
                    </div>

                </div>

                <Image src="/images/hero-visual.png" alt="hero visual" height={600} width={600} />
            </div>
        </div>

    );
}

