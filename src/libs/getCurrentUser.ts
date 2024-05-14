import { auth } from "@/auth";
import prismaDB from "./db";


export default async function getCurrentUser() {
    try {
        const userAuth = await auth();

        if (!userAuth?.user?.email) return null

        const currentUser = await prismaDB.user.findUnique({
            where: { email: userAuth.user.email }
        })

        if (!currentUser) {
            return null;
        }

        if (currentUser.hashedPassword) {
            currentUser.hashedPassword = '';
        }


        return currentUser;

    } catch (error) {
        console.log('Error on get current user');
        return null;
    }
}