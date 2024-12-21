import { FeaturedVacation } from '@/db/models/itinerary';
import React from 'react';


interface DayViewProps {
	listing: FeaturedVacation;
}

export default function DayView({ listing }: DayViewProps) {


	return (
		<section className='h-full w-full'>
			<div className="h-12 px-8 justify-start items-center gap-4 inline-flex">
				<div className="text-white text-xl font-bold font-['Manrope'] leading-7">Day</div>
				<div className="p-1 bg-black/50 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] border border-[#dedede] backdrop-blur-xl justify-start items-center flex">
					<div className="h-10 px-4 py-2 bg-black/20 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] border border-white backdrop-blur-xl justify-center items-center gap-2.5 flex">
						<div className="text-white text-base font-normal font-['Manrope'] leading-normal">1</div>
					</div>
					<div className="h-10 px-4 py-2 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] backdrop-blur-xl justify-center items-center gap-2.5 flex">
						<div className="text-[#b3b3b3] text-base font-normal font-['Manrope'] leading-normal">2</div>
					</div>
					<div className="h-10 px-4 py-2 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] backdrop-blur-xl justify-center items-center gap-2.5 flex">
						<div className="text-[#b3b3b3] text-base font-normal font-['Manrope'] leading-normal">3</div>
					</div>
					<div className="h-10 px-4 py-2 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] backdrop-blur-xl justify-center items-center gap-2.5 flex">
						<div className="text-[#b3b3b3] text-base font-normal font-['Manrope'] leading-normal">4</div>
					</div>
					<div className="h-10 px-4 py-2 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] backdrop-blur-xl justify-center items-center gap-2.5 flex">
						<div className="text-[#b3b3b3] text-base font-normal font-['Manrope'] leading-normal">5</div>
					</div>
					<div className="h-10 px-4 py-2 rounded-[200px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] backdrop-blur-xl justify-center items-center gap-2.5 flex">
						<div className="text-[#b3b3b3] text-base font-normal font-['Manrope'] leading-normal">6</div>
					</div>
				</div>
			</div>
		</section>

	);
}
