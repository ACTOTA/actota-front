'use client';
import { useCallback, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import useLoginModal from "@/app/hooks/useLoginModal";
import useActivitiesModal from "@/app/hooks/useActivitiesModal";
import ActivitiesModal from "../modals/ActivitiesModal";

const Search = () => {

    const [search, setSearch] = useState(false);
    const activitiesModal = useActivitiesModal();
    const loginModal = useLoginModal();

    const handleClick = useCallback(() => {

        setSearch(!search);
        console.log("search: ", search);

        if(search) {
            activitiesModal.onOpen();
        }
    
    }, [search]); 
    

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
                    h-full
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
                <div onClick={activitiesModal.onOpen}
                    className="
                        hidden
                        bg-slate-300
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
                        <BiSearch onClick={() => console.log("clicked")} size={18}/>
                    </div>
                </div>
                <ActivitiesModal />
            </div>
        </div>
    );
}
export default Search;