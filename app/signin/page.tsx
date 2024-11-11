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
import Link from 'next/link';
import { jwtVerify } from 'jose/jwt/verify';
import { setAuthCookie } from '../actions/setAuthCookie';

export interface Claims {
  sub: string,
  exp: number,
  iat: number
};

const verifyJwt = async (token: string): Promise<Claims | null> => {
  const secret = process.env.NEXT_PUBLIC_AUTH_SECRET || 'your-jwt-secret';

  try {
    // Convert the secret to a Uint8Array (required by `jose`)
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret); 

    // Verify the JWT and extract the payload
    const { payload } = await jwtVerify(token, secretKey);

    // Type-cast the payload to your Claims interface
    return payload as Claims;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
};

export default function SignIn() {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(formData);
    
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();

        const authToken = data.auth_token;

        if (authToken) {
          const claims = await verifyJwt(authToken) as Claims;
          setAuthCookie(authToken, claims);

        }

      } else {
        console.log("Failed to create account.");
      }
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div className="relative h-screen flex justify-center items-center">
      <Image
        src="/images/maroon-bells.jpg"
        alt="Picture of the author"
        layout="fill"
        objectFit="cover"
      />

      <GlassPanel theme={Theme.Dark} className="h-[900px] w-[600px] flex flex-col justify-around relative text-white py-6 px-[2%]">
        <div className="absolute top-8 right-8">
          <Logo /> 
        </div>
       
        <div className="text-white">
          <h3 className="text-2xl font-bold">Welcome Back!</h3>
          <p>Sign in to your account to continue.</p>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="m-auto flex flex-col gap-4 w-full">
          <div>
            <p className="w-96 text-left text-neutral-05">Email Address</p>
            <Input type="email" name="email" icon={<HiOutlineMail className="text-white"/>} placeholder="Your email address" />
          </div>
          <div>
            <p className="w-96 text-left text-neutral-05">Password</p>
            <Input type="password" name="password" icon={<BiLock className="text-white"/>} placeholder="Password" />
            <div className="h-2"/>
          </div>
          
          <Link href="/forgot-password"> 
            <p className="text-right"><b>Forgot your password?</b></p>
          </Link>

          <div className="flex items-center">
            <input type="checkbox" name="remember" id="remember" className="mr-2"/>
            <p>Remember me on this device</p>
          </div>
          <Button type="submit" className="bg-white text-black w-full py-5">Log In</Button>
        </form>

        <div className="text-white flex justify-center">
          <p>or continue with</p>
        </div>
        <div className="grid justify-center grid-cols-3">
          <Button className="py-5">Google</Button>
          <Button className="py-5">Apple</Button>
          <Button className="py-5">Facebook</Button>
        </div>
                
        <p className="m-auto">Don&apos;t have an account? <Link href="/signup" className=""><b><u>Create an account here</u></b></Link></p>
      </GlassPanel>
    </div> 
  )
}

