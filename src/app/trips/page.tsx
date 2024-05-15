import { onGetReservationAction } from "@/actions/reservations";
import EmptyState from "@/components/EmptyState";
import TripsClient from "@/components/trips/TripsClient";
import getCurrentUser from "@/libs/getCurrentUser"




const TripsPage = async () => {
    const userAuth = await getCurrentUser();

    if (!userAuth) {
        return <EmptyState
            title="Anauthorized"
            subtitle="Please login"
        />
    }

    const reservations = await onGetReservationAction({ userId: userAuth.id })

    if (!reservations.length) {
        return <EmptyState
            title="No trips"
            subtitle="You have no trips yet"
        />
    }

    return (
        <TripsClient
            currentUser={userAuth}
            reservations={reservations}
        />
    )
}

export default TripsPage