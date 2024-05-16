// import { onGetListingByUserId } from "@/actions/listings";
import { onGetListings } from "@/actions/listings";
import EmptyState from "@/components/EmptyState";
import PropertiesClient from "@/components/properties/PropertiesClient";
import getCurrentUser from "@/libs/getCurrentUser";



const PropertiePage = async () => {
    const userAuth = await getCurrentUser();

    if (!userAuth) {
        return <EmptyState
            title="Anauthorized"
            subtitle="Please login"
        />
    }

    const properties = await onGetListings({ userId: userAuth.id })

    if (!properties.length) {
        return <EmptyState
            title="No properties"
            subtitle="You have no properties yet"
        />
    }


    return (
        <PropertiesClient
            currentUser={userAuth}
            properties={properties}
        />
    )
}

export default PropertiePage