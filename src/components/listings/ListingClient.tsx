"use client"

import Container from "@/components/Container";
import ListingHead from "@/components/listings/ListingHead";
import { categories } from "@/components/navbar/Categories";
import { Listing, Reservation, User } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListingInfo from "./ListingInfo";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { onCreateReservationAction } from "@/actions/reservations";
import toast from "react-hot-toast";
import ListingReservation from "../reservation/ListingReservation";
import { Range } from "react-date-range";


const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    listing: Listing & {
        user: User | null,
        reservations: Reservation[]
    };
    currentUser?: User | null;
}


const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    currentUser
}) => {
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [isLoading, setIsLoading] = useState(false);

    const loginModal = useLoginModal();
    const router = useRouter();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        listing?.reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })

            dates = [...dates, ...range];
        });

        return dates;
    }, [listing?.reservations]);

    const onCreateReservation = useCallback(async () => {
        if (!currentUser) {
            loginModal.onOpen();
            return;
        }

        setIsLoading(true);

        try {

            if (!dateRange.startDate || !dateRange.endDate) {
                throw new Error('Please select a date range');
            }

            const createReservation = await onCreateReservationAction({
                listingId: listing.id,
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate!,
            })

            console.log("createReservation: ", createReservation);

            toast.success('Listing reserved!');

            setDateRange(initialDateRange);

            router.push('/trips');

        } catch (error: any) {
            // console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }

    }, [currentUser, dateRange, listing?.id, loginModal, router, totalPrice]);


    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                new Date(dateRange.endDate),
                new Date(dateRange.startDate)
            );

            if (dayCount && listing.price) {
                const totalPrice = dayCount * listing.price;
                setTotalPrice(totalPrice);
            } else {
                setTotalPrice(listing.price);
            }

        }
    }, [dateRange, listing.price]);

    const category = useMemo(() => {
        return categories.find((category) => category.label === listing.category);
    }, [listing.category]);


    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        listing={listing}
                        currentUser={currentUser}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                    <ListingInfo
                        listing={listing}
                        category={category}
                    />

                    <div className="order-first mb-10 md:order-last md:col-span-3">
                        <ListingReservation
                            price={listing.price}
                            dateRange={dateRange}
                            totalPrice={totalPrice}
                            onChangeDate={(value) => setDateRange(value)}
                            onSubmit={onCreateReservation}
                            disabled={isLoading}
                            disabledDates={disabledDates}
                        />

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient