import { Listing, User } from "@prisma/client"
import Container from "../Container"
import Heading from "../Heading"
import ListingCard from "../listings/ListingCard"



interface FavoritesClientProps {
    favorites: Listing[]
    currentUser: User | null
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
    favorites,
    currentUser
}) => {
    return (
        <Container>
            <Heading
                title="Favorites"
                subtitle="List of places you have favorited!"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-10 gap-8">
                {favorites.map((favorite) => (
                    <ListingCard
                        key={favorite.id}
                        currentUser={currentUser}
                        data={favorite}
                    />
                ))}
            </div>

        </Container>
    )
}

export default FavoritesClient