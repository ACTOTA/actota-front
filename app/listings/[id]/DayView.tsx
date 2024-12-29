import { FeaturedVacation } from '@/db/models/itinerary';
import React, { useEffect } from 'react';


interface DayViewProps {
	listing: FeaturedVacation;
}

export default function DayView({ listing }: DayViewProps) {

	const [selectDay, setSelectDay] = React.useState("1");

	useEffect(() => {
		console.log(listing);


	}, [])

	return (
		<section className='h-full w-full'>
			<div className="h-12 px-8 justify-start items-center gap-4 inline-flex">
				<div className="text-white text-xl font-bold font-['Manrope'] leading-7">Day</div>
				<div className="p-1 bg-black/50 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] border border-[#dedede] backdrop-blur-xl justify-start items-center flex">
					{Object.keys(listing.days).map((dayNumber) => (
						<div key={dayNumber} className={`w-16 h-10 px-4 py-2 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] 
							justify-center items-center gap-2.5 inline-flex 
							${selectDay === dayNumber ? 'text-white border stroke-glass1 glass-bg-default glass-corner' : 'neutral-05'}`}
							onClick={() => setSelectDay(dayNumber)}>
							{dayNumber}
						</div>
					))}
				</div>


			</div>
			{Object.values(listing.days).map((day, i) => (
				<div key={i} className="h-[148px] p-2 bg-black/20 rounded-xl shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] border-2 border-[#fedb25] backdrop-blur-xl justify-start items-center gap-4 inline-flex">
					<div className="grow shrink basis-0 self-stretch p-2 flex-col justify-between items-start inline-flex">
						<div className="self-stretch justify-between items-center inline-flex">
							<div className="justify-center items-center gap-2 flex">
								<div className="text-white text-base font-bold font-['Manrope'] leading-normal">{day[i].name}</div>
							</div>
							<div className="w-6 h-6 relative  overflow-hidden" />
						</div>
						<div className="self-stretch justify-between items-end inline-flex">
							<div className="justify-center items-start gap-12 flex">
								<div className="w-64 self-stretch pl-3 pr-4 py-3 bg-black/50 rounded-lg flex-col justify-center items-start gap-1 inline-flex">
									<div className="justify-center items-end gap-2 inline-flex">
										<div className="w-5 h-5 p-0.5 justify-center items-center flex overflow-hidden">
											<div className="w-4 h-4 relative flex-col justify-start items-start flex">
												<div className="w-4 h-4 relative bg-black/50 rounded-[200px] border border-[#b3b3b3]" />
												<div className="w-2 h-2 relative bg-white rounded-[153.85px]" />
											</div>
										</div>
										<div className="text-[#f7f7f7] text-sm font-normal font-['Manrope'] leading-tight">Departure</div>
									</div>
									<div className="pl-2.5 justify-start items-center gap-2.5 inline-flex" />
									<div className="justify-center items-end gap-2 inline-flex">
										<div className="w-5 h-5 relative  overflow-hidden" />
										<div className="text-[#f7f7f7] text-sm font-normal font-['Manrope'] leading-tight">Denver International Airport</div>
									</div>
								</div>
								<div className="w-40 flex-col justify-start items-start gap-2 inline-flex">
									<div className="justify-center items-end gap-2 inline-flex">
										<div className="w-5 h-5 relative  overflow-hidden" />
										<div className="text-white text-sm font-normal font-['Manrope'] leading-tight">1 hour</div>
									</div>
									<div className="justify-center items-end gap-2 inline-flex">
										<div className="w-5 h-5 relative  overflow-hidden" />
										<div className="text-white text-sm font-normal font-['Manrope'] leading-tight">Rental</div>
									</div>
									<div className="justify-center items-end gap-2 inline-flex">
										<div className="w-5 h-5 relative  overflow-hidden" />
										<div className="text-white text-sm font-normal font-['Manrope'] leading-tight">-</div>
									</div>
								</div>
								<div className="flex-col justify-start items-start gap-2 inline-flex">
									<div className="flex-col justify-end items-center gap-2.5 flex">
										<div className="self-stretch justify-start items-center gap-0.5 inline-flex">
											<div className="text-white text-sm font-bold font-['Manrope'] leading-tight">Guide</div>
											<div className="w-4 h-4 relative  overflow-hidden" />
										</div>
									</div>
									<div className="justify-start items-start gap-0.5 inline-flex">
										<div className="text-[#bbd3fb] text-sm font-bold font-['Manrope'] leading-tight">Add</div>
										<div className="w-5 h-5 relative  overflow-hidden" />
									</div>
								</div>
							</div>
							<div className="flex-col justify-center items-end gap-0.5 inline-flex">
								<div className="text-[#f7f7f7] text-base font-bold font-['Manrope'] leading-normal">$0.00</div>
								<div className="text-[#b3b3b3] text-xs font-normal font-['Manrope'] leading-none">per person</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</section>

	);
}
