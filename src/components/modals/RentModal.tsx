"use client"

import { useMemo, useState } from "react";
import Modal from "./Modal"
import useRentModal from "@/hooks/useRentModal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserListingAction } from "@/actions/listings";


enum STEPS {
    CATECORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal();
    const [step, setStep] = useState<number>(STEPS.CATECORY);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');


    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }


    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {

            if (step !== STEPS.PRICE) return onNext();

            const createListing = await UserListingAction(data);

            toast.success("Listing Created!");

            router.refresh();

            reset();
            setStep(STEPS.CATECORY);

            rentModal.onClose();
        } catch (error: any) {
            // console.log(error);
            toast.error(error.message)
        }

    }


    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create'
        }

        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATECORY) {
            return undefined
        }

        return 'Back'
    }, [step]);


    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div
                        key={item.label}
                        className="col-span-1">
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>

        </div>
    )


    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Where is your place located?"
                    subtitle="Help guests find you?"
                />

                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)} />

                <Map center={location?.latlng} />

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
                    onChange={(value) => setCustomValue('guestCount', value)}
                    value={guestCount}
                />

                <hr />

                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    onChange={(value) => setCustomValue('roomCount', value)}
                    value={roomCount}
                />

                <hr />

                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                    value={bathroomCount}
                />

            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some images of your place?"
                    subtitle="Show guests what your place looks like!"
                />

                <ImageUpload
                    onChange={(value) => setCustomValue('imageSrc', value)}
                    value={imageSrc}
                />

            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you descibe your place?"
                    subtitle="Short and sweet works best!"
                />

                <Input
                    id="title"
                    label="Title"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    required
                />

                <hr />

                <Input
                    id="description"
                    label="Description"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    required
                />

            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How much would you like to charge per night?"
                    subtitle="This is the price that guests will see when they book your place."
                />
                <Input
                    id="price"
                    label="Price"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    type="number"
                    required
                    formatPrice
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            title="Airbnb your home!"
            actionLabel={actionLabel}
            secondaryActionlabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATECORY ? undefined : onBack}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
        />
    )
}

export default RentModal