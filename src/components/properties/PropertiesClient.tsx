"use client"

import { Listing, User } from "@prisma/client";
import Container from "../Container";
import Heading from "../Heading";
import ListingCard from "../listings/ListingCard";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { onCancellPropertyAction } from "@/actions/listings";


interface PropertiesClientProps {
    currentUser: User | null;
    properties: Listing[];
}


const PropertiesClient: React.FC<PropertiesClientProps> = ({
    currentUser,
    properties
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');


    const onCancel = useCallback(async (id: string) => {
        setDeletingId(id);

        try {
            const cancelProperty = await onCancellPropertyAction(id);
            
            console.log("cancelProperty: ", cancelProperty)

            toast.success('Property cancelled');

            router.refresh();

        } catch (error: any) {
            // console.log(error);
            toast.error(error.message)
        } finally {
            setDeletingId('');
        }

    }, [router])


    return (
        <Container >
            <Heading
                title="Properties"
                subtitle="Listings for rent"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-10 gap-8">
                {properties.map((propertie) => (
                    <ListingCard
                    key={propertie.id}
                    currentUser={currentUser}
                    data={propertie}
                    actionLabel="Cancel property"
                    disabled={deletingId === propertie.id}
                    actionId={propertie.id}
                    onAction={onCancel}
                    />
                ))}
            </div>
        </Container>
    )
}

export default PropertiesClient