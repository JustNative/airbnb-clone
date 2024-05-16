"use client"

import useCountries from "@/hooks/useCountries";
import { Listing, User } from "@prisma/client";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "./HeartButton";


interface ListingHeadProps {
    listing: Listing;
    currentUser?: User | null;

}

const ListingHead: React.FC<ListingHeadProps> = ({
    listing,
    currentUser
}) => {

    const { getByValue } = useCountries();

    const location = getByValue(listing.locationValue);

    return (
        <>
            <Heading
                title={listing.title}
                subtitle={`${location?.region}, ${location?.label}`}
            />

            <div className="relative w-full h-[60vh] overflow-hidden rounded-xl">
                <Image
                    alt="Image"
                    src={listing.imageSrc}
                    fill
                    className="object-cover w-full"
                />

                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={listing.id}
                        currentUser={currentUser}
                    />
                </div>
            </div>

        </>
    )
}

export default ListingHead