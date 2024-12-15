import { FaPlusMinus } from "react-icons/fa6";

export default function Chip() {
    return (
        <div className="flex text-center w-[124px] h-[40px] rounded-[200px] border-[1px] py-[12px] px-[8px] gap-[8px] translucent-black50">
            <FaPlusMinus className="border-[1.5px] neutral-06" />
            <span className="w-[36px] h-[24px] text-neutral-06">Chip</span>
            <FaPlusMinus className="border-[1.5px] neutral-06" />
        </div>
    )
}