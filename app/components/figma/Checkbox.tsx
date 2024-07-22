import { MdCheckBox } from "react-icons/md"

export default function Checkbox({ children}: { children: React.ReactNode}) {
    return (
        <div className="flex items-center gap-2 neutral-06">
            <MdCheckBox />
            <span className="text-neutral-04 width-[212px] height-24px">
                {children}
            </span>
        </div>
    ) 
       
}