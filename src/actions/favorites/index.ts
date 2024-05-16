"use server"

import prismaDB from "@/libs/db";
import getCurrentUser from "@/libs/getCurrentUser";

export const onFavoriteListing = async (listingId: string) => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        const existFavorite = userAuth.favoriteIds.some((favoriteId) => favoriteId === listingId);

        if (existFavorite) {
            const updatedUser = await prismaDB.user.update({
                where: {
                    id: userAuth.id
                },
                data: {
                    favoriteIds: userAuth.favoriteIds.filter((favoriteId) => favoriteId !== listingId)
                }
            });

            updatedUser.hashedPassword = '';
            return {
                message: "Unfavorited Successfully",
                updatedUser
            };

        } else {
            const updatedUser = await prismaDB.user.update({
                where: {
                    id: userAuth.id
                },
                data: {
                    favoriteIds: {
                        push: listingId
                    }
                }
            });

            updatedUser.hashedPassword = '';

            return {
                message: "Favorited Successfully",
                updatedUser
            }
        }

    } catch (error) {
        // // console.log(error);
        throw error;
    }
}


export const onDeleteListing = async (listingId: string) => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        const existListing = await prismaDB.listing.findUnique({
            where: { id: listingId },
            include: {
                user: true
            }
        });

        if (!existListing) {
            throw new Error("Listing not found");
        }

        const checkOwnerListing = existListing.user.id === userAuth.id;

        if (!checkOwnerListing) {
            throw new Error("Not Authorized");
        }

        const deletedListing = await prismaDB.listing.delete({
            where: { id: listingId }
        })

        return deletedListing;

    } catch (error) {
        // // console.log(error);
        throw error;
    }
}

export const getAllFavoritesListings = async () => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        const favorites = await prismaDB.listing.findMany({
            where: {
                id: {
                    in: [...(userAuth.favoriteIds || [])]
                }
            }
        })

        return favorites;

    } catch (error) {
        // // console.log(error);
        throw error;
    }
}