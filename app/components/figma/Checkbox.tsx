import { MdCheckBox } from "react-icons/md"

export default function Checkbox({ children, checked}: { children: React.ReactNode, checked: boolean}) {
    return (
        <div className="flex text-center gap-2 neutral-06">
            <MdCheckBox aria-checked={checked} className="justify-start"/>
            <span className="text-neutral-04 width-[212px] height-24px">
                {children}
            </span>
        </div>
    ) 
       
}