import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
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
import Authentication from "./Authentication";
import { useRouter } from "next/dist/client/router";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
import { PersonCircle } from "react-bootstrap-icons";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, loading] = useSession();

  const toggle = () => setDropdown((dropdown) => !dropdown);
  const toggle2 = () => setDropdownOpen((dropdownOpen) => !dropdownOpen);

  const { t, lang } = useTranslation("common");

  return (
    <Navbar color="light" light expand="lg">
      <Container fluid="xl">
        <Link href="/"> {t("Home")}</Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={dropdown} navbar>
          <Nav className="w-100" navbar>
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
              <Link href="/about">{t("AboutUs")}</Link>
            </NavItem>
            <NavItem>
              <Link href="/contact">{t("Contact")}</Link>
            </NavItem>
          </Nav>
          <Row className="justify-content-center align-items-center">
            <Col>
              <Dropdown isOpen={dropdownOpen} toggle={toggle2}>
                <DropdownToggle color="light" caret>
                  {session?.user?.name}
                  <PersonCircle className="ms-1" size={25} />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <Link href="/profile">{t("Profile")}</Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <Authentication />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </Collapse>
      </Container>
    </Navbar>
  );
}
