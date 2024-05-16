"use server"

import prismaDB from "@/libs/db";
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"


export const UserRegistrationAction = async (
    name: string,
    email: string,
    password: string,
) => {
    try {

        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }

        const existUser = await prismaDB.user.findUnique({
            where: { email }
        })

        if (existUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const createUser = await prismaDB.user.create({
            data: {
                name,
                email,
                hashedPassword
            }
        })

        createUser.hashedPassword = ''

        return createUser;

    } catch (error) {
        // console.log(`Error on user registration ${email}: ${error}`);
        throw error;
    }
}


export const onLoginUser = async (
    email: string,
    password: string,
) => {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false
        })

    } catch (error) {
        throw new Error('Wrong credentials')
    }
}


export const onSignInGoogleUser = async () => {
    await signIn("google")
}

export const onSignInGithubUser = async () => {
    await signIn("github")
}

export const onSignOutUser = async () => {
    try {
        await signOut();

        // const cookie = cookies();
        // cookie.has('authjs.session-token') && cookie.delete('authjs.session-token')

    } catch (error) {
        throw new Error('Wrong credentials')
    }
}