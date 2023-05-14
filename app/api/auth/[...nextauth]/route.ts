import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/libs/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      session.token = token
      session.user = user
      return session;
    },
  },
});
export { handler as GET, handler as POST };