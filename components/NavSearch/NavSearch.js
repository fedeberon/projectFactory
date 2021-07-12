import React, { useState, useRef, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavLink,
  NavbarBrand,
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

import Header from "../Header/Header";
import SuggestionsSearch from "../SuggestionsSearch/SuggestionsSearch";
import * as professionalService from "../../services/professionalService";
import * as projectService from "../../services/projectService";

import RolProfile from "../RolProfile";

export default function NavSearch() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchByProfessionals, setSearchByProfessionals] = useState(true);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [session, loading] = useSession();
  const inputSearch = useRef();

  const router = useRouter();

  const toggle = () => setDropdown((dropdown) => !dropdown);
  const toggle2 = () => setDropdownOpen((dropdownOpen) => !dropdownOpen);

  const { t } = useTranslation("common");

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  useEffect(() => {
    document.addEventListener("click",(e) => {
      const isClickedOnNavSearch = (DOMElement) => {
        if (DOMElement != null) {
          const classList = Array.from(DOMElement.classList);
          const clickOnNav = classList.includes("nav-search");
          return clickOnNav ? true : isClickedOnNavSearch(DOMElement.parentElement);
        } else {
          return false;
        }
      };

      if (isClickedOnNavSearch(e.target))
        setSearchActive(true);
      else 
        setSearchActive(false);
    });
  }, []);

  useEffect(() => {

    if (searchActive)
      inputSearch.current.focus();
    else
      inputSearch.current.blur();

  }, [searchActive]);

  const handleOnBlurInputSearch = () => {

    if (searchActive)
      inputSearch.current.focus();
    else
      inputSearch.current.blur();

  };

  useEffect(() => searchProjectsOrProfessionals(), [searchByProfessionals]);

  const searchProjectsOrProfessionals = async () => {
    const value = inputSearch.current.value;
    let newSuggestions;
    if (value != "") {
      if (searchByProfessionals) {
        newSuggestions = await professionalService.findByContactAndStatus(
          value,
          "APPROVED",
          pageSize.page,
          pageSize.size
        );
        newSuggestions.forEach(suggestion => {
          suggestion.value = suggestion.contact
          suggestion.link = "#";
        });
      } else {
        newSuggestions = await projectService.findByNameAndActive(
          value,
          true,
          pageSize.page,
          pageSize.size
        );
        newSuggestions.forEach(suggestion => {
          suggestion.value = suggestion.name;
          suggestion.link = `project/${suggestion.name}-${suggestion.id}`;
        });
      }
    } else {
      newSuggestions = [];
    }

    setSuggestions(newSuggestions);
  };

 

  return (
    <>
      <Container fluid="xl">
        <Navbar className="light navbar-expand-lg px-2" light>
          <Link href="/" passHref>
            <NavLink className={`${NavSearchStyles.pointer} flex-lg-grow-0`}>
              {t("header.home")}
            </NavLink>
          </Link>
          <Row className={`justify-content-center w-50 align-items-center mx-auto`}>
            <InputGroup className="w-100  d-flex">
              <Label for="exampleSearch" htmlFor="Search"></Label>
              <Input
                type="search"
                name="search"
                autoComplete="off"
                innerRef={inputSearch}
                id="exampleSearch"
                className={`${NavSearchStyles.inputSearch} nav-search`}
                placeholder={t("header.search-placeholder")}
                onChange={searchProjectsOrProfessionals}
                onFocus={() => setSearchActive(true)}
                onBlur={handleOnBlurInputSearch}
              />
              <SuggestionsSearch
                active={searchActive}
                suggestions={suggestions}
                input={inputSearch.current}
                onChangeCheckIdeas={() => setSearchByProfessionals(false)}
                onChangeCheckProjects={() => setSearchByProfessionals(true)}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText className={NavSearchStyles.buttonSearch}>
                  <Search />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Row>
          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={dropdown} navbar className="flex-lg-grow-0">
            <Row className={`justify-content-md-center justify-content-start`}>
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
              <Col className="col-6 my-md-0 my-4">
                <Authentication />
              </Col>
            </Row>
            <Col className="d-flex col-3 g-2">
              {router.locales.map((locale, index) => (
                <Col key={locale} className="mx-1 col-auto">
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
        </Navbar>
        <Row>
          <Navbar
            className="navbar-expand-lg justify-content-center px-2"
            light
          >
            <Collapse isOpen={dropdown} navbar>
              <Header />
            </Collapse>
          </Navbar>
        </Row>
      </Container>
    </>
  );
}
