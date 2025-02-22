
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import postgres from 'postgres';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./server/db";
import CredentialProvider from "next-auth/providers/credentials";
import { env } from "./env";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//     return user[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/',
  },
  debug: env.NODE_ENV === 'development',
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
})