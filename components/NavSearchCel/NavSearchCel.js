// Frameworks
import React, { useEffect } from "react";
import { Nav, Navbar, NavDropdown, Row, Col, Dropdown } from "react-bootstrap";
import { useRouter } from "next/dist/client/router";
import useTranslation from "next-translate/useTranslation";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";
import Image from "next/image";
import { PersonCircle } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// Styles
import styles from "./NavSearchCel.module.css";

// Components
import Authentication from "../Authentication/Authentication";
import RolProfile from "../RolProfile";

// Services
import * as userService from "../../services/userService";
import * as categoryService from "../../services/categoryService";
import * as tagService from "../../services/tagService";

export default function NavSearchCel() {
  const [session] = useSession();
  const categoriesInitializated = useSelector(
    (state) => state.categories.initializated
  );
  const tagsInitializated = useSelector((state) => state.tags.initializated);
  const productCategories = useSelector((state) => state.categories.products);
  const professionalCategories = useSelector(
    (state) => state.categories.professionals
  );
  const buildingWorkCategories = useSelector(
    (state) => state.categories.buildingWorks
  );
  const dispatch = useDispatch();

  const { t } = useTranslation("common");

  const router = useRouter();

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  const onSignOut = () => {
    userService.clearData();
    signOut();
  };

  useEffect(async () => {
    if (!categoriesInitializated) {
      categoryService.dispatchCategories(dispatch);
    }
  }, []);

  useEffect(async () => {
    if (!tagsInitializated) {
      tagService.dispatchTags(dispatch);
    }
  }, []);

  return (
    <>
      <div className={styles.band2}>
        <Navbar expand="">
          <Navbar.Collapse
            id="navbar-light-example"
            className="navbar-collapse collapse show"
          >
            <Nav className={`${styles.nav} flex-column m-0 gap-2`}>
              <NavDropdown
                className="navLink"
                title={<span className={styles.navLink}> {t("photos")}</span>}
              >
                <Link href={`/ideas`} passHref>
                  <NavDropdown.Item>{t("all")}</NavDropdown.Item>
                </Link>
                {buildingWorkCategories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/ideas?categories=${category.name}`}
                    passHref
                  >
                    <NavDropdown.Item>{category.name}</NavDropdown.Item>
                  </Link>
                ))}
              </NavDropdown>

              {/* //TODO: Aqui cambiar a elementos multiples */}
              <NavDropdown
                className="navLink"
                title={
                  <span className={styles.navLink}> {t("professionals")}</span>
                }
              >
                <Link href={`/professional`} passHref>
                  <NavDropdown.Item>{t("all")}</NavDropdown.Item>
                </Link>
                {professionalCategories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/professional?categories=${category.name}`}
                    passHref
                  >
                    <NavDropdown.Item>{category.name}</NavDropdown.Item>
                  </Link>
                ))}
              </NavDropdown>

              {/* <Link href="/professional" passHref>
                <Nav.Link>
                  <span className={styles.navLink}> {t("professionals")}</span>
                </Nav.Link>
              </Link> */}

              {/* <Link href="/product" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("products")}</span>
                </Nav.Link>
              </Link> */}

              <NavDropdown
                className="navLink"
                title={<span className={styles.navLink}> {t("products")}</span>}
              >
                <Link href={`/product`} passHref>
                  <NavDropdown.Item>{t("all")}</NavDropdown.Item>
                </Link>
                {productCategories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/product?category=${category.name}`}
                    passHref
                  >
                    <NavDropdown.Item>{category.name}</NavDropdown.Item>
                  </Link>
                ))}
              </NavDropdown>

              <Link href="/companies" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("companies")}</span>
                </Nav.Link>
              </Link>

              {/* <NavDropdown
                className="navLink"
                title={
                  <span className={styles.navLink}>{t("professionals")}</span>
                }
              >
                <Link href="/professional" passHref>
                  <NavDropdown.Item>{t("professionals")}</NavDropdown.Item>
                </Link>

                <Link href="/companies" passHref>
                  <NavDropdown.Item>{t("companies")}</NavDropdown.Item>
                </Link>
              </NavDropdown> */}

              {/* <Link href="/project" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("projects")}</span>
                </Nav.Link>
              </Link> */}

              <Link href="/magazine" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("magazine")}</span>
                </Nav.Link>
              </Link>

              <Link href="/about" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("about-us")}</span>
                </Nav.Link>
              </Link>

              <Link href="/contact" passHref>
                <Nav.Link>
                  <span className={styles.navLink}>{t("contact")}</span>
                </Nav.Link>
              </Link>

              {isRole("ROLE_ADMINISTRATOR") && (
                <NavDropdown
                  title={
                    <span className={styles.navLink}>{t("administrator")}</span>
                  }
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

                  <Link href="/admin/categories" passHref>
                    <NavDropdown.Item>{t("categories")}</NavDropdown.Item>
                  </Link>
                </NavDropdown>
              )}
              <Row
                className={`justify-content-md-center justify-content-start`}
              >
                <Col>
                  <Dropdown>
                    {session && (
                      <>
                        <Dropdown.Toggle variant="transparent">
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
              <Row>
                <Authentication />
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
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}
