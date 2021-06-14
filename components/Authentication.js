import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { useTranslation } from "react-i18next";
import {
  NavLink,
} from "reactstrap";

/**
 * Login and logout component when user wants to use Facebook or Instagram or Google account.
 * @returns template html with login and logout.
 */
const Authentication = (props) => {
  const [session, loading] = useSession();
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const { t, lang } = useTranslation("common");

  return (
    <>
      {!session && (
        <>
          <NavLink onClick={() => signIn()}>
            {t("Log in")}
          </NavLink>
        </>
      )}
      {session && (
        <>
          <NavLink onClick={() => signOut()}>
            {t("Log out")}
          </NavLink>
        </>
      )}
    </>
  );
};

export default Authentication;
