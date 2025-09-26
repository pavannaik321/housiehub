// import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
// import GithubProvider from "next-auth/providers/github"

// const handler =  NextAuth({
//   providers: [
//     // OAuth authentication providers...
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET
//     }),
//     // // Passwordless / email sign in
//     // EmailProvider({
//     //   server: process.env.MAIL_SERVER,
//     //   from: 'NextAuth.js <no-reply@example.com>'
//     // }),
//   ]
// })

// export {handler as GET , handler as POST}



















import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../../../lib/prismadb"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        // enforce email verification
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in")
        }

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: { strategy: "database" }, // adapter present → database sessions (you may set explicitly)
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
