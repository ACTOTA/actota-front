import Cookie from '@/public/svg-icons/cookie.svg'
import React from 'react'
import Button from '../figma/Button'

const CookieBanner = () => {
    return (
        <div>
            <div className='-m-2'>
                <Cookie />
            </div>
            <p className='text-white text-xl font-bold'>We use cookies</p>
            <p className='text-white text-sm py-2 pr-8'>Our site uses third-party cookies to personalize  your <br /> experience.</p>
            <div className='flex gap-2'>

                <Button className='flex-1 !bg-black text-white' variant="outline" >Decline</Button>
                <Button className='flex-1' variant="primary">Accept</Button>
            </div>
        </div>
    )
}

export default CookieBanner