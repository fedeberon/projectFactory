import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  Dropdown,
  Container,
} from "reactstrap";
import Authentication from "../Authentication/Authentication";
import { useRouter } from "next/dist/client/router";
import useTranslation from "next-translate/useTranslation";
import { signOut, useSession } from "next-auth/client";
import { PersonCircle } from "react-bootstrap-icons";
import Link from "next/link";
import Image from "next/image";

import RolProfile from "../RolProfile";
import HeaderStyle from "./Header.module.css";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, loading] = useSession();
  const { t } = useTranslation("common");

  const router = useRouter();

  const toggle = () => setDropdown((dropdown) => !dropdown);
  const toggle2 = () => setDropdownOpen((dropdownOpen) => !dropdownOpen);

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <Navbar color="light" light expand="lg">
      <Container fluid="xl p-0">
        <Link href="/">
          <NavLink className={`flex ml-4 ${HeaderStyle.pointer}`}>{t("header.home")}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={dropdown} navbar>
          <Nav className="w-100" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {t("professional")}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link href="/professional">
                    <NavLink>{t("professional")}</NavLink>
                  </Link>
                </DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {t("project")}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link href="/project">
                    <NavLink>{t("project")}</NavLink>
                  </Link>
                </DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {t("magazine")}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link href="/magazine">
                    <NavLink>{t("magazine")}</NavLink>
                  </Link>
                </DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Link href="/about">
              <NavLink className={`${HeaderStyle.pointer}`}>{t("about-us")}</NavLink>
            </Link>
            <Link href="/contact">
              <NavLink className={`${HeaderStyle.pointer}`}>{t("contact")}</NavLink>
            </Link>
            {isRole("ROLE_ADMINISTRATOR") && (
              <Link href="/admin">
                <NavLink className={`${HeaderStyle.pointer}`}>{t("administrator")}</NavLink>
              </Link>
            )}
          </Nav>
          <Row className="justify-content-center align-items-center">
            <Col>
              <Dropdown isOpen={dropdownOpen} toggle={toggle2}>
                {session && (
                  <>
                    <DropdownToggle color="light" caret>
                      {session?.user?.name}
                      <PersonCircle className="ms-1" size={25} />
                    </DropdownToggle>
                  </>
                )}
                <DropdownMenu right>
                  {isRole("ROLE_USER") && (
                    <>
                      <DropdownItem>
                        <Link href="/profile">
                          <NavLink>{t("header.profile")}</NavLink>
                        </Link>
                      </DropdownItem>
                      <DropdownItem divider />
                    </>
                  )}
                  <DropdownItem>
                    <RolProfile />
                  </DropdownItem>
                  <DropdownItem divider />
                  {isRole("ROLE_PROFESSIONAL") && (
                    <>
                      <DropdownItem>
                        <Link href="/portfolio">
                          <NavLink>{t("header.portfolio")}</NavLink>
                        </Link>
                      </DropdownItem>
                      <DropdownItem divider />
                    </>
                  )}
                  <DropdownItem>
                    {session && (
                      <>
                        <NavLink onClick={() => signOut()}>
                          {t("header.log-out")}
                        </NavLink>
                      </>
                    )}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          <Row className="row">
            <Col className="col-6">
              <Authentication />
            </Col>
          </Row>
          <Col className="d-flex col-auto g-2">
            {router.locales.map((locale, index) => (
              <Col key={locale} className="mx-1">
                <Link href={router.asPath} locale={locale}>
                  <div className={`${HeaderStyle.flag}`}>
                    <Image
                      src={`/flag_${index}.png`}
                      width={35}
                      height={35}
                      alt=""
                    />
                  </div>
                </Link>
              </Col>
            ))}
          </Col>
        </Collapse>
      </Container>
    </Navbar>
  );
}
