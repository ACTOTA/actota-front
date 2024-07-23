import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function ItineraryDropdown({ children }: { children: React.ReactNode }) {
    return (
        <button className="rounded-[16px] border-[1px] w-[200px] h-[56px] glass-corner neutral-03 p-[
            0px, 16px, 0px, 16px] justify-between">
            {children}
            <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px] rotate-180" />
        </button>
    )
}