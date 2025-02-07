'use client'
import Button from '@/src/components/figma/Button'
import Input from '@/src/components/figma/Input'
import ListingCard from '@/src/components/ListingCard'
import PaymentInsuranceCard from '@/src/components/PaymentInsuranceCard'
import PaymentPageCard from '@/src/components/PaymentPageCard'
import SplitPaymentCard from '@/src/components/SplitPaymentCard'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CgArrowTopRight } from 'react-icons/cg'
import { FaStar } from 'react-icons/fa6'
import { HiOutlineMail } from 'react-icons/hi'
import { LuRoute, LuUser } from 'react-icons/lu'

const Payment = () => {
    return (
        <section className='w-full !h-full text-white pl-[80px]  gap-4 bg-[url("/images/payment-page-bg.png")] bg-cover bg-center bg-repeat'>
            <div className='grid grid-cols-6 gap-6 pt-[82px]'>

                {/* left side */}
                <div className='col-span-4 flex flex-col gap-4 w-full '>
                    <div className='flex items-center gap-2 mt-6'>
                        <ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer" />
                        <p className='text-primary-gray text-sm'>Itineraries /  Denver Tour  /   <span className='text-white'>Confirm Reservation</span></p>
                    </div>
                    <h1 className='text-4xl font-bold'>Confirm your Reservation</h1>
                    <PaymentPageCard />
                    <p className='text-white text-2xl font-bold mt-12'>Insurance</p>
                    <PaymentInsuranceCard name="Denver Tour" price={1000} imageSrc="/svg-icons/insurance-shield.svg" />
                    <PaymentInsuranceCard name="Denver Tour" price={1000} imageSrc="/svg-icons/insurance-shield2.svg" />
                    <PaymentInsuranceCard name="Denver Tour" price={1000} imageSrc="/svg-icons/insurance-shield3.svg" />
                    <PaymentInsuranceCard name="Denver Tour" price={1000} imageSrc="/svg-icons/insurance-shield4.svg" />
                    <p className='text-white text-2xl font-bold mt-10'>Trip Members</p>
                    <div className='flex gap-4'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center gap-2'>
                                <LuUser className='text-white h-5 w-5' /> <p className='text-white '>Guest 1</p>
                                <Button variant='primary' size='sm' className='!bg-[#215CBA] text-white font-normal !px-2 !py-1'>Trip Leader</Button>
                            </div>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Full Name</p>
                                <Input type="text" name="fullName" placeholder="Full Name" />
                            </div>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Email Address</p>
                                <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center gap-2'>
                                <LuUser className='text-white h-5 w-5' /> <p className='text-white '>Guest 2</p>
                            </div>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Full Name</p>
                                <Input type="text" name="fullName" placeholder="Full Name" />
                            </div>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Email Address</p>
                                <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
                            </div>
                        </div>
                    </div>
                    <p className='text-white text-2xl font-bold mt-10'>Payment Method</p>
                    <div className='flex gap-2'>
                        <div className='relative flex-1 flex flex-col justify-between gap-2 p-4 border border-[#BBD4FB] rounded-xl'>
                            <Image src={"/images/payment-page-card-blur-bg.png"} alt="card" layout='fill' className='absolute top-0 left-[-30px] ' />
                            <Image src={"/svg-icons/credit-card.svg"} alt="card" width={24} height={24} />
                            <p className='text-white font-bold'> Card</p>
                        </div>
                        <div className='relative flex-1 flex flex-col justify-between gap-2 p-4 border border-[#BBD4FB] rounded-xl'>
                            <Image src={"/images/payment-page-card-blur-bg.png"} alt="card" layout='fill' className='absolute top-0 left-[-30px] ' />
                            <Image src={"/svg-icons/apple.svg"} alt="card" width={24} height={24} />
                            <p className='text-white font-bold'> Apple Pay</p>
                        </div>
                        <div className='relative flex-1 flex flex-col justify-between gap-2 p-4 border border-[#BBD4FB] rounded-xl'>
                            <Image src={"/images/payment-page-card-blur-bg.png"} alt="card" layout='fill' className='absolute top-0 left-[-30px] ' />
                            <Image src={"/svg-icons/google.svg"} alt="card" width={24} height={24} />
                            <p className='text-white font-bold'> Google Pay</p>
                        </div>
                        <div className='relative flex-1 flex flex-col justify-between gap-2 p-4 border border-[#BBD4FB] rounded-xl'>
                            <Image src={"/images/payment-page-card-blur-bg.png"} alt="card" layout='fill' className='absolute top-0 left-[-30px] ' />
                            <Image src={"/svg-icons/paypal.svg"} alt="card" width={24} height={24} />
                            <p className='text-white font-bold'> PayPal</p>
                        </div>

                    </div>
                    <div className='flex gap-2'>
                        <div className='flex-1 flex flex-col gap-2'>

                            <p className='text-white text-xl font-bold mt-10 flex items-center gap-2'><Image src={"/svg-icons/atm-card.svg"} alt="add card" width={24} height={24} /> Add a new card</p>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Card Holder Name</p>
                                <Input type="text" name="fullName" placeholder="Card Holder Name" />
                            </div>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Card Number</p>
                                <Input type="text" name="fullName" placeholder="Card Number" />
                            </div>
                            <div className='flex gap-2'>
                                <div className='flex-1'>
                                    <p className="text-primary-gray text-left mb-1 mt-[10px]">Expiry Date</p>
                                    <Input type="text" name="fullName" placeholder="MM/YY" />
                                </div>
                                <div className='flex-1'>
                                    <p className="text-primary-gray  text-left mb-1 mt-[10px]">CVV</p>
                                    <Input type="text" name="fullName" placeholder="***" />
                                </div>
                            </div>

                        </div>
                        <div className='flex-1 flex flex-col gap-2 '>
                            <p className='text-white text-xl font-bold mt-10 flex items-center gap-2 ml-10'><Image src={"/svg-icons/atm-card.svg"} alt="add card" width={24} height={24} /> My Saved Card(s)</p>
                            <p className='text-primary-gray text-sm ml-[70px]'>You haven’t added any cards yet.</p>
                        </div>
                    </div>
                    <div>
                        <p className='text-white  font-bold mt-10'>Split Payment</p>
                        <div className='flex gap-4 mt-2'>
                            <div className='flex-1'>
                                <SplitPaymentCard name="Denver Tour" />
                            </div>
                            <div className='flex-1'>
                                <SplitPaymentCard name="Denver Tour" />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex-1 flex flex-col gap-2'>

                            <p className='text-white text-2xl font-bold mt-10'>Billing Details</p>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Full Name</p>
                                <Input type="text" name="fullName" placeholder="Full Name" />
                            </div>
                            <div>
                                <p className="text-primary-gray w-96 text-left mb-1 mt-[10px]">Billing Address</p>
                                <Input type="text" name="fullName" placeholder="Address (House No., building Street Area)" />
                            </div>
                            <Input type="text" name="fullName" className='w-full' placeholder="City" />
                            <div className='flex w-full gap-2'>
                                <div className='flex-1'>
                                    <Input type="text" name="fullName" placeholder="State" />
                                </div>
                                <div className='flex-1'>
                                    <Input type="text" name="fullName" placeholder="Zip Code" />
                                </div>
                            </div>

                        </div>
                        <div className='flex-1 flex flex-col gap-2'></div>
                    </div>
                    <div>
                        <div className='flex justify-between'>
                            <p className='text-white text-2xl font-bold mt-10'>Message your Guide</p>
                            <p className='text-white  mt-10'>Optional</p>
                        </div>
                        <div className='flex items-start gap-2 mt-4'>
                            <Image src={"/images/logo.png"} alt="message" className='rounded-full border h-[55px] w-[55px] border-border-primary' width={55} height={55} />
                            <div className='flex flex-col gap-2'>
                                <p className='text-white font-bold'>Jennie L.</p>

                                <p className='text-primary-gray text-sm flex items-center gap-1'>7 years guiding    <FaStar className='text-[#FEDB25]' />  4.5(100)</p>

                                <textarea placeholder='Your message here' className='w-[400px] bg-black text-start h-[112px] border border-border-primary rounded-xl p-4' />
                            </div>
                        </div>
                        <p className='text-white text-2xl font-bold mt-6'>Cancellation Policy</p>
                        <br />
                        <p className='text-white  '>Free cancellation for the first 72 hours within payment confirmed.</p>
                        <p className='text-white  '>Cancel before August 20 for a partial refund.</p>
                        <br />
                        <p className='text-white  '>Your reservation won’t be confirmed until an Agent or Guide accepts your request (typically within 24hours).
                            You won’t be charged until the</p>
                        <div className="inline-flex items-center gap-1 mt-2">
                            <p className=" font-bold">Learn more</p>
                            <CgArrowTopRight className=" h-5 w-5" />
                        </div>
                    </div>
                    <div>

                    </div>

                    <div>

                    </div>

                </div>

                {/* right side */}
                <div className='col-span-2 flex flex-col  w-full bg-black pt-[64px] pl-[32px] pr-[64px]'>
                    <p className='text-center'>Total amount</p>
                    <p className='text-white text-[64px] font-bold text-center'><span className='text-primary-gray'>$</span> 1000</p>

                    <p className='text-sm text-primary-gray mb-2'>Promo Code</p>
                    <Input placeholder='Enter promo code' icon={<Image src={"/svg-icons/promo-code.svg"} alt='search icon' width={16} height={16} />} />
                    <p className='text-sm text-[#BBD4FB] mt-1'>You saved $45 on this booking!</p>
                    <p className='text-xl  mt-8'>Payment Detail</p>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Activity Cost</p>
                        <p className='text-sm text-white'> $1000</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Lodging Cost</p>
                        <p className='text-sm text-white'> $1000</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Transport Cost</p>
                        <p className='text-sm text-white'> $1000</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Travel agent fee</p>
                        <p className='text-sm text-white'> $1000</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Service fee</p>
                        <p className='text-sm text-white'> $1000</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Promo Code</p>
                        <p className='text-sm text-[#5389DF]'> -$45</p>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent mt-4"></div>
                    <div className='flex justify-between my-3' >
                        <p className=' font-bold text-white'>Total Amount</p>
                        <p className='text-xl font-bold text-white'> $1000</p>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                    <p className='text-xl  mt-8'>Sign in or Create an Account</p>
                    <div className='flex relative items-start gap-3 p-4 border border-[#BBD4FB] rounded-xl mt-6 '>

                        <Image src={"/images/payment-page-card-blur-bg.png"} alt="user" layout='fill' className='absolute top-0 left-[-30px] ' />
                        <Image src={"/svg-icons/gift-box.svg"} alt="user" width={35} height={35} />
                        <div>
                            <p className='text-white font-bold mb-1'>Log in or register for a seamless booking and more benefits!</p>
                            <p className='text-primary-gray text-sm'>Earn points for every booking and save up to 50%!</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-primary-gray w-96 text-left mb-1 mt-[16px]">Email Address</p>
                        <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
                    </div>
                    <Button type="submit" variant="primary" className="bg-white text-black w-full my-[24px]">Continue</Button>

                    <div className="text-white flex justify-center items-center gap-[16px]">
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                        <p className='text-primary-gray text-[14px] leading-[20px] whitespace-nowrap'>or continue with</p>
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                    </div>
                    <div className="flex justify-center items-center gap-[8px] my-[16px] pb-[16px]">
                        <button className='bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 rounded-[8px] py-[16px] w-[120px] flex justify-center items-center  hover:cursor-pointer'>
                            <Image src="/svg-icons/google.svg" alt="google" width={24} height={24} />
                        </button>
                        <button className='bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 rounded-[8px] py-[14px] w-[120px] flex justify-center items-center hover:cursor-pointer'>
                            <Image src="/svg-icons/apple.svg" alt="apple" width={24} height={24} />
                        </button>
                        <button className='bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 rounded-[8px] py-[16px] w-[120px] flex justify-center items-center hover:cursor-pointer'>
                            <Image src="/svg-icons/facebook.svg" alt="facebook" width={24} height={24} />
                        </button>
                    </div>

                    <p className="text-center text-primary-gray text-[16px] leading-[20px]"><Link href="/auth/signup" className="text-white"><b><u>Trouble signing in?</u></b></Link></p>
                    <p className=" text-primary-gray text-sm mt-12">By confirming your reservation, you agree to ACTOTA’s <Link href="/auth/signup" className="text-white"><b><u>Terms of Service</u></b></Link> and <Link href="/auth/signup" className="text-white"><b><u>Privacy Policy</u></b></Link></p>
                </div>
            </div>
        </section>
    )
}

export default Payment
