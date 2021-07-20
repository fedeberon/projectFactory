import React, { useState, useRef, useEffect } from "react";
import {
  Collapse,
  Navbar,
  Nav,
  NavbarBrand,
  InputGroup,
  Col,
  Row,
  Dropdown,
  Container,
  Form,
} from "react-bootstrap";
import Authentication from "../Authentication/Authentication";
import { useRouter } from "next/dist/client/router";
import useTranslation from "next-translate/useTranslation";
import { signOut, useSession } from "next-auth/client";
import { PersonCircle, Search } from "react-bootstrap-icons";

import Link from "next/link";
import Image from "next/image";
import SuggestionsSearch from "../SuggestionsSearch/SuggestionsSearch";
import * as professionalService from "../../services/professionalService";
import * as projectService from "../../services/projectService";
import * as userService from "../../services/userService";
import styles from "./Header.module.css";

import RolProfile from "../RolProfile";
import NavSearch from "../NavSearch/NavSearch";

export default function Header() {
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
    const verifyClickedNavSearch = (e) => {
      const isClickedOnNavSearch = (DOMElement) => {
        if (DOMElement != null) {
          const classList = Array.from(DOMElement.classList);
          const clickOnNav = classList.includes("nav-search");
          return clickOnNav
            ? true
            : isClickedOnNavSearch(DOMElement.parentElement);
        } else {
          return false;
        }
      };

      if (isClickedOnNavSearch(e.target)) setSearchActive(true);
      else setSearchActive(false);
    };

    document.addEventListener("click", verifyClickedNavSearch);
    return () => {
      document.removeEventListener("click", verifyClickedNavSearch);
    };
  }, []);

  useEffect(() => {
    if (searchActive) inputSearch.current.focus();
    else inputSearch.current.blur();
  }, [searchActive]);

  const handleOnBlurInputSearch = () => {
    if (searchActive) inputSearch.current.focus();
    else inputSearch.current.blur();
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
        newSuggestions.forEach((suggestion) => {
          suggestion.value = suggestion.contact;
          suggestion.link = "#";
        });
      } else {
        newSuggestions = await projectService.findByNameAndActive(
          value,
          true,
          pageSize.page,
          pageSize.size
        );
        newSuggestions.forEach((suggestion) => {
          suggestion.value = suggestion.name;
          suggestion.link = `project/${suggestion.name}-${suggestion.id}`;
        });
      }
    } else {
      newSuggestions = [];
    }

    
    setSuggestions(newSuggestions);
  };
  
  const onSignOut = () => {
    userService.clearData();
    signOut();
  };
  
  return (
    <>
        <Navbar collapseOnSelect expand="lg"  className={styles.navbar}>
          <Link href="/" passHref>
            <span className={`${styles.pointer} flex-lg-grow-0 p-0`}>
              <Image width={220} height={92} alt="" src={"/logo.svg"} />
            </span>
          </Link>
          <Row
            className={`justify-content-center w-50 align-items-center mx-auto`}
          >
            <InputGroup className="w-100  d-flex">
              <Form.Label htmlFor="Search"></Form.Label>
              <SuggestionsSearch
                active={searchActive}
                suggestions={suggestions}
                input={inputSearch.current}
                onChangeCheckIdeas={() => setSearchByProfessionals(false)}
                onChangeCheckProjects={() => setSearchByProfessionals(true)}
              />
              <InputGroup>
                <Form.Control
                  type="search"
                  name="search"
                  autoComplete="off"
                  ref={inputSearch}
                  id="exampleSearch"
                  className={`${styles.inputSearch} nav-search`}
                  placeholder={t("header.search-placeholder")}
                  onChange={searchProjectsOrProfessionals}
                  onFocus={() => setSearchActive(true)}
                  onBlur={handleOnBlurInputSearch}
                />
                <InputGroup.Text className={styles.buttonSearch}>
                  <Search />
                </InputGroup.Text>
              </InputGroup>
            </InputGroup>
          </Row>


          <Navbar.Toggle onClick={toggle} />

          <Navbar.Collapse className="flex-lg-grow-0">
            <Row className={`justify-content-md-center justify-content-start`}>
              <Col>
                <Dropdown>
                  {session && (
                    <>
                      <Dropdown.Toggle variant="light">
                        {session?.user?.name}
                        {!session.user.image ? (
                          <>
                            <PersonCircle className="ms-1" size={25} />
                          </>
                        ) : (
                          <>
                            <img
                              className={`${styles.imgProfile} rounded-circle mx-1 border`}
                              src={session.user.image}
                            />
                          </>
                        )}
                      </Dropdown.Toggle>
                    </>
                  )}
                  <Dropdown.Menu>
                    {isRole("ROLE_USER") && (
                      <>
                        <Link href="/profile" passHref>
                          <Dropdown.Item >
                            {t("header.profile")}
                          </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                      </>
                    )}
                    <Dropdown.Item>
                      <RolProfile />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {isRole("ROLE_PROFESSIONAL") && (
                      <>
                        <Link href="/portfolio" passHref>
                          <Dropdown.Item>
                            {t("header.portfolio")}
                          </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                      </>
                    )}
                    {isRole("ROLE_COMPANY") && (
                      <>
                        <Link href="/my-products" passHref>
                          <Dropdown.Item>
                            {t("header.my-products")}
                          </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                      </>
                    )}
                    {session && (
                      <Dropdown.Item onClick={onSignOut}>
                        {t("header.log-out")}
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
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
                    <div className={`${styles.flag}`}>
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
          </Navbar.Collapse>
        </Navbar>
      <NavSearch />
    </>
  );

}
