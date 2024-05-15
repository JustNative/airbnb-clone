"use client"

import useCountries from "@/hooks/useCountries";
import { Listing, Reservation, User } from "@prisma/client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import HeartButton from "./HeartButton";
import Button from "../Button";
import { format } from "date-fns";


interface ListingCardProps {
    data: Listing;
    currentUser?: User | null;
    reservation?: Reservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    currentUser,
    reservation,
    onAction,
    disabled,
    actionId = "",
    actionLabel
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (disabled) return console.log("handleCancel disabled");

        onAction?.(actionId);

    }, [onAction, actionId, disabled])

    const price = useMemo(() => {
        if (reservation) return reservation.totalPrice;

        return data.price;
    }, [reservation, data.price])

    const reservationDate = useMemo(() => {
        if (!reservation) return null;

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])

    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group">
            <div className="flex flex-col gap-2 w-full">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                    <Image
                        alt="Listing"
                        fill
                        className="object-cover h-full w-full group-hover:scale-110 transition"
                        src={data.imageSrc}
                    />

                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>

                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>

                <div className="flex items-center gap-1">
                    <div className="font-semibold">
                        $ {price}
                    </div>
                </div>

                {!reservation && (
                    <div className="font-light">
                        night
                    </div>
                )}

                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}

            </div>

        </div>
    )
}

export default ListingCard