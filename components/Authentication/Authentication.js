import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { NavLink, Button, Row, Col } from "react-bootstrap";
import AuthenticationStyle from "./Authentication.module.css";
import Link from "next/link";

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
            <Link href="/logIn">
              <Button
                className={`d-flex w-100 justify-content-center ${AuthenticationStyle.pLine} ${AuthenticationStyle.btnLogin} ${AuthenticationStyle.btn}`}
              >
                <img src="./svg/icon-user.svg"/>
                <span className={AuthenticationStyle.center}>{t("log-in")}</span>
              </Button>
            </Link>
          </Col>
          <Col>
            <Link href="/signIn">
              <Button className={`d-flex w-100 justify-content-center ${AuthenticationStyle.pLine} ${AuthenticationStyle.signInBtn} ${AuthenticationStyle.btn} mx-1`}>
                {t("common:sign-in")}
              </Button>
            </Link>
          </Col>
        </Col>
      )}
    </>
  );
};

export default Authentication;
