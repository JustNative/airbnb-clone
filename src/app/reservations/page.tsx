import { onGetReservationAction } from "@/actions/reservations";
import EmptyState from "@/components/EmptyState";
import ReservationsClient from "@/components/reservation/ReservationsClient";
import getCurrentUser from "@/libs/getCurrentUser"



const ReservationPage = async () => {
    const userAuth = await getCurrentUser();

    if (!userAuth) {
        return (
            <EmptyState
                title="Unauthorized"
                subtitle="Please login to see this page"
            />
        )
    }

    const reservations = await onGetReservationAction({
        userId: userAuth?.id
    })

    if (!reservations.length) {
        return (
            <EmptyState
                title="No reservations found"
                subtitle="Looks like you have no reservations on your properties"
            />
        )
    }


    return (
        <ReservationsClient
            reservations={reservations}
            currentUser={userAuth}
        />
    )
}

export default ReservationPage