'use client';
import React from 'react';
import { BiSolidMap } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineDirections, MdOutlineDirectionsCarFilled, MdOutlineExplore } from 'react-icons/md';
import Image from 'next/image';
import { IoLocationOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { LuRoute } from 'react-icons/lu';
import Button from '@/src/components/figma/Button';
import { RxArrowTopRight } from 'react-icons/rx';
import { CardType } from '@/src/components/ActivityCard';
interface FeedbackCardProps {
    activity: {
        name: string;
        type: string;
        time: string;
        date: string;
        location: {
            name: string;
            coordinates: number[];
        };
        image: string;
    };
    cardType?: CardType;
}

const FeedbackCard = ({ activity, cardType = CardType.ACTIVITY }: FeedbackCardProps) => {
    
    const getBorderGradient = () => {
        switch (cardType) {
            case CardType.LODGING:
                return "from-red-500 via-red-500/70 to-red-500/50";
            case CardType.ACTIVITY:
                return "from-blue-500 via-blue-500/70 to-blue-500/50";
            case CardType.TRANSPORTATION:
                return "from-[#FEDB25] via-border-primary to-border-primary";
            default:
                return "from-[#FEDB25] via-border-primary to-border-primary";
        }
    };
    
    return (
        <div className="flex flex-col gap-4 border-border-primary">


            {/* Activity Card */}
            <div className={`flex-1 bg-gradient-to-br ${getBorderGradient()} rounded-xl p-[2px]`}>
                <div className="flex-1 bg-black rounded-xl">

                    <div className="flex-1 flex max-sm:flex-col gap-4 bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-2 relative">

                        <Image src={activity.image} alt={activity.name} className='rounded max-sm:w-full' width={160} height={130} />
                        <div className="flex justify-between items-end w-full">
                            <div className="flex items-start gap-10">



                                {/* Duration */}
                                <div className='flex flex-col gap-1'>

                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-white font-bold">{activity.name}</h3>
                                        <RxArrowTopRight className='w-5 h-5 text-white' />
                                        <Button variant='outline' size='sm' className='!px-3 !py-1'>Guided</Button>
                                        <p className='text-primary-gray text-sm'>|</p>
                                        <p className='text-white'>1h</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Image src="/svg-icons/location.svg" alt="location" width={20} height={20} />
                                        <span className="text-white text-sm">St. Mary’s Glacier, Colorado 80452,</span>
                                    </div>
                                    <div className="flex items-center gap-2 my-1">
                                        <FaRegClock className="w-5 h-5 text-white" />

                                        <span className="text-white text-sm">22 July, 10.30-12.00</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Image src="/svg-icons/yellow-star.svg" alt="location" width={20} height={20} />

                                        <span className="text-white text-sm">5.0 (100)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className=" flex flex-col items-end">


                                <p className='text-white'>$0.2</p>
                                <span className="text-primary-gray text-sm">per person</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FeedbackCard; 