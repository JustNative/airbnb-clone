import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import prismaDB from "./libs/db";
import bcrypt from "bcryptjs"

export default {
    providers: [
        GitHub,
        Google({
            authorization: { params: { access_type: "offline", prompt: "consent" } }
        }),
        Credentials({
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            authorize: async (credentials) => {

                if (!credentials.email || !credentials.password) {
                    throw new Error("Invalid credentials")
                }

                const existUser = await prismaDB.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!existUser || !existUser.hashedPassword) {
                    throw new Error("User not found")
                }

                // check password using bcrypt
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    existUser.hashedPassword
                );

                if (!isValid) {
                    throw new Error('Incorrect password')
                }

                return existUser;
            },
        }),
    ],
    // callbacks: {
    //     async jwt({ token, account }) {
    //         if (account) {
    //             // Save the access token and refresh token in the JWT on the initial login, as well as the user details
    //             return {
    //                 access_token: account.access_token,
    //                 expires_at: account.expires_at,
    //                 refresh_token: account.refresh_token,
    //                 user: token,
    //             }
    //         } else if (Date.now() < token.expires_at * 1000) {
    //             // If the access token has not expired yet, return it
    //             return token
    //         } else {
    //             if (!token.refresh_token) throw new Error("Missing refresh token")

    //             // If the access token has expired, try to refresh it
    //             try {
    //                 // https://accounts.google.com/.well-known/openid-configuration
    //                 // We need the `token_endpoint`.
    //                 const response = await fetch("https://oauth2.googleapis.com/token", {
    //                     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //                     body: new URLSearchParams({
    //                         client_id: process.env.AUTH_GOOGLE_ID! as string,
    //                         client_secret: process.env.AUTH_GOOGLE_SECRET! as string,
    //                         grant_type: "refresh_token",
    //                         refresh_token: token.refresh_token as string,
    //                     }),
    //                     method: "POST",
    //                 })

    //                 const tokens = await response.json()

    //                 if (!response.ok) throw tokens

    //                 return {
    //                     ...token, // Keep the previous token properties
    //                     access_token: tokens.access_token,
    //                     expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
    //                     // Fall back to old refresh token, but note that
    //                     // many providers may only allow using a refresh token once.
    //                     refresh_token: tokens.refresh_token ?? token.refresh_token,
    //                 }
    //             } catch (error) {
    //                 console.error("Error refreshing access token", error)
    //                 // The error property will be used client-side to handle the refresh token error
    //                 return { ...token, error: "RefreshAccessTokenError" as const }
    //             }
    //         }
    //     },
    //     async session({ session, token }) {
    //         session.error = token.error
    //         return {
    //             ...session,
    //             ...token,
    //         }
    //     }
    // },
} satisfies NextAuthConfig