import React, { useState } from "react";
import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
} from "react-bootstrap";

import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import Link from "next/link";
import styles from "./NavSearch.module.css";




export default function NavSearch() {
  const [session, loading] = useSession();
  const { t } = useTranslation("common");

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <>

      <div className={styles.band2}>
        <Navbar expand="lg">
          <Navbar.Toggle aria-controls="navbar-light-example" />
          <Navbar.Collapse id="navbar-light-example">
            <Nav className={styles.nav}>

              {/* Professionals */}
              <NavDropdown
                className="navLink"
                title={<span className={styles.navLink}>{t("professionals")}</span>}
              >
                <Link href="/professional" passHref>
                  <NavDropdown.Item>{t("professionals")}</NavDropdown.Item>
                </Link>

                <Link href="/companies" passHref>
                  <NavDropdown.Item>{t("companies")}</NavDropdown.Item>
                </Link>

              </NavDropdown>

              {/* Products */}
              <Link href="/product" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("products")}</span>
                </Nav.Link>
              </Link>

              {/* Projects */}
              <Link href="/project" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("projects")}</span>
                </Nav.Link>
              </Link>

              {/* Magazine */}
              <Link href="/magazine" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("magazine")}</span>
                </Nav.Link>
              </Link>

              {/* About us */}
              <Link href="/about" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("about-us")}</span>
                </Nav.Link>
              </Link>

              {/* Contact */}
              <Link href="/contact" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("contact")}</span>
                </Nav.Link>
              </Link>

              {isRole("ROLE_ADMINISTRATOR") &&
                <NavDropdown
                  title={<span className={styles.navLink}>{t("administrator")}</span>}
                >
                  <Link href="/admin/company" passHref>
                    <NavDropdown.Item>{t("company")}</NavDropdown.Item>
                  </Link>

                  <Link href="/admin/professional" passHref>
                    <NavDropdown.Item>{t("professional")}</NavDropdown.Item>
                  </Link>

                  <Link href="/admin/product" passHref>
                    <NavDropdown.Item>{t("products")}</NavDropdown.Item>
                  </Link>

                  <Link href="/admin/building" passHref>
                    <NavDropdown.Item>{t("buildings")}</NavDropdown.Item>
                  </Link>

                </NavDropdown>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}
