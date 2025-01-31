import { HomeIcon } from "@heroicons/react/24/outline";


export default function Theme({children}: {children: React.ReactNode}) {
    return (
        <div className="flex items-center w-[150px] h-[108px] rounded-[16px] p-[24px] gap-[4px]">
            <HomeIcon  className="w-[24px] h-[24.98px] top-[3.02px] left-[4px] border-[2px] " />
            {children}
        </div>
    )
}