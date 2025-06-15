'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Search from '@/src/components/navbar/Search';
import { Alex_Brush } from 'next/font/google';
import { STEPS } from '../types/steps';
import { useRouter } from 'next/navigation';
import { FaHiking } from 'react-icons/fa';
import { getCurrentUser, setAuthCookie, getCookie } from '@/src/helpers/auth';
import { useSearchParams } from 'next/navigation';

const alexBrush = Alex_Brush({
  weight: ['400'],
  subsets: ['latin'],
});

export default function Hero() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currStep, setCurrStep] = useState<STEPS | null>(null);
  const [classes, setClasses] = React.useState<string>('');
  const [cookieChecked, setCookieChecked] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {

      setAuthCookie(token);
      getCurrentUser().then((user: any) => {
        if (user) {
          // Log the user data to see what's available
          console.log('Google auth user data:', JSON.stringify(user, null, 2));
          
          localStorage.setItem('user', JSON.stringify({
            user_id: user._id?.$oid || user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            customer_id: user.customer_id, // Include customer_id
            role: user.role || 'user' // Include role
          }));
          window.location.href = '/';
        } else {
          router.push('/auth/signin?error=no_user');
        }
      });

    }
  }, [searchParams, router]);

  useEffect(() => {
    const checkCookie = async () => {
      if (!cookieChecked) {
        const cookie: any = await getCookie('cookies');
        if (!cookie) {
          router.push("?modal=cookieBanner");
        }
        setCookieChecked(true);
      }
    };

    const timeoutId = setTimeout(() => {
      checkCookie();
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [cookieChecked, router]);

  return (
    <div className="w-full h-[100vh] relative flex items-center justify-center">
      <Image
        width={10}
        height={10}
        src="/hero-bg.svg"
        alt="hero background"
        className="absolute inset-0 w-full h-screen object-cover"
        priority
      />

      <div className={`relative w-full transition-all duration-700 ease-in-out flex flex-col items-center justify-center
                ${currStep != null ? 'h-full' : 'h-0'}`}>
        <div className={`py-[50px] flex flex-col justify-center items-center bg-[url('/hero-bg-airoplane.svg')] bg-cover bg-center 
                     duration-700 ease-in-out max-lg:pb-[80px]
                     ${currStep != null ? 'opacity-0 pointer-events-none h-0' : 'opacity-100 h-[400px] translate-y-0'}
                     `}>
          <p className='text-white text-7xl max-md:text-4xl font-extrabold leading-[88px] text-center'>
            Book Your
            <span className={alexBrush.className}> Dream </span>
            Trip
          </p>

          <p className='text-white text-7xl max-md:text-4xl font-extrabold leading-[88px] text-center flex items-center gap-2'>
            with a Few Clicks <img src="/svg-icons/mingcute-cursor.svg" alt="hero background" className="mt-6 max-md:hidden" />
          </p>
        </div>
        <div className={`z-40 ${classes !== '' && 'lg:fixed lg:top-[8px] lg:left-1/2 lg:-translate-x-1/2 lg:h-auto'}`}>
          <Search setClasses={setClasses} currStep={currStep} setCurrStep={setCurrStep} navbar={false} />
        </div>
      </div>
    </div>
  );
}

