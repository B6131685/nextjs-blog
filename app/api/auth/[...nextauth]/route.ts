import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/libs/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      session.token = token
      session.user = user
      return session;
    },
    async redirect({ url, baseUrl }) {
      return process.env.NEXTAUTH_URL as string
    },
  },
});
export { handler as GET, handler as POST };