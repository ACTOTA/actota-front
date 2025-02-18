import React from 'react'
import Button from '../figma/Button'
import { LuMail } from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { RiWhatsappFill } from 'react-icons/ri';
import { BiLogoInstagramAlt } from 'react-icons/bi';
import { IoLogoFacebook } from 'react-icons/io5';
import Input from '../figma/Input';
import { PiCopyLight } from 'react-icons/pi';

const ShareModal = () => {
    const [socialIcons, setSocialIcons] = React.useState<any[]>([
        <LuMail className='h-5 w-5 text-white' />,
        <FaXTwitter className='h-5 w-5 text-white' />,
        <RiWhatsappFill className='h-6 w-6 text-white' />,
        <BiLogoInstagramAlt className='h-6 w-6 text-white' />,
        <IoLogoFacebook className='h-6 w-6 text-white' />,

    ]);
    return (
        <div className='w-full'>

            <p className='text-white text-2xl font-bold'>Share Itinerary</p>
            <div className='flex gap-2 mt-4'>
                {socialIcons.map((icon, index) => (
                    <div key={index} className='bg-black/50 rounded-full border border-border-primary h-16 w-16 flex items-center justify-center'>
                        {icon}
                    </div>
                ))}


            </div>
            <p className='text-primary-gray text-sm mt-4 mb-2'>or copy link</p>
            <div className='w-full'>
                <Input rightIcon={<button className='flex items-center gap-1'>Copy <PiCopyLight className='h-5 w-5 text-white' /> </button>} type="text" className='w-full bg-black/50 rounded-full border border-border-primary' placeholder='https://www.actota.com/itinerary/123' />
            </div>
            <div className='mt-4'>
                <p className='text-white text-xl font-bold'>Share to Group Members</p>
                <div className='flex '>

                <div className='flex flex-1 gap-2 mt-4'>
                    <input type="checkbox" className='rounded-[4px] ring-0 focus:ring-0 outline-none size-6'  />
                    <div>
                        <p className='text-white text-sm'>John Doe</p>
                        <p className='text-white font-bold'>john@example.com</p>
                    </div>
                </div>
                <div className='flex flex-1 gap-2 mt-4'>
                    <input type="checkbox" className='rounded-[4px] ring-0 focus:ring-0 outline-none size-6'  />
                    <div>
                        <p className='text-white text-sm'>John Doe</p>
                        <p className='text-white font-bold'>john@example.com</p>
                    </div>
                </div>
                </div>

            </div>
        </div>
    )
}

export default ShareModal