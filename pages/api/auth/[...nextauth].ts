import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import pino from "pino";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/libs/mongodb";
import monogDBDriver from "@/libs/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    signIn({ user, account, profile, email, credentials }: any) {
      return true;
    },
    async session({ session, token, user }: any) {
      session.token = token
      session.user = user
      return session;
    },
  },
};

export default NextAuth(authOptions);
