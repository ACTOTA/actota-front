import React, { useState } from 'react';
import DateMenuCalendar from '../figma/DateMenuCalendar';


interface DateMenuProps {
    startDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    endDate: Date | null;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export default function DateMenu({ startDate, setStartDate, endDate, setEndDate }: DateMenuProps) {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const [rangeSettings, setRangeSettings] = useState([
        { label: "Exact dates", selected: true },
        { label: "1 day", selected: false },
        { label: "2 days", selected: false },
        { label: "3 days", selected: false },
        { label: "7 days", selected: false }
    ]);

    const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
        if (startDate) {
            const [hours, minutes] = startTime.split(':');
            const startDateTime = new Date(startDate);
            startDateTime.setHours(parseInt(hours), parseInt(minutes));
            setStartDate(startDateTime);
        }

        if (endDate) {
            const [hours, minutes] = endTime.split(':');
            const endDateTime = new Date(endDate);
            endDateTime.setHours(parseInt(hours), parseInt(minutes));
            setEndDate(endDateTime);
        }
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStartTime(e.target.value);
        if (startDate) {
            const [hours, minutes] = e.target.value.split(':');
            const newDate = new Date(startDate);
            newDate.setHours(parseInt(hours), parseInt(minutes));
            setStartDate(newDate);
        }
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndTime(e.target.value);
        if (endDate) {
            const [hours, minutes] = e.target.value.split(':');
            const newDate = new Date(endDate);
            newDate.setHours(parseInt(hours), parseInt(minutes));
            setEndDate(newDate);
        }
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

    return (
        <section className="w-full flex-col justify-center items-center gap-2 p-6">
            <DateMenuCalendar
                onDateRangeChange={handleDateRangeChange}
            />
            <div className='w-full grid grid-cols-2 gap-4'>
                <div className="justify-start items-center gap-4 inline-flex">
                    <div className="text-white text-base font-bold font-['Manrope'] leading-normal">Start</div>
                    <div className="flex-col justify-start items-end gap-2 inline-flex">
                        <select
                            value={startTime}
                            onChange={handleStartTimeChange}
                            className="h-12 px-4 bg-black/30 rounded-xl border border-[#9b9b9b] text-[#f7f7f7] text-base font-normal font-['Manrope'] leading-normal z-10"
                        >
                            {timeOptions.map(time => (
                                <option key={time} value={time} className=''>{time}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="justify-start items-center gap-4 inline-flex">
                    <div className="text-white text-base font-bold font-['Manrope'] leading-normal">End</div>
                    <div className="flex-col justify-start items-end gap-2 inline-flex my-4">
                        <select
                            value={endTime}
                            onChange={handleEndTimeChange}
                            className="h-12 px-4 bg-black/30 rounded-xl border border-[#9b9b9b] text-[#f7f7f7] text-base font-normal font-['Manrope'] leading-normal z-10"
                        >
                            {timeOptions.map(time => (
                                <option key={time} value={time} className=''>{time}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="h-8 gap-2 w-full flex">
                    {rangeSettings.map((item, i) => (
                        <div key={i} className={`px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white hover:cursor-pointer hover:bg-black/70 hover:border-[#FFF]
                            ${item.selected ? "px-3 py-1.5 h-full bg-black/50 rounded-[200px] border border-white" : "neutral-03 opacity-50"}`}
                            onClick={() => handleSelect(item.label)}>
                            <div className="text-white text-sm font-normal leading-tight whitespace-nowrap">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
