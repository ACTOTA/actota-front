'use client'
import Button from '@/src/components/figma/Button'
import Input from '@/src/components/figma/Input'
import ListingCard from '@/src/components/ListingCard'
import PaymentInsuranceCard from '@/src/components/PaymentInsuranceCard'
import PaymentPageCard from '@/src/components/PaymentPageCard'
import SplitPaymentCard from '@/src/components/SplitPaymentCard'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CgArrowTopRight } from 'react-icons/cg'
import { FaStar } from 'react-icons/fa6'
import { GoArrowRight } from 'react-icons/go'
import { HiOutlineMail } from 'react-icons/hi'
import { LuRoute, LuUser } from 'react-icons/lu'
import { usePathname, useRouter } from 'next/navigation';
import { IoAlertCircleOutline } from 'react-icons/io5'
import { useItineraryById } from '@/src/hooks/queries/itinerarieById/useItineraryByIdQuery'
const Payment = () => {
    const pathname = usePathname() as string;
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentIndex, setCurrentIndex] = useState(0);
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const { data: apiResponse, isLoading, error } = useItineraryById(objectId);
  const [itineraryData, setItineraryData] = useState<any | null>(null);
    const [showPaymentReview, setShowPaymentReview] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState([{
        id: 1,
        name: "Card",
        image: "/svg-icons/credit-card.svg",
        selected: true
    },
    {
        id: 2,
        name: "Apple Pay",
        image: "/svg-icons/apple.svg",
        selected: false
    },
    {
        id: 3,
        name: "Google Pay",
        image: "/svg-icons/google.svg",
        selected: false
    },

    {
        id: 4,
        name: "PayPal",
        image: "/svg-icons/paypal.svg",
        selected: false
    }
    ]);
    const [paymentInsurance, setPaymentInsurance] = useState([
        {
            id: 1,
            name: "Travel Insurance",
            price: 59,
            image: "/svg-icons/insurance-shield.svg",
            selected: true
        },
        {
            id: 2,
            name: "Delay Insurance",
            price: 59,
            image: "/svg-icons/insurance-shield2.svg",
            selected: false
        },
        {
            id: 3,
            name: "Free Reschedule Guarantee",
            price: 19,
            image: "/svg-icons/insurance-shield3.svg",
            selected: false
        },
        {
            id: 4,
            name: "100% Refund Guarantee",
            price: 19,
            image: "/svg-icons/insurance-shield4.svg",
            selected: false
        }
    ]);





    const handleInsuranceToggle = (id: number) => {
        setPaymentInsurance(prevInsurance =>
            prevInsurance.map(insurance =>
                insurance.id === id
                    ? { ...insurance, selected: !insurance.selected }
                    : insurance
            )
        );
    };
    const confirmBooking = () => {
        router.push("?modal=guestCheckoutLoading")
        setTimeout(() => {
            router.push("?modal=bookingConfirmed")
        }, 3000)
    }



  useEffect(() => {
    if (apiResponse) {
      setItineraryData(apiResponse);
    }
  }, [apiResponse]);

  const basePrice = itineraryData?.person_cost * (itineraryData?.min_group || 1);
  const selectedInsurance = paymentInsurance
    .filter(insurance => insurance.selected)
    .reduce((total, insurance) => total + insurance.price, 0);
  const totalAmount = basePrice + selectedInsurance;


  if (isLoading) {
    return <div className='text-white flex justify-center items-center h-screen'>Loading...</div>;
  }

  if (error) {
    console.error('Error details:', error);
    return <div className='text-white flex justify-center items-center h-screen'>{user ? 'Error: ' + error.message : 'Please login to view itinerary details'}</div>;
  }


  if (!itineraryData) {
    return <div className='text-white flex justify-center items-center h-screen'>Loading itinerary data...</div>;
  }
    return (
        <section className='w-full !h-full text-white   bg-[url("/images/payment-page-bg.png")] bg-cover bg-center bg-repeat'>
            <div className='grid grid-cols-6 gap-6 pt-[78px]'>

                {/* left side */}
                <div className={`lg:col-span-4 col-span-6 flex flex-col gap-4 w-full pl-[80px] max-lg:px-[20px] ${showPaymentReview ? 'max-lg:hidden' : ''}`}>
                    <div className='flex items-center gap-2 mt-5'>
                        <ArrowLeftIcon onClick={() => router.back()} className="h-6 w-6 hover:cursor-pointer" />
                        <p className='text-primary-gray text-sm'>Itineraries /  {itineraryData.trip_name}  /   <span className='text-white'>Confirm Reservation</span></p>
                    </div>
                    <h1 className='text-4xl font-bold'>Confirm your Reservation</h1>
                    <PaymentPageCard itineraryData={itineraryData}  />
                    <p className='text-white text-2xl font-bold mt-12'>Insurance</p>
                    {paymentInsurance.map((insurance) => (
                        <PaymentInsuranceCard
                            key={insurance.id}
                            insurance={insurance}
                            onToggleSelect={handleInsuranceToggle}
                        />
                    ))}

                    <p className='text-white text-2xl font-bold mt-10'>Trip Members</p>
                    <div className='flex max-md:flex-wrap gap-4'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center gap-2'>
                                <LuUser className='text-white h-5 w-5' /> <p className='text-white '>Guest 1</p>
                                <Button variant='primary' size='sm' className='!bg-[#215CBA] text-white font-normal !px-2 !py-1'>Trip Leader</Button>
                            </div>
                            <div>
                                <p className="text-primary-gray  text-left mb-1 mt-[10px]">Full Name</p>
                                <Input type="text" name="fullName" placeholder="Full Name" />
                            </div>
                            <div>
                                <p className="text-primary-gray text-left mb-1 mt-[10px]">Email Address</p>
                                <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center gap-2'>
                                <LuUser className='text-white h-5 w-5' /> <p className='text-white '>Guest 2</p>
                            </div>
                            <div>
                                <p className="text-primary-gray  text-left mb-1 mt-[10px]">Full Name</p>
                                <Input type="text" name="fullName" placeholder="Full Name" />
                            </div>
                            <div>
                                <p className="text-primary-gray  text-left mb-1 mt-[10px]">Email Address</p>
                                <Input type="email" name="email" icon={<HiOutlineMail className="text-white h-[20px] w-[20px]" />} placeholder="Your email address" />
                            </div>
                        </div>
                    </div>
                    <p className='text-white text-2xl font-bold mt-10'>Payment Method</p>
                    <div className='flex gap-2 max-sm:flex-wrap'>
                        {paymentMethod.map((item) => (
                            <div onClick={() => setPaymentMethod(paymentMethod.map(method => ({ ...method, selected: method.id === item.id })))} key={item.id} className={`relative sm:flex-1 max-sm:w-[48%]  flex sm:flex-col  sm:justify-between max-sm:items-center gap-2 p-4 border  rounded-xl ${item.selected ? 'border-[#BBD4FB]' : 'border-primary-gray'}`}>
                                {item.selected && <Image src={"/images/payment-page-card-blur-bg.png"} alt="card" layout='fill' className='absolute top-0 left-[-30px] ' />}
                                <Image src={item.image} alt="card" width={24} height={24} />
                                <p className='text-white font-bold'> {item.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-2 max-md:flex-col-reverse'>
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
                            <p className='text-white text-xl font-bold mt-10 flex items-center gap-2 lg:ml-10'><Image src={"/svg-icons/atm-card.svg"} alt="add card" width={24} height={24} /> My Saved Card(s)</p>
                            <p className='text-primary-gray text-sm lg:ml-[70px]'>You haven't added any cards yet.</p>
                        </div>
                    </div>
                    <div>
                        <p className='text-white  font-bold mt-10'>Split Payment</p>
                        <div className='flex max-md:flex-col gap-4 mt-2'>
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

                                <textarea placeholder='Your message here' className='w-[400px] max-sm:w-full bg-black text-start h-[112px] border border-border-primary rounded-xl p-4' />
                            </div>
                        </div>
                        <p className='text-white text-2xl font-bold mt-6'>Cancellation Policy</p>
                        <br />
                        <p className='text-white  '>Free cancellation for the first 72 hours within payment confirmed.</p>
                        <p className='text-white  '>Cancel before August 20 for a partial refund.</p>
                        <br />
                        <p className='text-white  '>Your reservation won't be confirmed until an Agent or Guide accepts your request (typically within 24hours).
                            You won't be charged until the</p>
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
                <div className={`col-span-6 lg:col-span-2 flex flex-col  w-full bg-black pt-[50px] max-lg:pt-[20px] pl-[32px] pr-[64px] ${showPaymentReview ? '' : 'max-lg:hidden'}`}>
                    <p onClick={() => setShowPaymentReview(false)} className='text-left text-white text-sm flex items-center gap-2 cursor-pointer lg:hidden'><ArrowLeftIcon className='size-4' />Reservation Details </p>
                    <p className='text-center'>Total amount</p>
                    <p className='text-white text-[64px] font-bold text-center'><span className='text-primary-gray'>$</span> {totalAmount}</p>

                    <p className='text-sm text-primary-gray mb-2'>Promo Code</p>
                    <Input placeholder='Enter promo code' icon={<Image src={"/svg-icons/promo-code.svg"} alt='search icon' width={16} height={16} />} />
                    <p className='text-sm text-[#BBD4FB] mt-1'>You saved $45 on this booking!</p>
                    <p className='text-xl  mt-8'>Payment Detail</p>

                <div className='flex justify-between mt-2'>
                    <p className='text-sm text-primary-gray'>Base Cost (${itineraryData.person_cost} × {itineraryData.min_group} guests)</p>
                    <p className='text-sm text-white'>${basePrice}</p>
                </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Activity Cost</p>
                        <p className='text-sm text-white'> ${itineraryData.activity_cost || 0}</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Lodging Cost</p>
                        <p className='text-sm text-white'> ${itineraryData.lodging_cost || 0}</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Transport Cost</p>
                        <p className='text-sm text-white'> ${itineraryData.transport_cost || 0}</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Travel agent fee</p>
                        <p className='text-sm text-white'> ${itineraryData.travel_agent_fee || 0}</p>
                    </div>
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Service fee</p>
                        <p className='text-sm text-white'> ${itineraryData.service_fee || 0}</p>
                    </div>
                    {paymentInsurance.filter(insurance => insurance.selected).map(insurance => (
                    <div key={insurance.id} className='flex justify-between mt-2'>
                        <p className='text-sm text-primary-gray'>{insurance.name}</p>
                        <p className='text-sm text-white'>${insurance.price}</p>
                    </div>
                ))}
                    <div className='flex justify-between mt-2' >
                        <p className='text-sm text-primary-gray'>Promo Code</p>
                        <p className='text-sm text-[#5389DF]'> ${itineraryData.promo_code || 0}</p>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent mt-4"></div>
                    <div className='flex justify-between my-3' >
                        <p className=' font-bold text-white'>Total Amount</p>
                        <p className='text-xl font-bold text-white'> ${totalAmount}</p>
                    </div>

                    {user ? (
                        <Button onClick={() => confirmBooking()} variant="primary" className="gap-2">Pay ${totalAmount}  <GoArrowRight className='size-5' /></Button>
                    ) : (
                        <Button onClick={() => router.push("?modal=guestCheckout")} variant="outline" className="gap-2">Checkout as a Guest  <GoArrowRight className='size-5' /></Button>
                    )}






                    {!user && (
                        <>

                            <div className="text-white flex justify-center items-center gap-[16px] mt-4">
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                                <p className='text-primary-gray text-[14px] leading-[20px] whitespace-nowrap'>or </p>
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                            </div>
                            <p className='text-xl  mt-4'>Sign in or Create an Account</p>
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
                            <Button onClick={() => router.push("?modal=signin")} variant="primary" className="bg-white text-black w-full my-[24px]">Continue</Button>

                            <div className="text-white flex justify-center items-center gap-[16px]">
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                                <p className='text-primary-gray text-[14px] leading-[20px] whitespace-nowrap'>or continue with</p>
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                            </div>
                            <div className="flex justify-center items-center gap-[8px] my-[16px] pb-[16px]">
                                <button onClick={() => router.push("?modal=bookingConfirmed")} className='bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D]/70 rounded-[8px] py-[16px] w-[120px] flex justify-center items-center  hover:cursor-pointer'>
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


                        </>
                    )}




                    <p className=" text-primary-gray text-sm mt-12 max-lg:text-center">By confirming your reservation, you agree to ACTOTA's <Link href="/auth/signup" className="text-white"><b><u>Terms of Service</u></b></Link> and <Link href="/auth/signup" className="text-white"><b><u>Privacy Policy</u></b></Link></p>
                </div>
                {!showPaymentReview && <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 z-10 flex justify-between items-center gap-2 col-span-6 px-[20px] py-[10px]'>
                    <div>
                        <p className='text-white text-sm flex items-center gap-1'>Total <IoAlertCircleOutline className='size-4' /></p>
                        <p className='text-white text-xl font-bold'>$1000</p>
                    </div>
                    <div>
                        <Button onClick={() => setShowPaymentReview(true)} variant='primary' size='md' >Review <ArrowRightIcon className='size-4' /></Button>
                    </div>
                </div>}
            </div>
        </section>
    )
}

export default Payment
