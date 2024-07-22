import { MdCheckBox } from "react-icons/md"

export default function Checkbox({ children}: { children: React.ReactNode}) {
    return (
        <div className="flex items-center gap-2">
            <MdCheckBox />
            {children}
        </div>
    ) 
       
}