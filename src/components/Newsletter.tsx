import React from 'react';

import { CiMail } from "react-icons/ci";
import Image from 'next/image';
import Button from './figma/Button';
import Input from './figma/Input';

export default function Newsletter() {

  return (
    <section className='flex justify-center my-10 max-w-[1440px] mx-[80px] 2xl:mx-auto '>
      <div className=" p-12 bg-[#012a6a] rounded-2xl w-full justify-between  items-center max-xl:flex-col-reverse gap-16 inline-flex m-auto">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
          <div className="flex-col justify-center items-start gap-4 flex">
            <h1 className="self-stretch text-white text-[56px] font-bold  leading-[72px]">Subscribe to<br />Our Newsletter</h1>
            <p className="self-stretch text-white text-base font-normal  leading-normal">Stay updated with the latest news, insights, and exclusive offers delivered directly to your inbox!</p>
          </div>
          <form className="self-stretch justify-start items-start gap-2 inline-flex flex-wrap">
           
            <Input 
              type="email" name="email"
              placeholder="Your Email" 
              classname='flex-1 max-w-[400px] py-0.5 !rounded-full' 
              icon={<CiMail className="text-white h-6 w-6" />} 
            />

            <Button variant="primary" className="bg-white text-black">Subscribe</Button>
          </form>
        </div>
        <div className="h-[300px] min-w-[360px] z-10 relative">
          <Image src="/images/newsletter.png" alt="newsletter" layout="fill" objectFit="contain" />
        </div>
      </div>

    </section>
  )
}
