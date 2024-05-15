import useCountries from "@/hooks/useCountries";
import { Listing, User } from "@prisma/client";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Category = {
    label: string,
    icon: IconType,
    description: string
} | undefined;

interface ListingHeadProps {
    listing: Listing & {
        user: User | null
    };
    category: Category
}

const ListingInfo: React.FC<ListingHeadProps> = ({
    listing,
    category
}) => {

    const { getByValue } = useCountries();

    const coordinates = getByValue(listing.locationValue)?.latlng;


    return (
        <div className="flex flex-col col-span-4 gap-8">
            <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex items-center gap-2">
                    <div>
                        Hosted by {listing.user?.name}
                    </div>

                    <Avatar currentUser={listing.user} />
                </div>

                <div className="flex items-center gap-4 font-light text-neutral-500">
                    <div>
                        {listing.guestCount} guests
                    </div>

                    <div>
                        {listing.roomCount} rooms
                    </div>

                    <div>
                        {listing.bathroomCount} bathrooms
                    </div>
                </div>
            </div>

            <hr />

            {category && (
                <ListingCategory
                    category={category}
                />
            )}

            <hr />

            <div className="text-lg font-light text-neutral-500">
                {listing.description}
            </div>

            <Map center={coordinates} />

        </div>
    )
}

export default ListingInfo