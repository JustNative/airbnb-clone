import { onGetListingById } from "@/actions/listings"
import EmptyState from "@/components/EmptyState";
import ListingClient from "@/components/listings/ListingClient";
import getCurrentUser from "@/libs/getCurrentUser";

const ListingPage = async ({
    params
}: {
    params: { listingId: string }
}) => {
    const listing = await onGetListingById(params.listingId);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return <EmptyState />
    }

    return (
        <ListingClient
            listing={listing}
            currentUser={currentUser}
        />
    )
}

export default ListingPage