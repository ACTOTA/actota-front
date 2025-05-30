import Image from 'next/image';
import React, { useState } from 'react'
import { useAddFavorites, useRemoveFavorites } from '@/src/hooks/mutations/favorites.mutation';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
const LikeDislike = ({liked, favoriteId, className}: {liked: boolean, favoriteId: string, className?: string}) => {
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
        <button
            onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
                addToFavorites();
            }}
            className={`${className} w-9 h-9 rounded-full flex items-center justify-center transition-all
                       ${isLiked ? "bg-red-600 hover:bg-red-700" : "bg-black/60 backdrop-blur-md hover:bg-black/80"}`}
            disabled={isPending || isRemoving}
        >
            <Image 
                src={isLiked ? "/svg-icons/heart-filled.svg" : "/svg-icons/heart.svg"} 
                alt="heart" 
                height={18} 
                width={18}
                className={isPending || isRemoving ? "opacity-50" : ""}
            />
        </button>
    )
}

export default LikeDislike