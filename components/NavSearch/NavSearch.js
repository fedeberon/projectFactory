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
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Authentication from "../Authentication";
import { useRouter } from "next/dist/client/router";
import { useTranslation } from "react-i18next";
import { signOut, useSession } from "next-auth/client";
import { PersonCircle, Search } from "react-bootstrap-icons";
import NavSearchStyles from "./NavSearch.module.css";

import RolProfile from "../RolProfile";

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

export default function NavSearch() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, loading] = useSession();

  const toggle = () => setDropdown((dropdown) => !dropdown);
  const toggle2 = () => setDropdownOpen((dropdownOpen) => !dropdownOpen);

  const { t, lang } = useTranslation("common");

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <Navbar color="light" light expand="lg">
      <Container fluid="xl">
        <Link href="/"> {t("Home")}</Link>
        <NavbarToggler onClick={toggle} />
        <Row className="w-100 justify-content-center align-items-center">
          <InputGroup className="w-50  d-flex">
            <Label for="exampleSearch" htmlFor="Search"></Label>
            <Input
              type="search"
              name="search"
              id="exampleSearch"
              placeholder="Buscar ideas/ profesionales"
            />
            <InputGroupAddon addonType="append">
              <InputGroupText className="h-100">
                <Search />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Row>
        <Collapse isOpen={dropdown} navbar>
          <Nav className="w-100" navbar>
            {isRole("ROLE_ADMINISTRATOR") && (
              <NavItem>
                <Link href="/admin">{t("Administrator")}</Link>
              </NavItem>
            )}
          </Nav>
          <Row className="justify-content-center align-items-center">
            <Col>
              <Dropdown isOpen={dropdownOpen} toggle={toggle2}>
                {session && (
                  <>
                    <DropdownToggle color="light" caret>
                      {session?.user?.name}
                      {!session.user.image ? (
                        <>
                          <PersonCircle className="ms-1" size={25} />
                        </>
                      ) : (
                        <>
                          <img
                            className={`${NavSearchStyles.imgProfile} rounded-circle mx-1 border`}
                            src={session.user.image}
                          />
                        </>
                      )}
                    </DropdownToggle>
                  </>
                )}
                <DropdownMenu right>
                  {isRole("ROLE_USER") && (
                    <>
                      <DropdownItem>
                        <Link href="/profile">{t("Profile")}</Link>
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
                        <Link href="/portfolio">{t("Portfolio")}</Link>
                      </DropdownItem>
                      <DropdownItem divider />
                    </>
                  )}
                  <DropdownItem>
                    {session && (
                      <NavLink onClick={() => signOut()}>
                        {t("Log out")}
                      </NavLink>
                    )}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          <Authentication className="mx-1" />
        </Collapse>
      </Container>
    </Navbar>
  );
}
