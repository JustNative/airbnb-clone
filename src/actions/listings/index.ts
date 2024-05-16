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
        // // console.log(error);
        throw error;
    }
}

type ListingParams = {
    userId?: string,
    guestCount?: number,
    roomCount?: number,
    bathroomCount?: number,
    startDate?: string,
    endDate?: string,
    locationValue?: string,
    category?: string
}

export const onGetListings = async (params: ListingParams) => {

    try {

        const {
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        if (guestCount) {
            query.guestCount = {
                gte: +guestCount
            };
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount
            };
        }

        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            };
        }

        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: endDate }
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { lte: endDate }
                            }
                        ]
                    }
                }
            }
        }

        const listing = await prismaDB.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!listing) return [];

        return listing;

    } catch (error) {
        // console.log(error);
        return [];
    }

}

export const onGetListingById = async (listingId: string) => {
    try {
        const listing = await prismaDB.listing.findUnique({
            where: { id: listingId },
            include: {
                user: true,
                reservations: true
            }
        })

        if (!listing) return null;

        if (listing?.user) {
            listing.user.hashedPassword = ''
        }

        return listing;
    } catch (error) {
        // console.log(error);
        return null;
    }
}

export const onCancellPropertyAction = async (propertyId: string) => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        // const property = await prismaDB.listing.delete({
        //     where: {
        //         id: propertyId,
        //         OR: [
        //             { userId: userAuth.id },
        //         ]
        //     }
        // })

        const property = await prismaDB.listing.deleteMany({
            where: {
                id: propertyId,
                userId: userAuth.id
            }
        })

        if (!property) {
            throw new Error("Property not found");
        }

        return property;


    } catch (error) {
        // console.log(error);
        throw error;
    }
}