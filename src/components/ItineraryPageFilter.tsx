'use client'
import React, { useState } from 'react'
import GlassPanel from './figma/GlassPanel'
import Toggle from './Toggle/Toggle'
import Input from './figma/Input'
import { GrLocation } from 'react-icons/gr'
import { RxCross2, RxCrosshair2 } from 'react-icons/rx'
import Dropdown from './figma/Dropdown'
import Button from './figma/Button'
import { BiLeftArrow } from 'react-icons/bi'
import { GoArrowRight } from 'react-icons/go'
import ItineraryFilterBarGraph from './ItineraryFilterBarGraph'
import ItineraryFilterPieChart from './ItineraryFilterPieChart' 

const ItineraryPageFilter = ({advanceFilter, setAdvanceFilter}: {advanceFilter: boolean, setAdvanceFilter: (value: boolean) => void}) => {
    return (
        <GlassPanel className=' !rounded-3xl !p-[24px] bg-gradient-to-br from-[#6B6B6B]/30 to-[black] '>
            <div className='w-full'>

                <div className='flex justify-between items-center w-full'>
                    <p className='text-white  font-bold'>Trip Budget</p>
                    <Toggle enabled={true} setEnabled={() => { }} />

                </div>
                <p className='text-white text-xl font-bold'>$1000 <span className='text-[16px] font-normal'>  Max</span></p>
                <div>
                    {/* 
                        <div className='flex items-center w-full gap-5'>
                            <div>

                                <ItineraryFilterPieChart />
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex justify-between items-center w-full'>
                                    <p className='text-white text-sm font-normal flex items-center gap-2'><span className='h-2 w-2  rounded-full bg-[#0252D0]' /> Activities</p>
                                    <p className='text-white text-sm font-bold'>40%</p>
                                </div>
                                <div className='flex justify-between items-center w-full'>
                                    <p className='text-white text-sm font-normal flex items-center gap-2'><span className='h-2 w-2 rounded-full bg-[#C10B2F]' /> Lodging</p>
                                    <p className='text-white text-sm font-bold'>40%</p>
                                </div>
                                <div className='flex justify-between items-center w-full'>
                                    <p className='text-white text-sm font-normal flex items-center gap-2'><span className='h-2 w-2 rounded-full bg-[#988316]' /> Transportation</p>
                                    <p className='text-white text-sm font-bold'>30%</p>
                                </div>
                            </div>
                        </div> */}
                        <ItineraryFilterBarGraph color='white'/>

                </div>
                <div className='mt-4 flex justify-between items-center w-full'>
                    <p className='text-white  font-bold'>Destination</p>
                    <p className='text-[#BBD4FB] font-normal flex items-center gap-1'>Add <span className='text-2xl'> +</span></p>

                </div>
                <div className='mt-2 flex justify-between items-center gap-2 w-full'>
                    <div className='w-full'>
                        <Input icon={<GrLocation aria-hidden="true" className="size-6 text-white" />} className='w-full ' placeholder='Search Destination' />
                    </div>
                    <RxCross2 className='text-white size-6' />

                </div>
                <div className={` flex justify-between items-center w-full gap-3 ${advanceFilter ? 'flex-col' : 'flex-row'}`}>
                    <div className=' w-full mt-6'>
                        <p className='text-white  font-bold mb-2'>Dates</p>
                        <Dropdown className='' onSelect={() => { }} options={['malik']} />

                    </div>
                    <div className=' w-full mt-4'>
                        <p className='text-white  font-bold mb-2'>Guests</p>
                        <Dropdown onSelect={() => { }} options={['malik']} />
                    </div>
                </div>
                <div className='mt-6  w-full gap-3'>
                    <p className='text-white  font-bold mb-2'>Preferred Activities</p>
                    <Dropdown onSelect={() => { }} options={['malik']} />

                </div>
                <div className='mt-6  w-full gap-3'>
                    <p className='text-white  font-bold mb-2'>Lodging Type(s)</p>
                    <Dropdown onSelect={() => { }} options={['malik']} />

                </div>
                <div className='mt-6  w-full gap-3'>
                    <p className='text-white  font-bold mb-2'>Transportation Type(s)</p>
                    <Dropdown onSelect={() => { }} options={['malik']} />

                </div>
                {advanceFilter ?
                    <div className='flex justify-between items-center w-full gap-2'>
                        <Button onClick={() => setAdvanceFilter(false)} variant='outline' className='mt-6 w-full'>Reset</Button>

                        <Button variant='primary' className='mt-6 w-full'>Apply</Button>


                    </div> :
                    <Button onClick={() => setAdvanceFilter(true)} variant='outline' className='mt-6 w-full !bg-black flex items-center justify-center gap-2'>Advance Filter <GoArrowRight className='size-6' /></Button>
                }
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageFilter