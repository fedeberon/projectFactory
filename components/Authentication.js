import React, { useState } from "react";
import { signIn, useSession } from "next-auth/client";
import { useTranslation } from "react-i18next";
import { NavLink, Button, Row, Col } from "reactstrap";
import { PersonCircle } from "react-bootstrap-icons";

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
          <Button
            onClick={() => signIn()}
            outline
            color="dark"
            className="d-flex"
          >
            <PersonCircle className="mx-1" size={25} />
            {t("Log in")}
          </Button>
          <Button className="mx-1" color="warning" href="/SignIn">
            {t("Sign in")}
          </Button>
        </>
      )}
    </>
  );
};

export default Authentication;
