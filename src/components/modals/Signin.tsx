import Cookie from '@/public/svg-icons/cookie.svg'
import React from 'react'
import Button from '../figma/Button'
import Link from 'next/link'
import Input from '../figma/Input'
import { HiOutlineMail } from 'react-icons/hi'
import { useRouter } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go'
import { BiLock } from 'react-icons/bi'
const Signin = () => {
    const router = useRouter();

    const signIn = () => {
        router.push("?modal=signinLoading")
        setTimeout(() => {
            router.push(window.location.pathname);
        }, 3000)
    }
    return (
        <div className='w-full'>

            <p className='text-white text-xl font-bold'>Sign In</p>
            <p className="m-auto mt-1 text-primary-gray text-[16px] leading-[20px]">Don’t have an account? <button onClick={() => router.push("?modal=signup")} className="text-white"><b><u>Sign up here</u></b></button></p>

            <div className='mt-4'>
                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Password</p>
                <Input type="password" name="password" icon={<BiLock className="text-white h-[20px] w-[20px]" />} placeholder="Your Password" />
                <div className="h-2" />
            </div>

            <Link href="/auth/forgot-password">
                <p className="text-right text-white"><b>Forgot your password?</b></p>
            </Link>

            <div className="flex items-center text-white py-2 mt-2">
                <input type="checkbox" name="remember" id="remember" className="mr-2" />
                <p className=' text-[14px] leading-[20px]'>Remember me on this device</p>
            </div>
            <Button onClick={signIn} variant="primary" className="bg-white text-black w-full my-[10px]">Sign In</Button>
            <p className="m-auto text-center text-primary-gray text-[14px] leading-[20px]">By confirming your reservation, you agree to ACTOTA&apos;s  <br /><Link href="/auth/signin" className="text-white"><b><u>Terms of Service</u></b></Link> and <Link href="/auth/signin" className="text-white"><b><u>
                Privacy Policy.</u></b></Link></p>

        </div>
    )
}

export default Signin