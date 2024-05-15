"use server"

import prismaDB from "@/libs/db";
import getCurrentUser from "@/libs/getCurrentUser";

type CreateReservation = {
    listingId: string,
    totalPrice: number,
    startDate: Date,
    endDate: Date,
}

export const onCreateReservationAction = async (data: CreateReservation) => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        const addReservation = await prismaDB.reservation.create({
            data: {
                startDate: data.startDate,
                endDate: data.endDate,
                totalPrice: data.totalPrice,
                listingId: data.listingId,
                userId: userAuth.id
            }
        });

        return addReservation;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

type GetReservationType = {
    listingId?: string,
    authorId?: string,
    userId?: string
}

export const onGetReservationAction = async (data: GetReservationType) => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        const { listingId, authorId, userId } = data;

        const query: any = {}
        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (authorId) {
            query.Listing = { userId: authorId };
        }

        const reservation = await prismaDB.reservation.findMany({
            where: query,
            include: {
                Listing: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return reservation;

    } catch (error) {
        console.log(error);
        return [];
    }
}


export const onCancellReservationAction = async (reservationId: string) => {
    try {
        const userAuth = await getCurrentUser();

        if (!userAuth) {
            throw new Error("Not Authorized");
        }

        const existReservation = await prismaDB.reservation.findUnique({
            where: { id: reservationId }
        })

        if (!existReservation) {
            throw new Error("Reservation not found");
        }

        const cancelReservation = await prismaDB.reservation.deleteMany({
            where: {
                id: reservationId,
                OR: [
                    { userId: userAuth.id },
                    { Listing: { userId: userAuth.id } }
                ]
            }
        })

        return cancelReservation;

    } catch (error) {
        console.log(error);
        throw error;
    }
}