import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

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
};

export default NextAuth(authOptions);
