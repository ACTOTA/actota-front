import React, { useState } from 'react';
import DateMenuCalendar from '../figma/DateMenuCalendar';



export default function DateMenu() {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [dateSettings, setDateSettings] = useState([
        { label: "Dates", selected: true },
        { label: "Flexible", selected: false }
    ]);
    const [rangeSettings, setRangeSettings] = useState([
        { label: "Exact dates", selected: true },
        { label: "1 day", selected: false },
        { label: "2 days", selected: false },
        { label: "3 days", selected: false },
        { label: "7 days", selected: false }
    ]);


    const [estimatedStay, setEstimatedStay] = useState([
        { label: "A Weekend", selected: true },
        { label: "A Week", selected: false },
        { label: "2 Weeks", selected: false },
        { label: "3 Weeks", selected: false },
        { label: "A Month", selected: false },
        { label: "> 1 Month", selected: false }
    ]);

    const [whenToGo, setWhenToGo] = useState(() => {
        const currentYear = new Date().getFullYear();
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ].map(month => ({
            label: `${month.slice(0, 3)} ${currentYear}`,
            selected: month === "January" ? true : false
        }));

        return [
            ...months
        ];
    });

    const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStartTime(e.target.value);
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndTime(e.target.value);
    }

    const handleWhenToGoChange = (selectedLabel: string) => {
        setWhenToGo(prevSettings =>
            prevSettings.map(item => ({
                ...item,
                selected: item.label === selectedLabel
            }))
        );
    }
    // Generate time options from 00:00 to 23:45 in 15-minute increments
    const timeOptions = Array.from({ length: 96 }, (_, i) => {
        const hours = Math.floor(i / 4).toString().padStart(2, '0');
        const minutes = ((i % 4) * 15).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    });

    const handleSelect = (selectedLabel: string) => {
        setRangeSettings(prevSettings =>
            prevSettings.map(item => ({
                ...item,
                selected: item.label === selectedLabel
            }))
        );
    };

    const handleDateSettingChange = (selectedLabel: string) => {
        setDateSettings(prevSettings =>
            prevSettings.map(item => ({
                ...item,
                selected: item.label === selectedLabel
            }))
        );
    }

    const handleEstimatedStayChange = (selectedLabel: string) => {
        setEstimatedStay(prevSettings =>
            prevSettings.map(item => ({
                ...item,
                selected: item.label === selectedLabel
            }))
        );
    }
    return (
        <section className="w-full h-full text-white backdrop-blur-md border-2 border-border-primary rounded-3xl flex-col justify-center items-center gap-2 pl-4 pr-4 pt-6 pb-4">
            <div className="h-9 gap-2 w-full flex justify-center">
                {dateSettings.map((item, i) => (
                    <div key={i} className={`px-3 py-2 h-full bg-black/50 rounded-[200px] border border-white hover:cursor-pointer hover:bg-black/70 hover:border-[#FFF]
                            ${item.selected ? "px-3 py-2 h-full bg-black/50 rounded-[200px] border border-white" : "neutral-03 opacity-50"}`}
                        onClick={() => handleDateSettingChange(item.label)}>
                        <div className="text-white text-sm font-normal leading-tight whitespace-nowrap">{item.label}</div>
                    </div>
                ))}
            </div>


            {dateSettings[0].selected === true ? (
                <>

                    <DateMenuCalendar onDateRangeChange={handleDateRangeChange} />
                    <div className='w-full  gap-4 '>
                <div className='flex justify-between items-center flex-wrap'>
                        <div className="flex justify-center items-center gap-4 ">
                            <div className="text-white text-base font-bold  leading-normal text-center">Start Time</div>
                            <div className="flex-col justify-start items-end gap-2 inline-flex">
                                <select
                                    value={startTime}
                                    onChange={handleStartTimeChange}
                                    className="h-12  bg-transparent border-none text-[#f7f7f7] text-base font-normal  leading-normal z-10"
                                >
                                    {timeOptions.map(time => (
                                        <option key={time} value={time} className=''>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="justify-center items-center gap-4 flex">
                            <div className="text-white text-base font-bold  leading-normal">End Time</div>
                            <div className="flex-col justify-start items-end gap-2 inline-flex ">
                                <select
                                    value={endTime}
                                    onChange={handleEndTimeChange}
                                    className="h-12  bg-transparent border-none text-[#f7f7f7] text-base font-normal  leading-normal z-10"
                                >
                                    {timeOptions.map(time => (
                                        <option key={time} value={time} className=''>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                </div>

                        <div className="h-8 gap-2 w-full flex overflow-x-scroll">
                            {rangeSettings.map((item, i) => (
                                <div key={i} className={`px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white hover:cursor-pointer hover:bg-black/70 hover:border-[#FFF]
                            ${item.selected ? "px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white" : "neutral-03 opacity-50"}`}
                                    onClick={() => handleSelect(item.label)}>
                                    <div className="text-white text-sm font-normal leading-tight whitespace-nowrap">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex flex-col items-start justify-start mt-8'>
                    <p className='text-white text-xl font-bold'>How long you're staying?</p>
                    <div className="h-8 gap-2 w-full flex flex-wrap mt-4">
                        {estimatedStay.map((item, i) => (
                            <div key={i} className={`px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white hover:cursor-pointer hover:bg-black/70 hover:border-[#FFF]
                            ${item.selected ? "px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white" : "neutral-03 opacity-50"}`}
                                onClick={() => handleEstimatedStayChange(item.label)}>
                                <div className="text-white text-sm font-normal leading-tight whitespace-nowrap">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <p className='text-white text-xl font-bold mt-8'>When do you want to go?</p>
                    <div className=" gap-2 w-[90%] flex flex-wrap  ">
                        {whenToGo.map((item, i) => (
                            <div key={i} className={`px-3 py-1.5 h-full mt-4 bg-black/50 rounded-[200px] border border-white hover:cursor-pointer hover:bg-black/70 hover:border-[#FFF]
                            ${item.selected ? "px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white" : "neutral-03 opacity-50"}`}
                                onClick={() => handleWhenToGoChange(item.label)}>
                                <div className="text-white text-sm font-normal leading-tight whitespace-nowrap">{item.label}</div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </section>
    )
}
