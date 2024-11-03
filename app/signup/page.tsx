'use client';

import React from 'react';
import Image from 'next/image';
import GlassPanel from '../components/figma/GlassPanel';
import { Theme } from '../components/enums/theme';
import Input from '../components/figma/Input';
import { HiOutlineMail } from 'react-icons/hi';
import { BiLock } from 'react-icons/bi';
import Button from '../components/figma/Button';
import Logo from '../components/Logo';

export default function SignUp() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <div className="relative h-screen flex justify-center items-center">
      <Image
        src="/images/maroon-bells.jpg"
        alt="Picture of the author"
        layout="fill"
        objectFit="cover"
      />

      <GlassPanel theme={Theme.Dark} className="h-[900px] min:w-[600px] flex flex-col justify-around relative text-white py-6 px-[2%]">
        <div className="absolute top-8 right-8">
          <Logo /> 
        </div>
       
        <div className="text-white">
          <h3 className="text-2xl font-bold">Let&apos;s Get Started</h3>
          <p>Create an account to continue.</p>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="m-auto flex flex-col gap-4 w-full">
          <div className="w-full">
            <caption className="w-96 text-left text-neutral-05">First Name</caption>
            <Input type="text" placeholder="First Name" className="rounded-lg" />
          </div>
          <div>
            <caption className="w-96 text-left text-neutral-05">Last Name</caption>
            <Input type="text" placeholder="Last Name" />
          </div>
          <div>
            <caption className="w-96 text-left text-neutral-05">Email Address</caption>
            <Input type="email" icon={<HiOutlineMail className="text-white"/>} placeholder="Your email address" />
          </div>
          <div>
            <caption className="w-96 text-left text-neutral-05">Password</caption>
            <Input type="password" icon={<BiLock className="text-white"/>} placeholder="Password" />
            <div className="h-2"/>
            <Input type="password" icon={<BiLock className="text-white"/>} placeholder="Confirm Password" />
          </div>


          <Button type="submit" className="bg-white text-black w-full py-5">Create My Account</Button>
        </form>
        <div className="text-white flex justify-center">
          <p>or continue with</p>
        </div>
        <div className="grid justify-center grid-cols-3">
          <Button className="py-5">Google</Button>
          <Button className="py-5">Apple</Button>
          <Button className="py-5">Facebook</Button>
        </div>
        <div className="m-auto text-center">
          <p>By create an account, I agree to ACTOTA&apos;s
            <a href="#" className=""><b> <u>Terms of Service</u></b></a> and
            <a href="#" className=""><b> <u>Privacy Policy</u></b></a>
          </p>
        </div>
        
        <p className="m-auto">Already have an account? <a href="#" className=""><b><u>Log In here</u></b></a></p>
      </GlassPanel>
    </div> 
  )
}
