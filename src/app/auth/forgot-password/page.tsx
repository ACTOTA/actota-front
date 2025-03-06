'use client';
import React, { useState, useRef, useEffect } from 'react';
import Button from "@/src/components/figma/Button";
import GlassPanel from "@/src/components/figma/GlassPanel";
import Input from "@/src/components/figma/Input";
import Image from "next/image";
import Link from "next/link";
import { BiLock } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FaCheck } from 'react-icons/fa';
import { LuCheck } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTime, setOtpTime] = useState(60);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (otpTime > 0 && step === 2) {
      const interval = setInterval(() => {
        setOtpTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTime, step]);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const isActiveStep = (currentStep: 1 | 2 | 3) => step === currentStep;

  const validateEmail = () => {
    let isValid = true;
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Please provide your email.' }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    return isValid;
  };

  const validateOtp = () => {
    let isValid = true;
    if (otp.some(digit => digit === '')) {
      setErrors(prev => ({ ...prev, otp: 'Please enter the complete verification code.' }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
    return isValid;
  };

  const validatePasswords = () => {
    let isValid = true;
    let tempErrors = { ...errors };

    if (!password) {
      tempErrors.password = 'Please enter your password.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    } else {
      tempErrors.password = '';
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    } else {
      tempErrors.confirmPassword = '';
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleEmailSubmit = () => {
    if (validateEmail()) {
      setStep(2);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 3) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = () => {
    if (validateOtp()) {
      setStep(3);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswords()) {
      // Handle password reset logic here
      toast.success('Password reset successful');
    }
  };

  return (
    <>
      {step === 1 && (
        <GlassPanel className=" w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-around relative text-white">

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
            <p className="text-primary-gray  text-left mb-1 mt-[16px]">Email Address</p>
            <Input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              icon={<Image src="/svg-icons/mail.svg" alt="mail" width={20} height={20} />}
              placeholder="Your email address"
              classname={errors.email ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
            />
            {errors.email && (
              <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                {errors.email}
              </div>
            )}
          </div>

          <Button
            onClick={handleEmailSubmit}
            variant="primary"
            className="bg-white text-black w-full my-[10px] mt-[24px]"
          >
            Confirm Email
          </Button>
          <Link href="/auth/signin" className="m-auto my-[16px] text-white text-[16px] leading-[20px] flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Login</Link>
        </GlassPanel>
      )}

      {step === 2 && (

        <GlassPanel className=" w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-around relative text-white">

          <div className='flex w-full justify-center items-center gap-[16px] mb-[16px]'>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(2) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(2) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
          </div>

          <div className="text-white flex justify-between items-center">
            <h3 className="text-2xl font-semibold flex items-center gap-2"><ArrowLeftIcon onClick={() => setStep(1)} className="w-4 h-4 cursor-pointer" /> Password Reset</h3>
          </div>
          <p className='text-light-gray text-[16px] leading-[24px] mt-1'>We sent a code to {email || 'your email'}.</p>

          <div className="flex gap-4 max-md:gap-3 justify-center my-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-[116px] h-[160px] max-sm:w-[78px] max-sm:h-[96px] text-center text-[64px] max-sm:text-[40px] font-bold bg-black/20 
                            border ${errors.otp ? 'border-[#79071D]' : 'border-white/20 '}   ring-0 focus:ring-0 focus:outline-none3
                          rounded-lg focus:border-white focus:outline-none text-white`}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          {errors.otp && (
            <div className="mb-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded text-center">
              {errors.otp}
            </div>
          )}

          <Button
            onClick={handleOtpSubmit}
            className="bg-white text-black w-full my-[10px] mt-[0px]"
            variant="primary"
          >
            Continue
          </Button>

          {otpTime > 0 ?
            (
              <p className="m-auto my-[16px] text-primary-gray text-[16px] leading-[20px]">Please wait   <span className="text-white font-bold">{otpTime + "s"}</span> to resend the code.</p>
            ) : (
              <p className="m-auto my-[16px] text-primary-gray text-[16px] leading-[20px]">Didn&apos;t receive the code? <button onClick={() => setOtpTime(60)} className="text-white"><b><u>Click to resend.</u></b></button></p>
            )}

          <Link href="/auth/signin" className="m-auto my-[16px] text-white text-[16px] leading-[20px] flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Login</Link>
        </GlassPanel>
      )}

      {step === 3 && (
        <GlassPanel className=" w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-around relative text-white">


          <div className='flex w-full justify-center items-center gap-[16px] mb-[16px]'>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
            <div className={`h-[4px] rounded-full w-full ${isActiveStep(3) ? 'bg-white' : 'bg-primary-gray'}`}></div>
          </div>
          <div className="text-white flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Set New Password?</h3>
          </div>
          <p className='text-light-gray text-[16px] leading-[24px] mt-1'>Set your new password for your account.</p>
          <form onSubmit={handlePasswordSubmit} className="m-auto flex flex-col gap-4 w-full mt-[16px]">

            <div>
              <p className="text-primary-gray  text-left mb-1 mt-[10px]">New Password</p>
              <Input
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                icon={<Image src="/svg-icons/lock.svg" alt="google" width={20} height={20} />}
                placeholder="Your Password"
                classname={errors.password ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
              />
              {errors.password && (
                <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                  {errors.password}
                </div>
              )}
            </div>
            <div>
              <p className="text-primary-gray text-left mb-1 mt-[10px]">Confirm Password</p>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                icon={<Image src="/svg-icons/lock.svg" alt="google" width={20} height={20} />}
                placeholder="Your Password"
                classname={errors.confirmPassword ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
              />
              {errors.confirmPassword && (
                <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
                  {errors.confirmPassword}
                </div>
              )}
            </div>






            <Button variant="primary" onClick={() => setStep(4)} className="bg-white text-black w-full my-[10px]">Reset Password</Button>
          </form>

          <Link href="/auth/signin" className="m-auto my-[16px] text-white text-[16px] leading-[20px] flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Login</Link>
        </GlassPanel>
      )}


      {step === 4 && (
        <GlassPanel className=" w-[584px] max-md:w-full max-md:!rounded-b-none max-md:!border-0 max-md:!border-t-[0.5px] flex flex-col justify-between  items-center relative text-white !p-[40px]">

          <div className='flex justify-center items-center bg-gradient-to-br from-[#3C3F42]  to-[#292C30] border border-primary-gray rounded-full h-[64px] w-[64px]'>
            <LuCheck className='text-white size-6' />
          </div>
          <h3 className="text-2xl font-bold text-white mt-8">You’re All Set!</h3>
          <p className='text-light-gray text-[16px] leading-[24px] mt-1'>Your password has been reset successfully.</p>



          <Button
            onClick={() => router.push('/auth/signin')}
            variant="primary"
            className="bg-white text-black px-8 mt-[48px]"
          >
            Back To  Login
          </Button>
        </GlassPanel>
      )}


    </>

  )
}


