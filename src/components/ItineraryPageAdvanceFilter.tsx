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
import { MdOutlineDirectionsCarFilled } from 'react-icons/md'
import Counter from './Counter'

const ItineraryPageAdvanceFilter = ({ advanceFilter, setAdvanceFilter }: { advanceFilter: boolean, setAdvanceFilter: (value: boolean) => void }) => {
    const [selectedView, setSelectedView] = useState<'activities' | 'lodging' | 'transport'>('activities')
    const [sliderValue, setSliderValue] = useState(50);
    const [rooms, setRooms] = useState(0);
    const [beds, setBeds] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [activityType, setActivityType] = useState<"daily" | "total">("daily");
    const handleSliderChange = (e: any) => {
        setSliderValue(e.target.value);
    };

    return (
        <GlassPanel className=' !rounded-3xl !p-[24px] bg-gradient-to-br from-[#6B6B6B]/30 to-[black] '>
            <div className='w-full'>

                <div className='flex justify-between items-center w-full'>
                    <p className='text-white  font-bold'>Trip Budget</p>
                    <Toggle enabled={true} setEnabled={() => { }} />

                </div>
                <p className='text-white text-xl font-bold'>$1000 <span className='text-[16px] font-normal'>  Max</span></p>
                <div>
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
                    </div>

                </div>
                <div className="inline-flex justify-start  my-5 border border-border-primary rounded-full p-1">
                    <Button
                        onClick={() => setSelectedView('activities')}
                        className={` border-white  !py-2 ${selectedView === 'activities' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}

                        variant={selectedView === 'activities' ? 'outline' : 'simple'}
                    >
                        Activities
                    </Button>
                    <Button
                        onClick={() => setSelectedView('lodging')}
                        className={` border-white !py-2 ${selectedView === 'lodging' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
                        variant={selectedView === 'lodging' ? 'outline' : 'simple'}
                    >
                        Lodging
                    </Button>
                    <Button
                        onClick={() => setSelectedView('transport')}
                        className={` border-white  !py-2 ${selectedView === 'transport' ? 'bg-gradient-to-r from-white/20 to-white/5' : ''}`}
                        variant={selectedView === 'transport' ? 'outline' : 'simple'}
                    >
                        Transport
                    </Button>
                </div>
                {selectedView === 'transport' && <div className='flex items-center justify-between '>

                    <p className='flex items-center gap-2 text-white'><MdOutlineDirectionsCarFilled className='h-6 w-6' /> Transportation</p>
                    <Toggle enabled={true} setEnabled={() => { }} />
                </div>}
                <div className='mt-4 flex justify-between items-center w-full'>
                    <p className='text-white  font-bold'>{selectedView === 'activities' ? 'Activities' : selectedView === 'lodging' ? 'Lodging' : 'Transportation'} Budget</p>
                    <p className='text-white  font-bold flex items-center gap-1'>$700 <span className='text-sm font-normal text-primary-gray'> Max</span></p>

                </div>

                <ItineraryFilterBarGraph color={selectedView === 'activities' ? '#0252D0' : selectedView === 'lodging' ? '#C10B2F' : '#988316'} />
                {selectedView !== "lodging" &&
                    <div>

                        <div className='mt-4 flex justify-between items-center w-full'>
                            <p className='text-white  font-bold'>{selectedView === 'activities' ? 'Max Day Length' : selectedView === 'transport' ? 'Max Daily Drive Time' : ''}</p>
                            <p className='text-white  font-bold flex items-center gap-1'>{selectedView === 'activities' ? '10h' : selectedView === 'transport' ? '10h' : ''} <span className='text-sm font-normal text-primary-gray'> Max</span></p>

                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className={`w-full mt-1 accent-[${selectedView === 'activities' ? '#0252D0' : selectedView === 'transport' ? '#988316' : '#C10B2F'}]`}

                        />
                    </div>
                }




                {selectedView === 'activities' ?
                    <div className='mt-3'>
                        <div className='flex items-center justify-between'>
                            <p className='text-white  font-bold mb-2'>No of Activities</p>
                            <div className='flex items-center gap-1'>
                                <Button variant='outline' size='sm' className={`!py-2 ${activityType === "daily" ? "!bg-black" : "!bg-transparent"}`} onClick={() => setActivityType("daily")}>Daily</Button>
                                <Button variant='outline' size='sm' className={`!py-2 ${activityType === "total" ? "!bg-black" : "!bg-transparent"}`} onClick={() => setActivityType("total")}>Total</Button>
                            </div>
                        </div>
                        {activityType === "daily" ? <div className='mt-4 flex items-center justify-between w-full gap-3'>
                            <div>
                                <p className='text-white text-sm font-bold mb-1'>Activities</p>
                                <p className='text-white text-xs font-normal mb-2'>per day</p>
                            </div>
                            <Counter count={0} setCount={() => { }} max={10} />
                        </div> :
                            <div>

                                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"].map((item, i) => {
                                    return (
                                        <div key={i} className='flex items-center justify-between w-full gap-3 mb-2'>
                                            <div>
                                                <p className='text-white text-sm font-bold mb-1'>{item}</p>
                                                <p className='text-white text-xs font-normal mb-2'>per day</p>
                                            </div>
                                            <Counter count={0} setCount={() => { }} max={10} />
                                        </div>

                                    )
                                })}
                            </div>

                        }

                        <div className='mt-6  w-full gap-3'>
                            <p className='text-white  font-bold mb-2'>Preferred Activities</p>
                            <Dropdown onSelect={() => { }} options={['malik']} />

                        </div>
                    </div>
                    : selectedView === 'lodging' ?
                        <div>
                            {["No of Room(s)", "No of Bed(s)", "No of Bathroom(s)"].map((item, i) => {
                                return (
                                    <div key={i} className='mt-4 flex items-center justify-between w-full gap-3'>
                                        <p className='text-white  font-bold mb-2'>{item}</p>
                                        <Counter count={item === "No of Room(s)" ? rooms : item === "No of Bed(s)" ? beds : bathrooms} setCount={item === "No of Room(s)" ? setRooms : item === "No of Bed(s)" ? setBeds : setBathrooms} max={10} />
                                    </div>
                                )
                            })}
                            <div className='mt-6  w-full gap-3'>
                                <p className='text-white  font-bold mb-2'>Lodging Type(s)</p>
                                <Dropdown onSelect={() => { }} options={['malik']} />
                            </div>

                        </div> :

                        <div className='mt-6  w-full gap-3'>
                            <p className='text-white  font-bold mb-2'>Transportation Type(s)</p>
                            <Dropdown onSelect={() => { }} options={['malik']} />

                        </div>
                }


                {advanceFilter ?
                    <div className='flex justify-between items-center w-full gap-2'>
                        <Button onClick={() => setAdvanceFilter(false)} variant='outline' className='mt-6 w-full !py-3'>Reset</Button>

                        <Button onClick={() => setAdvanceFilter(false)}  variant='primary' className='mt-6 w-full !py-3'>Apply</Button>


                    </div> :
                    <Button onClick={() => setAdvanceFilter(true)} variant='outline' className='mt-6 w-full  !bg-black flex items-center justify-center gap-2'>Advance Filter <GoArrowRight className='size-6' /></Button>
                }
            </div>
        </GlassPanel>
    )
}

export default ItineraryPageAdvanceFilter