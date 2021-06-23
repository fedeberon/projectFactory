import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  Dropdown,
  Container,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Authentication from "../Authentication/Authentication";
import { useRouter } from "next/dist/client/router";
import useTranslation from "next-translate/useTranslation";
import { signOut, useSession } from "next-auth/client";
import { PersonCircle, Search } from "react-bootstrap-icons";
import NavSearchStyles from "./NavSearch.module.css";
import Link from "next/link";
import Image from "next/image";

import RolProfile from "../RolProfile";

export default function NavSearch() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, loading] = useSession();

  const router = useRouter();

  const toggle = () => setDropdown((dropdown) => !dropdown);
  const toggle2 = () => setDropdownOpen((dropdownOpen) => !dropdownOpen);

  const { t } = useTranslation("common");

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <Navbar color="light" light expand="lg">
      <Container fluid="xl">
        <Link href="/">
          <NavLink className={`flex ml-4 ${NavSearchStyles.pointer}`}>
            {t("header.home")}
          </NavLink>
        </Link>
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
                      <NavLink onClick={() => signOut()}>
                        {t("header.log-out")}
                      </NavLink>
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
                  <div className={`${NavSearchStyles.flag}`}>
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
