"use client"

import { onFavoriteListing } from "@/actions/favorites";
import useLoginModal from "@/hooks/useLoginModal";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";


interface HeartButtonProps {
    listingId: string;
    currentUser?: User | null
}

const HeartButton: React.FC<HeartButtonProps> = ({
    listingId,
    currentUser
}) => {
    const hasFavorited = currentUser?.favoriteIds.some((favoriteId) => favoriteId === listingId);
    const loginModal = useLoginModal();
    const router = useRouter();

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        try {

            if (!currentUser) {
                loginModal.onOpen();
                return;
            }

            const toggleFavorite = await onFavoriteListing(listingId);

            console.log("toggleFavorite: ", toggleFavorite)
            router.refresh();

            toast.success(toggleFavorite.message)

        } catch (error: any) {
            console.log("toggleFavorite error: ", error);
            toast.error(error.message)
        }

    }, [currentUser, listingId, loginModal, router])

    return (
        <div
            onClick={toggleFavorite}
            className="relative transition hover:opacity-80 hover:scale-110 cursor-pointer">
            <AiOutlineHeart
                size={28}
                className="fill-white absolute -top-[2px] -right-[2px]"
            />

            <AiFillHeart
                size={24}
                className={
                    hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
                }
            />
        </div>
    )
}

export default HeartButton