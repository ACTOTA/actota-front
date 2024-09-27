import React from 'react';
import Button from './figma/Button';

export default function Newsletter() {


  return (
    <section className="w-full h-[500px] text-white">
      <div className="glass-dark rounded-md h-[392px] w-[790px] m-auto
        flex flex-col items-center justify-center gap-4">
        
        <p className="text-4xl">Subscribe to Our Newsletter</p>
        <p>Stay updated with the latest news, insights, and exclusive offers delivered directly to your inbox!</p>

        <div>
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
