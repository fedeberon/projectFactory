import React, { useState, useRef, useEffect } from "react";
import { Navbar, InputGroup, Col, Row, Dropdown, Form } from "react-bootstrap";
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
import OffCanvasMenuCel from "../OffCanvas/OffCanvasMenuCel";

// Custom Hooks
import useSize from "../../hooks/window/useSize";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchByProfessionals, setSearchByProfessionals] = useState(true);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const { width } = useSize();
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
      <Navbar collapseOnSelect expand="lg" className={`${styles.navbar}`}>
        <Row className="row-cols-3 justify-content-between align-items-center w-100 gap-2 gap-md-0 m-0 mb-2 mb-md-0">
          <Col className="col-auto col-sm-auto col-lg-4 p-0">
            <Link href="/" passHref>
              <Navbar.Brand className="p-0 m-0">
                <img
                  className={`${styles.imgLogo}`}
                  width={"100%"}
                  height={"auto"}
                  alt=""
                  src={"/logo.svg"}
                />
              </Navbar.Brand>
            </Link>
          </Col>
          <Col className="col-12 col-sm-auto col-md-5 col-lg-4 order-3 order-sm-2">
            <InputGroup className="d-flex">
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
          </Col>
          <Col className="col-auto col-sm-auto col-lg-4 order-2">
            <Navbar.Collapse className="justify-content-end gap-2">
              <Row
                className={`justify-content-md-center justify-content-start`}
              >
                <Col>
                  <Dropdown>
                    {session && (
                      <>
                        <Dropdown.Toggle
                          variant="transparent"
                          className="d-flex align-items-center"
                        >
                          <p className={`text-break text-wrap m-0`}>
                            {session?.user?.name}
                          </p>
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
                            <Dropdown.Item>{t("header.profile")}</Dropdown.Item>
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
              <Col className="d-flex col-auto g-2">
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
            {width < 992 && <OffCanvasMenuCel />}
          </Col>
        </Row>
      </Navbar>

      {width > 992 && <NavSearch />}
    </>
  );
}
