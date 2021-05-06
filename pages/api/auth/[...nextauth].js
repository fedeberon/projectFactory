import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { addUser } from "../../../services/userController";

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
      clientSecret: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  callbacks: {
    /**
     * @param  {object} user     User object
     * @param  {object} account  Provider account
     * @param  {object} profile  Provider profile
     * @return {boolean|string}  Return `true` to allow sign in
     *                           Return `false` to deny access
     *                           Return `string` to redirect to (eg.: "/unauthorized")
     */
    async signIn(user, account, profile) {
      //ir al back para crear el user o para hacer un update del user
      //ir al back y preguntar si existe si existe edit el campo lastlogin
      //
      const isAllowedToSignIn = true;
      // const newUser = await addUser("tomy","1234");
      // console.log(newUser);
      if (isAllowedToSignIn) {
        console.log("Entro bien");
        // console.log(user);
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },

    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    async jwt(token, user, account, profile, isNewUser) {
      // access token me lo dan los providers
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
        // token.accessToken es de la red social
        // token.ownerToken es nuestro
      }
      return token;
    },
  },

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
});
