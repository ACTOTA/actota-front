import Cookie from '@/public/svg-icons/cookie.svg'
import React from 'react'
import Button from '../figma/Button'
import Link from 'next/link'
import Input from '../figma/Input'
import { HiOutlineMail } from 'react-icons/hi'
import { useRouter } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go'
import { BiLock } from 'react-icons/bi'
const Signup = () => {
    const router = useRouter();
    const signUp = () => {
        router.push("?modal=signupLoading")
        setTimeout(() => {
            router.push(window.location.pathname);
        }, 3000)
    }
    return (
        <div className='w-full'>

            <p className='text-white text-xl font-bold'>Create an Account</p>
            <p className="m-auto mt-1 text-primary-gray text-[16px] leading-[20px]">Already have an account? <Link href="/auth/signin" className="text-white"><b><u>Sign in here</u></b></Link></p>


            <div>
                <p className="text-primary-gray w-96 text-left mb-1 mt-[16px]">Full Name</p>
                <Input type="text" name="fullName" placeholder="Full Name" />
            </div>
            <div>
                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Password</p>
                <Input type="password" name="password" icon={<BiLock className="text-white h-[20px] w-[20px]" />} placeholder="Your Password" />
                <div className="h-2" />
            </div>


            <Button onClick={signUp} variant="primary" className="bg-white text-black w-full my-[10px]">Create Account</Button>
            <p className="m-auto text-center text-primary-gray text-[14px] leading-[20px]">By confirming your reservation, you agree to ACTOTA&apos;s  <br /><Link href="/auth/signin" className="text-white"><b><u>Terms of Service</u></b></Link> and <Link href="/auth/signin" className="text-white"><b><u>
                Privacy Policy.</u></b></Link></p>

        </div>
    )
}

export default Signup