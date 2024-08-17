import { MdCheckBox } from "react-icons/md"

type checkboxProps = {
    children: React.ReactNode;
    checked: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Checkbox({ children, checked, ...rest}: checkboxProps) {
    return (
        <div className="flex text-center gap-2 neutral-06">
            <MdCheckBox aria-checked={checked} className="justify-start"/>
            <span className="text-neutral-04 width-[212px] height-24px">
                {children}
            </span>
        </div>
    ) 
       
}