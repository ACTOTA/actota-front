import Image from 'next/image';
import React, { useState } from 'react'

const LikeDislike = (liked: any) => {
    const [isLiked, setIsLiked] = useState(liked || false);
    return (
        <div>  <button
            onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
            }}
            className={`bg-[#05080D] rounded-full h-10 w-10 flex items-center justify-center ${isLiked ? "bg-[#C10B2F]" : ""}`}
        >
            <Image src={isLiked ? "/svg-icons/heart-filled.svg" : "/svg-icons/heart.svg"} alt="heart" height={20} width={20} />
        </button></div>
    )
}

export default LikeDislike