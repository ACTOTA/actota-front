import Image from 'next/image'
import React from 'react'
import Button from './figma/Button'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

const SimpleCard = ({ image, title, description, showButton }: { image: string, title: string, description: string, showButton: boolean }) => {
    return (
        <div className='flex-1 max-w-[400px] max-sm:max-w-[360px]  bg-gradient-to-br  from-[#CFCFCF]/50 to-[#6B6B6B]/30   rounded-lg'>

            <div className=" w-[400px] max-sm:w-[360px] text-white flex flex-col p-2   bg-black/60   rounded-lg">
                <div className=" flex justify-center relative  items-center rounded-2xl">
                    <Image src={image} alt="route icon" objectFit="cover" className='rounded-lg' height={240} width={390}
                    />
                    {showButton && <Button variant="secondary" size="sm" className='absolute right-2 top-2 bg-black/90 flex items-center gap-2'>
                        <p className='text-white'>Find Itineraries</p>
                        <ArrowRightIcon className="h-4 w-4 hover:cursor-pointer" />
                    </Button>}
                </div>
                <div className=" m-5 ">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className='text-primary-gray mt-2'>{description}</p>
                </div>
            </div>
        </div>
    )
}

export default SimpleCard