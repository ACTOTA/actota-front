import React from 'react';
import Button from './figma/Button';
import Input from './figma/Input';

import { EnvelopeIcon } from '@heroicons/react/20/solid'

export default function Newsletter() {

  const mail = <EnvelopeIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />;

  return (
    <section className="w-full h-[500px] text-white">
      <div className="glass-dark rounded-md h-[392px] w-[790px] m-auto
        flex flex-col items-center justify-center gap-4">
        
        <p className="text-4xl">Subscribe to Our Newsletter</p>
        <p>Stay updated with the latest news, insights, and exclusive offers delivered directly to your inbox!</p>

        <div className="flex h-14">
          <Input icon={mail} placeholder="Your Email" className="h-36"/>
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
