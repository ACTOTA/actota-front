import React from 'react';
import DateMenuCalendar from '../figma/DateMenuCalendar';
import Dropdown from '../figma/Dropdown';


export default function DateMenu() {


    return (
        <section className="w-[680px] h-[424px] flex flex-col justify-center items-center gap-2">
            <div className="w-full flex justify-between"> 
                <h2 className='text-xl font-bold'>Select Date</h2>
                <h2 className='text-xl font-bold'>Select Date</h2>
            </div>
            <DateMenuCalendar />
            <div>
            </div>

            <div>
            </div>
        </section>
    )
}
