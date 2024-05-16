import { getAllFavoritesListings } from "@/actions/favorites";
import EmptyState from "@/components/EmptyState"
import FavoritesClient from "@/components/favorites/FavoritesClient";
import getCurrentUser from "@/libs/getCurrentUser";




const FavoritePage = async () => {
    const userAuth = await getCurrentUser();

    if (!userAuth) {
        return (
            <EmptyState
                title="Unauthorized"
                subtitle="Please login to see this page"
            />
        )
    }

    const favorites = await getAllFavoritesListings()

    if (!favorites.length) {
        return (
            <EmptyState
                title="No favorites found"
                subtitle="Looks like you have no favorites yet"
            />
        )
    }


    return (
        <FavoritesClient
            favorites={favorites}
            currentUser={userAuth}
        />
    )
}

export default FavoritePage