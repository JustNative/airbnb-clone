"use client"


import React, { useCallback, useMemo, useState } from 'react'
import Modal from './Modal'
import useSearchModal from '@/hooks/useSearchModal'
import { useRouter, useSearchParams } from 'next/navigation'
import { Range } from 'react-date-range'
import dynamic from 'next/dynamic'
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect'
import qs from 'query-string'
import { formatISO } from 'date-fns'
import Heading from '../Heading'
import Counter from '../inputs/Counter'
import Calendar from '../reservation/Calendar'

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('@/components/Map'), { ssr: false }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1)
    }, [setStep]);

    const onNext = useCallback(() => {
        setStep((value) => value + 1)
    }, [setStep]);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) return onNext();

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updateQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        }

        if (dateRange.startDate) {
            updateQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updateQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updateQuery
        }, { skipNull: true });

        setStep(STEPS.LOCATION);

        searchModal.onClose();

        router.push(url);

    }, [bathroomCount, dateRange, guestCount, onNext, params, roomCount, step, location?.value, router, searchModal]);


    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='Where do you wanna go?'
                subtitle='Find the perfect location!'
            />

            <CountrySelect
                value={location}
                onChange={(value) => setLocation(value)} />

            <hr />

            <Map
                center={location?.latlng}
            />
        </div>
    )


    if (step === STEPS.DATE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='When do you wanna go?'
                    subtitle='Find the perfect date!'
                />

                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />


            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place?"
                    subtitle="What amenities do you have?"
                />

                <Counter
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    onChange={(value) => setGuestCount(value)}
                    value={guestCount}
                />

                <hr />

                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    onChange={(value) => setRoomCount(value)}
                    value={roomCount}
                />

                <hr />

                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    onChange={(value) => setBathroomCount(value)}
                    value={bathroomCount}
                />

            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            title='Filters'
            actionLabel={actionLabel}
            onSubmit={onSubmit}
            secondaryActionlabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default SearchModal