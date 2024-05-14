// export { auth as middleware } from "@/auth"

import NextAuth from "next-auth"
import authConfig from "./auth.config"
 
export const middleware = NextAuth(authConfig).auth