'use client';
import React, { useState, useRef } from 'react';
import Button from "@/src/components/figma/Button";
import GlassPanel from "@/src/components/figma/GlassPanel";
import Input from "@/src/components/figma/Input";
import Image from "next/image";
import Link from "next/link";
import { BiLock } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';


export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const isActiveStep = (currentStep: 1 | 2 | 3) => step === currentStep;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value !== '' && index < 3) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.currentTarget);
  }

  return (
    <>
      {step === 1 && (
        <GlassPanel className=" w-[584px] flex flex-col justify-around relative text-white">

          <div className='flex w-full justify-center items-center gap-[16px] mb-[16px]'>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(1) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(2) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
          </div>
          <div className="text-white flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Forgot Your Password?</h3>
          </div>
          <p className='text-light-gray text-[16px] leading-[24px] mt-1'>No worries, we&apos;ll send you reset instructions.</p>

          <div className='mt-[16px]'>
            <p className="text-primary-gray w-96 text-left mb-1 mt-[16px]">Email Address</p>
            <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
          </div>



          <Button onClick={() => setStep(2)} variant="primary" className="bg-white text-black w-full my-[10px] mt-[24px]">Confirm Email</Button>
          <Link href="/auth/signin" className="m-auto my-[16px] text-white text-[16px] leading-[20px] flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Login</Link>
        </GlassPanel>
      )}

      {step === 2 && (

        <GlassPanel className=" w-[584px] flex flex-col justify-around relative text-white">

          <div className='flex w-full justify-center items-center gap-[16px] mb-[16px]'>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(2) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(2) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
          </div>

          <div className="text-white flex justify-between items-center">
            <h3 className="text-2xl font-semibold flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Password Reset</h3>
          </div>
          <p className='text-light-gray text-[16px] leading-[24px] mt-1'>We sent a code to {email || 'your email'}.</p>

          <div className="flex gap-4 justify-center my-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[116px] h-[160px] text-center text-2xl font-bold bg-black/20 
                          border border-white/20 rounded-lg focus:border-white 
                          focus:outline-none text-white"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          <Button
            onClick={() => setStep(3)}
            className="bg-white text-black w-full my-[10px] mt-[24px]"
            disabled={otp.some(digit => digit === '')}
            variant="primary"
          >
            Continue
          </Button>

          <p className="m-auto my-[16px] text-primary-gray text-[16px] leading-[20px]">Didn&apos;t receive the code? <Link href="/auth/signin" className="text-white"><b><u>Resend</u></b></Link></p>

          <Link href="/auth/signin" className="m-auto my-[16px] text-white text-[16px] leading-[20px] flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Login</Link>
        </GlassPanel>
      )}

      {step === 3 && (
        <GlassPanel className=" w-[584px] flex flex-col justify-around relative text-white">


          <div className='flex w-full justify-center items-center gap-[16px] mb-[16px]'>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
          </div>
          <div className="text-white flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Set New Password?</h3>
          </div>
          <p className='text-light-gray text-[16px] leading-[24px] mt-1'>Set your new password for your account.</p>
          <form onSubmit={(e) => handleSubmit(e)} className="m-auto flex flex-col gap-4 w-full mt-[16px]">

            <div>
              <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">New Password</p>
              <Input type="password" name="password" icon={<BiLock className="text-white h-[20px] w-[20px]" />} placeholder="Your Password" />
              <div className="h-2" />
            </div>
            <div>
              <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Confirm Password</p>
              <Input type="password" name="password" icon={<BiLock className="text-white h-[20px] w-[20px]" />} placeholder="Your Password" />
              <div className="h-2" />
            </div>



            <Button variant="primary" type="submit" className="bg-white text-black w-full my-[10px]">Reset Password</Button>
          </form>

          <Link href="/auth/signin" className="m-auto my-[16px] text-white text-[16px] leading-[20px] flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Login</Link>
        </GlassPanel>
      )}


    </>

  )
}


