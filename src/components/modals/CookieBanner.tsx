import Cookie from '@/public/svg-icons/cookie.svg'
import React from 'react'
import Button from '../figma/Button'
import { setCookie } from '@/src/helpers/auth'
import { useRouter } from 'next/navigation'
const CookieBanner = () => {
    const router = useRouter();
    return (
        <div className='w-full'>
            <div className='-m-2'>
                <Cookie />
            </div>
            <p className='text-white text-xl font-bold'>We use cookies</p>
            <p className='text-white text-sm py-2 pr-8'>Our site uses third-party cookies to personalize  your <br /> experience.</p>
            <div className='flex gap-2'>

                <Button onClick={() => {
                    setCookie('cookies', 'false', {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax',
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                        path: '/'
                    })
                    router.back()
                }} className='flex-1 !bg-black text-white' variant="outline" >Decline</Button>
                <Button className='flex-1' variant="primary" onClick={() => {
                    setCookie('cookies', 'true', {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax',
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                        path: '/'
                    })
                    router.back()
                }}>Accept</Button>
            </div>
        </div>
    )
}

export default CookieBanner