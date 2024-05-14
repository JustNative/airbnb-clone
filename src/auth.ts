import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { PrismaAdapter } from "@auth/prisma-adapter"
import prismaDB from "./libs/db"
import { Adapter } from "next-auth/adapters"


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prismaDB) as Adapter,
    session: { strategy: "jwt" },
    debug: process.env.NODE_ENV === "development",
    pages: {
        signIn: "/",
        signOut: "/",
        error: "/error",
    },
    ...authConfig,
})