import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function Field({children, className}: {children: React.ReactNode; className?: string}) {
    return (    
        <div>
        <button className="rounded-[16px] border-[1px] top-[1327px] left-[217px] w-[536px] h-[56px] translucent-black30 neutral-03 p-[
0px, 16px, 0px, 16px] justify-between">
          {children}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </button>
      </div>
    )
}