import { onGetListings } from "@/actions/listings";
import { onGetReservationAction } from "@/actions/reservations";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listings/ListingCard";
import getCurrentUser from "@/libs/getCurrentUser";

export default async function Home({ searchParams }: { searchParams: any }) {
  const userAuth = await getCurrentUser();
  const listings = await onGetListings(searchParams);
  const reservations = await onGetReservationAction({ userId: userAuth?.id });

  if (!listings.length) {
    return (
      <EmptyState showReset />
    )
  }

  return (
    <Container>
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={userAuth}
            reservation={reservations.find(reservation => reservation.listingId === listing.id)}
          />
        ))}
      </div>

    </Container>
  );
}
