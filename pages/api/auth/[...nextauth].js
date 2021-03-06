import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { signInCallBack } from "../../../services/userService";
import jwt_decode from "jwt-decode";
import * as professionalService from "../../../services/professionalService";

const PREFIX = "Bearer ";
const AUTHORITIES = "authorities";
const ID = "jti";
const USERNAME = "sub";
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
    Providers.Credentials({
      name: "credentials",
      async authorize(credentials) {
        return credentials;
      },
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
      if (account.provider === "instagram") {
        user.email = `${profile.username}@gmail.com`;
      }

      if (account.type != "credentials") {
        const token = await signInCallBack(user, account, profile);
        user.token = token;
        return !!token;
      } else {
        user.token = user.accessToken;
        return user.accessToken;
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
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken;
      const tokenWithoutPrefix = token.accessToken.split(PREFIX)[1];
      const payload = jwt_decode(tokenWithoutPrefix);
      session.authorities = payload[AUTHORITIES];
      session.user.id = payload[ID];
      session.user.username = payload[USERNAME];
      const userRole = await whoIAm(session, token);
      session.user.image = userRole.previewImage;
      session.user.category = userRole.category;
      session.user.phoneNumber = userRole.phoneNumber;
      session.user.categoryCompany = userRole.categoryCompany;
      session.user.contactLoad = userRole.contactLoad;
      session.user.website = userRole.website;
      session.user.company = userRole.company;
      return session;
    },
  },

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
});

/**
 * Discribe what role has the user, but if this is it a professional
 * needed change imageProfile because the imageProfile is not mandatory
 * in formulary become professional.
 */
const whoIAm = async (session, token) => {
  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  if (session) {
    if (isRole("ROLE_PROFESSIONAL")) {
      const professional = await professionalService.getById(
        session.user.id,
        token.accessToken
      );
      return professional;
    } else if (isRole("ROLE_COMPANY")) {
      // TODO here change imageProfile is you need
    } else if (isRole("ROLE_USER")) {
      // TODO here change imageProfile is you need
    }
  }
  return "";
};
