import { ChevronDownIcon } from "@heroicons/react/20/solid";

type ItineraryDropdownProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function ItineraryDropdown({ children, className, ...rest }: ItineraryDropdownProps) {
    return (
        <button className={`rounded-[8px] h-[56px] translucent-black-30 glass-corner neutral-03 px-4 text-md
            stroke-glass-01 before:rounded-[8px] border-none flex justify-between items-center ${className}`} {...rest}>
            <div className="flex gap-6 text-neutral-04">
                {children}
            </div>
            <ChevronDownIcon aria-hidden="true" className="h-[24px] w-[24px]" />
        </button>
    )
}
