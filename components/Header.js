import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Authentication from "./Authentication";
import { useRouter } from "next/dist/client/router";
import { useTranslation } from "react-i18next";

const Link = ({ children, href }) => {
  const router = useRouter();
  return (
    <NavLink
      href="#"
      onClick={(e) => {
        e.preventDefault();
        // typically you want to use `next/link` for this usecase
        // but this example shows how you can also access the router
        // and use it manually
        router.push(href);
      }}
    >
      {children}
    </NavLink>
  );
};

export default function Header() {
  const [dropdown, setDropdown] = useState(false);

  const toggle = () => setDropdown((dropdown) => !dropdown);

  const { t, lang } = useTranslation("common");

  return (
    <Navbar color="light" light expand="md">
      <Link href="/"> {t("Home")}</Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={dropdown} navbar>
        <Nav navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {t("Professional")}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link href="/professional">{t("Professional")}</Link>
              </DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {t("Project")}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link href="/project">{t("Project")}</Link>
              </DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {t("Magazine")}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link href="/magazine">{t("Magazine")}</Link>
              </DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <Link href="/about">{t("About Us")}</Link>
          </NavItem>
          <NavItem>
            <Link href="/contact">{t("Contact")}</Link>
          </NavItem>
        </Nav>
      </Collapse>
      <Authentication />
    </Navbar>
  );
}
