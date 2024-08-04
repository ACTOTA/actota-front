import { RiMapPinLine } from 'react-icons/ri';

export default function Dropdownmenu() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-[226px] h-[44px] gap-[12px] rounded-[8px] top-[124px] left-[40px] flex py-[12px] px-[0px]">
                <RiMapPinLine className='border-[1.25px] border-neutral-06'/>
                <span className="text-neutral-05 w-[170px] h-[20px] text-center">Dropdown</span>
            </div>
        </div>
    )
}