import React from 'react';
import Button from './figma/Button';

export default function Footer() {

  return (
    <section className="w-full h-[500px] text-white
      grid-cols-2 px-6">
      <div className="w-1/2 flex flex-col gap-4">
        <p className="text-7xl">Frequently Asked Questions</p>
        <p>Can&apos;t find what you&apos;re looking for? </p>
        <div> 
          <Button>Contact Us</Button>
        </div>
      </div>

      <div className="w-1/2">
      </div>
    </section>
  )
}
