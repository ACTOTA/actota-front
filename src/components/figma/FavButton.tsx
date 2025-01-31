import { HeartIcon } from "@heroicons/react/20/solid";

export default function FavButton() {
    return (
        <button
        type="button"
        className="rounded-[32px] gap-[32px] border-[1px] p-[24px] w-[48px] h-[48px] glass-corner stroke-glass1 items-center"
      >
        <HeartIcon className="h-[24px] w-[24px]" />
      </button>
    )
  }