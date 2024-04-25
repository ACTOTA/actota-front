'use client';
import { BiSearch } from "react-icons/bi";

const Search = () => {
    return (  
        <div
            className="
                boarder-[1px]
                w-full
                md:w-auto
                py-2
                rounded-full
                shadow-sm
                hover:shadow-md
                transistion
                cursor-pointer
            "
        >
            <div
                className="
                    flex
                    flex-row
                    items-center
                    justify-between

                "
                >
                <div
                className="
                    text-sm
                    font-semibold
                    px-6
                "
                >
                Denver, CO
                </div>
                <div
                className="
                    hidden
                    sm:block
                    text-sm
                    font-semibold
                    px-6
                    border-x-[1px]
                    flex-1
                    text-center
                "
                >
                Any Week
                </div>
                <div
                    className="
                        hidden
                        sm:block
                        text-sm
                        text-black-600
                        font-semibold
                        px-6
                        border-r-[1px]
                        flex-1
                        text-center
                    "
                >
                Any Activities
                </div>
                <div
                className="
                    hidden
                    sm:block
                    text-sm
                    font-semibold
                    px-6
                    border-r-[1px]
                    flex-1
                    text-center
                "
                >
                Any Type
                </div>
                <div
                    className="
                    text-sm
                    pl-6
                    pr-2
                    text-gray-600
                    flex
                    flex-row
                    items-center
                    gap-3
                "
                >

                
                <div className="hidden sm:block">
                Add Guests
                </div>
                    <div
                        className="
                        p-2
                        bg-logo-blue
                        rounded-full
                        text-white
                        "
                    >
                        <BiSearch size={18}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Search;