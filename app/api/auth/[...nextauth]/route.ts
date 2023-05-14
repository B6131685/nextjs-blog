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
    async redirect(params: { url: string }) {
      const { url } = params

      // url is just a path, e.g.: /videos/pets
      if (!url.startsWith('http')) return url

      // If we have a callback use only its relative path
      const callbackUrl = new URL(url).searchParams.get('callbackUrl')
      if (!callbackUrl) return url

      return new URL(callbackUrl as string).pathname
    },
  },
});
export { handler as GET, handler as POST };