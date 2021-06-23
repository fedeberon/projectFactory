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
// import Authentication from "../Authentication/Authentication";

import useTranslation from "next-translate/useTranslation";
import { signOut, useSession } from "next-auth/client";
// import { PersonCircle } from "react-bootstrap-icons";
import Link from "next/link";

// import RolProfile from "../RolProfile";
import HeaderStyle from "./Header.module.css";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, loading] = useSession();
  const { t } = useTranslation("common");

  const toggle = () => setDropdown((dropdown) => !dropdown);
  const toggle2 = () => setDropdownOpen((dropdownOpen) => !dropdownOpen);

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    // <Navbar color="light" light expand="lg">
    //   <Container fluid="xl p-0">
    //     <Link href="/">
    //       <NavLink className={`flex ml-4 ${HeaderStyle.pointer}`}>{t("header.home")}</NavLink>
    //     </Link>
    <Navbar color="white" light expand="lg">
      <Container fluid="xl">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={dropdown} navbar>
          <Nav
            className="w-100 justify-content-center align-items-center"
            navbar
          >
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
              <NavLink className={`${HeaderStyle.pointer}`}>
                {t("about-us")}
              </NavLink>
            </Link>
            <Link href="/contact">
              <NavLink className={`${HeaderStyle.pointer}`}>
                {t("contact")}
              </NavLink>
            </Link>
            {isRole("ROLE_ADMINISTRATOR") && (
              <Link href="/admin">
                <NavLink className={`${HeaderStyle.pointer}`}>
                  {t("administrator")}
                </NavLink>
              </Link>
            )}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
