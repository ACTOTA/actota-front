'use client';
import React from 'react';
import Input from '@/src/components/figma/Input';
import { HiOutlineMail } from 'react-icons/hi';
import { BiLock } from 'react-icons/bi';
import Button from '@/src/components/figma/Button';
import Link from 'next/link';
import { verifyJwt, Claims } from '@/src/helpers/auth';
import { setAuthCookie } from '@/src/helpers/auth';
import GlassPanel from '@/src/components/figma/GlassPanel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const signUp = () => {
    router.push("?modal=signupLoading")
    setTimeout(() => {
      router.push(window.location.pathname);
    }, 3000)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.currentTarget);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(formData);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();

        const authToken = data.auth_token;

        if (authToken) {
          const claims = await verifyJwt(authToken);
          setAuthCookie(authToken, claims as Claims);
        }

        window.location.href = '/';

      } else {

        console.log("Failed to create account.");

      }
    } catch (error) {
      console.error(error);
    }

  }

  return (


    <GlassPanel className=" w-[584px] flex flex-col justify-around relative text-white">
      <div className="text-white flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Let&apos;s Get Started!</h3>
        <Image src="/images/actota-logo.png" alt="logo" width={110} height={20} />
      </div>
      <p className='text-light-gray text-[16px] leading-[24px] mt-1'>Create an account to continue.</p>
      <form onSubmit={(e) => handleSubmit(e)} className="m-auto flex flex-col gap-4 w-full mt-[16px]">
        <div>
          <p className="text-primary-gray w-96 text-left mb-1 mt-[16px]">Full Name</p>
          <Input type="text" name="fullName" placeholder="Full Name" />
        </div>
        <div>
          <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Email Address</p>
          <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
        </div>
        <div>
          <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Password</p>
          <Input type="password" name="password" icon={<BiLock className="text-white h-[20px] w-[20px]" />} placeholder="Your Password" />
          <div className="h-2" />
        </div>


        <Button onClick={signUp} variant="primary" className="bg-white text-black w-full my-[10px]">Create My Account</Button>
      </form>

      <div className="text-white flex justify-center items-center gap-[16px]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
        <p className='text-primary-gray text-[14px] leading-[20px] whitespace-nowrap'>or continue with</p>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
      </div>
      <div className="flex justify-center items-center gap-[8px] my-[16px]">
        <button className='bg-[#262626] rounded-[8px] py-[16px] px-[70px] flex justify-center items-center  hover:cursor-pointer'>
          <Image src="/svg-icons/google.svg" alt="google" width={20} height={20} />
        </button>
        <button className='bg-[#262626] rounded-[8px] py-[14px] px-[70px] flex justify-center items-center hover:cursor-pointer'>
          <Image src="/svg-icons/apple.svg" alt="apple" width={20} height={20} />
        </button>
        <button className='bg-[#262626] rounded-[8px] py-[16px] px-[70px] flex justify-center items-center hover:cursor-pointer'>
          <Image src="/svg-icons/facebook.svg" alt="facebook" width={20} height={20} />
        </button>
      </div>
      <p className="m-auto text-primary-gray text-[14px] leading-[20px] mb-[32px]">By creating an account, I agree to ACTOTA&apos;s <Link href="/auth/signin" className="text-white"><b><u>terms of service</u></b></Link> and <Link href="/auth/signin" className="text-white"><b><u>privacy policy.</u></b></Link></p>

      <p className="m-auto text-primary-gray text-[16px] leading-[20px]">Already have an account? <Link href="/auth/signin" className="text-white"><b><u>Log in here</u></b></Link></p>
    </GlassPanel>
  )
}

