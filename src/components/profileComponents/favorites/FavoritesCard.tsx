'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { FaPersonWalking } from 'react-icons/fa6';
import { LuUsers } from "react-icons/lu";
import { IoLeafOutline } from "react-icons/io5";
import { MdAccessTime } from 'react-icons/md';
import LikeDislike from '../../LikeDislike';

interface Location {
    city: string;
    state: string;
    coordinates: number[];
}

interface Activity {
    label: string;
    description: string;
    tags: string[];
}

interface FavoriteData {
    _id: { $oid: string };
    trip_name: string;
    person_cost: number;
    min_group: number;
    max_group: number;
    length_days: number;
    length_hours: number;
    start_location: Location;
    end_location: Location;
    description: string;
    activities: Activity[];
    days: Record<string, any[]>;
    images: string[];
}

interface FavoritesCardProps {
    data: FavoriteData;
}

const FavoritesCard: React.FC<FavoritesCardProps> = ({ data }) => {
    const router = useRouter();

    // Create a string of locations
    const locations = [
        data.start_location.city,
        ...Object.values(data.days)
            .flat()
            .map(day => day.location.name)
            .filter((loc, index, self) =>
                self.indexOf(loc) === index &&
                loc !== data.start_location.city
            )
    ];

    const locationString = locations.length > 3
        ? `${locations.slice(0, 2).join(', ')}, ${locations.length - 2} More`
        : locations.join(', ');

    return (
        <GlassPanel className='!p-4 max-sm:!p-0 max-sm:border-none !rounded-[22px] max-w-[864px] hover:cursor-pointer flex justify-between items-end mt-4 bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>
            <div onClick={() => router.push(`/itineraries/${data._id.$oid}`)} className='flex justify-between max-lg:flex-col-reverse relative gap-4 h-full w-full'>
                <div>
                    <div className='flex justify-start items-center flex-wrap gap-1 max-w-[70%] text-white max-md:absolute max-md:top-2 max-md:left-2'>
                        {data.activities.slice(0, 2).map((activity, index) => (
                            <div key={index} className='bg-[#05080D] rounded-full px-3 py-1 flex items-center justify-center gap-1'>
                                <IoLeafOutline className='h-5 w-5 text-white' />
                                {activity.label}
                            </div>
                        ))}
                    </div>
                    <div className='max-md:flex w-full justify-between'>
                        <div>
                            <p className='text-2xl font-bold mt-3 max-md:mt-0 flex items-start gap-1'>
                                {data.trip_name.length > 30 ? data.trip_name.slice(0, 30) + "..." : data.trip_name}
                                {data.length_days === 1 && (
                                    <Button variant='primary' size='sm' className='!bg-[#215CBA] text-white text-xs font-normal whitespace-nowrap'>
                                        Day 1/1
                                    </Button>
                                )}
                            </p>

                            <p className='py-2 text-sm text-primary-gray'>{locationString}</p>
                            <div className='flex justify-start items-center gap-3 mb-2 text-white'>
                                <div className='flex gap-1 text-xs'>
                                    <MdAccessTime className='h-[17px] w-[17px] text-white' />
                                    <p>{data.length_days} {data.length_days > 1 ? "Days" : "Day"}</p>
                                </div>
                                <div className='flex gap-1 text-xs'>
                                    <LuUsers className='h-[17px] w-[17px] text-white' />
                                    <p>{data.min_group}-{data.max_group}</p>
                                </div>
                                <div className='flex gap-1 text-xs my-2'>
                                    <FaPersonWalking className='h-[17px] w-[17px] text-white' />
                                    <p>{data.activities.length} {data.activities.length === 1 ? "Activity" : "Activities"}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='text-xs text-primary-gray'>from</p>
                            <p className='text-xl font-bold'>${data.person_cost}</p>
                        </div>
                    </div>
                </div>

                <Image
                    src={data.images[0] || "/images/hero-bg.jpg"} // Fallback image since data.images is null
                    alt={data.trip_name}
                    height={200}
                    width={300}
                    objectFit='cover'
                    className='rounded-lg max-lg:w-full'
                />
                <div className='flex gap-2 absolute top-2 right-2'>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`?modal=shareModal&itineraryId=${data._id.$oid}`)
                        }}
                        className='bg-[#05080D] rounded-full h-10 w-10 flex items-center justify-center'
                    >
                        <Image src="/svg-icons/share.svg" alt="share" height={20} width={20} />
                    </div>
                    <LikeDislike liked={true} favoriteId={data._id.$oid} />
                </div>
            </div>
        </GlassPanel>
    );
}

export default FavoritesCard;
