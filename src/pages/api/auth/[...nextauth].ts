import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "../../../app/lib/mongodb";

const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("GITHUB_ID and GITHUB_SECRET must be defined");
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user, token }: any): Promise<any> {
      return { session, user, token };
    },
  },
};

export default NextAuth(authOptions);
