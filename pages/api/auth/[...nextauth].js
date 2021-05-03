import NextAuth from "next-auth";
import Providers from "next-auth/providers";

/**
 * This implement is on site:
 * URL: https://next-auth.js.org/
 */
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    Providers.Instagram({
      clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET
    }),
    Providers.Facebook({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
});
