import { DivIcon } from "leaflet"
import { BiSearch } from "react-icons/bi"

export default function Search({children}: {children: React.ReactNode}) {
    return (
        <div className="w-[687px] h-[96px] rounded-[200px] border-[1px] gap-[16px] p-[0px, 16px, 0px, 0px]  flex items-center">
            {children}
            
            <div className="rounded-[32px] gap-[32px] p-[24px] w-[64px] h-[64px]  flex justify-start">
                <BiSearch className="w-[24px] h-[24px] " />
            </div>
        </div>
    )
}