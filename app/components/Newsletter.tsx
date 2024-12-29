import React from 'react';
import Button from './figma/Button';
import Input from './figma/Input';

import { EnvelopeIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';

export default function Newsletter() {

  return (
    <section className='flex justify-center mt-6'>
      <div className="h-[396px] p-12 bg-[#012a6a] rounded-2xl justify-start items-center gap-16 inline-flex m-auto">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
          <div className="flex-col justify-center items-start gap-4 flex">
            <div className="self-stretch text-white text-[56px] font-bold font-['Manrope'] leading-[72px]">Subscribe to<br />Our Newsletter</div>
            <div className="self-stretch text-white text-base font-normal font-['Manrope'] leading-normal">Stay updated with the latest news, insights, and exclusive offers delivered directly to your inbox!</div>
          </div>
          <form className="self-stretch justify-start items-start gap-2 inline-flex">
            <div className="w-[400px] h-12 px-4 bg-black/30 rounded-[200px] border border-[#9b9b9b] justify-between items-center flex overflow-hidden">
              <EnvelopeIcon className="h-6 w-6 text-[#b3b3b3]" />
              <input className="bg-transparent border-none text-[#b3b3b3] font-normal leading-normal w-full h-full"
                type='email' name='email' placeholder='Your email' />
            </div>
            <button className="h-full px-8 py-3 bg-white rounded-[200px] justify-center items-center gap-2.5 font-bold">
              Subscribe
            </button>
          </form>
        </div>
        <div className="w-[360px] h-full z-10 relative">
          <Image src="/images/newsletter.png" alt="newsletter" layout="fill" objectFit="cover" />
        </div>
      </div>

    </section>
  )
}
