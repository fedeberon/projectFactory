import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";


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
          <Button color="primary" onClick={() => signIn()}>{t("Sign in")}</Button>
        </>
      )}
      {session && (
        <>
          {t("Signed in as")} {session.user.email} <br />
          <Button color="primary" onClick={() => signOut()}>{t("Sign out")}</Button>
        </>
      )}
    </>
  );
};



export default Authentication;
