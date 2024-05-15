"use client"


import { useRouter } from 'next/navigation';
import Container from '../Container'
import Heading from '../Heading'
import { Listing, Reservation, User } from '@prisma/client'
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { onCancellReservationAction } from '@/actions/reservations';
import ListingCard from '../listings/ListingCard';

interface ReservationsClientProps {
    reservations: (Reservation & {
        Listing: Listing
    })[];
    currentUser?: User | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback(async (reservationId: string) => {
        setDeletingId(reservationId);

        try {

            const cancelReservation = await onCancellReservationAction(reservationId);

            console.log("cancelReservation: ", cancelReservation)

            toast.success('Reservation cancelled');
            router.refresh();

        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        } finally {
            setDeletingId('');
        }

    }, [router]);



    return (
        <Container>
            <Heading
                title="Reservations"
                subtitle="Bookings on your properties"
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

export default ReservationsClient