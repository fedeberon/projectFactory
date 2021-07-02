import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { NavLink, Button, Row, Col } from "reactstrap";
import { PersonCircle } from "react-bootstrap-icons";
import AuthenticationStyle from "./Authentication.module.css";

/**
 * Login and logout component when user wants to use Facebook or Instagram or Google account.
 * @returns template html with login and logout.
 */
const Authentication = (props) => {
  const [session, loading] = useSession();
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const { t } = useTranslation("common");

  return (
    <>
      {!session && (
        <Col className="col d-flex">
          <Col>
            <Button
              onClick={() => signIn()}
              outline
              color="secondary"
              className={`d-flex ${AuthenticationStyle.pLine}`}
            >
              <PersonCircle className="mx-1" size={25} />
              {t("log-in")}
            </Button>
          </Col>
          <Col>
            <Button
              className={`d-flex ${AuthenticationStyle.pLine} mx-1`}
              color="warning"
              href="/SignIn"
            >
              {t("common:sign-in")}
            </Button>
          </Col>
        </Col>
      )}
    </>
  );
};

export default Authentication;
