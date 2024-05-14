"use server"

import prismaDB from "@/libs/db";
import getCurrentUser from "@/libs/getCurrentUser";


export const UserListingAction = async (data: any) => {
    try {

        const {
            category,
            location,
            guestCount,
            roomCount,
            bathroomCount,
            imageSrc,
            price,
            title,
            description
        } = data;

        const userAuth = await getCurrentUser();

        if (!userAuth) {
            // Not Authorized
            throw new Error("Not Authorized");
        }

        Object.keys(data).forEach((value: any) => {
            if (!data[value]) {
                throw new Error("Missing Data");
            }
        })

        const listing = await prismaDB.listing.create({
            data: {
                category,
                locationValue: location.value,
                guestCount,
                roomCount,
                bathroomCount,
                imageSrc,
                price: parseInt(price, 10),
                title,
                description,
                userId: userAuth.id
            }
        })

        return listing;

    } catch (error) {
        console.log(error);
        throw error;
    }
}