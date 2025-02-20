'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import Input from '@/src/components/figma/Input';
import { HiOutlineMail } from 'react-icons/hi';
import { BiLock } from 'react-icons/bi';
import Button from '@/src/components/figma/Button';
import Link from 'next/link';
import { setAuthCookie } from '@/src/helpers/auth';
import { verifyJwt, Claims } from '@/src/helpers/auth';
import { useRouter } from "next/navigation";
import { useLogin } from '@/src/hooks/mutations/auth.mutation';
import axios from 'axios';

export default function SignIn() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = () => {
    let tempErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    // Email validation
    if (!email) {
      tempErrors.email = 'Please provide your email.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password validation
    if (!password) {
      tempErrors.password = 'Please enter your password.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response:any = await login({ email, password });
    
    

      if (response) {
        router.push('/');
      } else {
        setErrors(prev => ({
          ...prev,
          password: 'Invalid email or password'
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors(prev => ({
        ...prev,
        password: 'An error occurred during login'
      }));
    }
  };

  return (
    <GlassPanel className=" w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-around relative text-white">
      <div className="text-white flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Welcome Back!</h3>
        <Image src="/images/actota-logo.png" alt="logo" width={110} height={20} />
      </div>
      <p className='text-light-gray text-[16px] leading-[24px] mt-1'>Sign in to your account to continue.</p>
      <form onSubmit={(e) => handleSubmit(e)} className="m-auto flex flex-col gap-4 w-full mt-[16px]">
        <div>
          <p className="text-primary-gray text-left mb-1 mt-[16px]">Email Address</p>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            icon={<Image src="/svg-icons/mail.svg" alt="google" width={20} height={20} />}
            placeholder="Your email address"
            classname={errors.email ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.email && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.email}
            </div>
          )}
        </div>
        <div>
          <p className="text-primary-gray  text-left mb-1 mt-[10px]">Password</p>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            icon={<Image src="/svg-icons/lock.svg" alt="google" width={20} height={20} />}
            placeholder="Your Password"
            classname={errors.password ? '!border-[#79071D] !ring-1 !ring-[#79071D]' : ''}
          />
          {errors.password && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.password}
            </div>
          )}
        </div>

        <Link href="/auth/forgot-password">
          <p className="text-right"><b>Forgot your password?</b></p>
        </Link>

        <div className="flex items-center">
          <input value={1} onChange={(e) => setRememberMe(e.target.checked)} type="checkbox" name="remember" id="remember" className="mr-2 rounded ring-0 border-none focus:ring-0 focus:outline-none" />
          <p className=' text-[14px] leading-[20px]'>Remember me on this device</p>
        </div>
        <Button 
          type="submit" 
          variant="primary" 
          className="bg-white text-black w-full my-[10px]"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <div className="text-white flex justify-center items-center gap-[16px]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
        <p className='text-primary-gray text-[14px] leading-[20px] whitespace-nowrap'>or continue with</p>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
      </div>
      <div className="flex justify-center items-center gap-[8px] my-[16px] pb-[16px]">
        <button className='bg-[#262626] rounded-[8px] h-[56px] w-[180px] flex justify-center items-center max-sm:w-[130px] hover:cursor-pointer'>
          <Image src="/svg-icons/google.svg" alt="google" width={20} height={20} />
        </button>
        <button className='bg-[#262626] rounded-[8px] h-[56px] w-[180px] flex justify-center items-center max-sm:w-[130px] hover:cursor-pointer'>
          <Image src="/svg-icons/apple.svg" alt="apple" width={20} height={20} />
        </button>
        <button className='bg-[#262626] rounded-[8px] h-[56px] w-[180px] flex justify-center items-center max-sm:w-[130px] hover:cursor-pointer'>
          <Image src="/svg-icons/facebook.svg" alt="facebook" width={20} height={20} />
        </button>
      </div>

      <p className="m-auto text-primary-gray text-[16px] leading-[20px]">Don&apos;t have an account? <Link href="/auth/signup" className="text-white"><b><u>Create an account here</u></b></Link></p>
    </GlassPanel>
  )
}

