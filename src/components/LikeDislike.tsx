import Image from 'next/image';
import React, { useState } from 'react'
import { useAddFavorites, useRemoveFavorites } from '@/src/hooks/mutations/favorites.mutation';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
const LikeDislike = ({liked, favoriteId}: {liked: boolean, favoriteId: string}) => {
    const { mutate: addFavorites, isPending } = useAddFavorites();
    const { mutate: removeFavorites, isPending: isRemoving } = useRemoveFavorites();
    const queryClient = useQueryClient();
    const [isLiked, setIsLiked] = useState(liked ? true : false);

    const addToFavorites = async () => {

        if(isLiked){
            removeFavorites(
                favoriteId,
                {
                    onSuccess: (data: any) => {
                        toast.success("Removed from favorites");
                        queryClient.invalidateQueries({ queryKey: ['favorites'] });
                    }
                }
            );
        }else{
            addFavorites(
                favoriteId,
                {
                onSuccess: (data: any) => {
                    toast.success("Added to favorites");
                    queryClient.invalidateQueries({ queryKey: ['favorites'] });

                },
                onError: (error: any) => {
                    console.error('Login error:', error);
                }
            }
        );}
    };
    return (
        <div>  <button
            onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
                addToFavorites();
            }}
            className={`bg-[#05080D] rounded-full h-10 w-10 flex items-center justify-center ${isLiked ? "bg-[#C10B2F]" : ""}`}
        >
            <Image src={isLiked ? "/svg-icons/heart-filled.svg" : "/svg-icons/heart.svg"} alt="heart" height={20} width={20} />
        </button></div>
    )
}

export default LikeDislike