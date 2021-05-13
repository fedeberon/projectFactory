import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { useTranslation } from "react-i18next";


/**
 * Login and logout component when user wants to use Facebook or Instagram or Google account.
 * @returns template html with login and logout.
 */
const Authentication = () => {
  const [session, loading] = useSession();

  const { t, lang } = useTranslation("common");

  return (
    <>
      {!session && (
        <>
          <br />
          <button type="button" class="btn btn-primary" onClick={() => signIn()}>{t("Sign in")}</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
};



export default Authentication;
