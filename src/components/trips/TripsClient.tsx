"use client"

import { Listing, Reservation, User } from "@prisma/client";
import Container from "../Container";
import Heading from "../Heading";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { onCancellReservationAction } from "@/actions/reservations";
import ListingCard from "../listings/ListingCard";


interface TripsClientProps {
    currentUser: User | null;
    reservations: (Reservation & { Listing: Listing })[];
}

const TripsClient: React.FC<TripsClientProps> = ({
    currentUser,
    reservations
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');


    const onCancel = useCallback(async (id: string) => {
        setDeletingId(id);

        try {
            const deleteReservation = await onCancellReservationAction(id);
            
            console.log("deleteReservation: ", deleteReservation)

            toast.success('Reservation cancelled');

            router.refresh();

        } catch (error: any) {
            // console.log(error);
            toast.error(error.message)
        } finally {
            setDeletingId('');
        }

    }, [router])

    return (
        <Container >
            <Heading
                title="Trips"
                subtitle="Where you've been and where you're going"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-10 gap-8">
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        reservation={reservation}
                        currentUser={currentUser}
                        data={reservation.Listing}
                        actionLabel="Cancel Reservation"
                        disabled={deletingId === reservation.id}
                        actionId={reservation.id}
                        onAction={onCancel}
                    />
                ))}
            </div>
        </Container>
    )
}

export default TripsClient