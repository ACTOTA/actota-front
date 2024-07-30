import { MdCheckBox } from "react-icons/md"

export default function Checkbox({ children, checked}: { children: React.ReactNode, checked: boolean}) {
    return (
        <div className="flex items-center gap-2 neutral-06">
            <MdCheckBox aria-checked={checked} />
            <span className="text-neutral-04 width-[212px] height-24px">
                {children}
            </span>
        </div>
    ) 
       
}