import React, { useState, useEffect, useRef } from "react";
import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
  Tab,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap";

import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import Link from "next/link";
import styles from "./NavSearch.module.css";

import * as productService from "../../services/productService";
export default function NavSearch() {
  const [session, loading] = useSession();
  const { t } = useTranslation("common");
  const [productCategories, setProductCategories] = useState([]);

  const dropdowns = useRef([]);
  const divGris = useRef([]);
  dropdowns.current = [];
  divGris.current = [];

  const addDesplegable = (li) => {
    if (li && !dropdowns.current.includes(li)) {
      dropdowns.current.push(li);
    }
  };
  const addDivGris = (div) => {
    if (div && !divGris.current.includes(div)) {
      divGris.current.push(div);
    }
  };
  useEffect(async () => {
    const categories = await productService.findAllCategories(0, 99);
    setProductCategories(categories);
  }, []);

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  const [showValue, setShowValue] = useState(false);

  const showToggle = (e) => {
    e.target.click();
  };

  const categories = [
    { name: "cocina" },
    { name: "baño" },
    { name: "comedor" },
  ];
  const desplegable = (element, divGrisParam) => {
    if (element != null) {
      if (!element.children[1].classList.contains(styles.showDesplegable)) {
        dropdowns.current.map((element) => {
          element.classList.remove(styles.borderActive);
          element.children[1].classList.remove(styles.showDesplegable);
        });
        divGris.current.map((element) => {
          element.classList.remove(styles.showOutSide);
        });
      }
      element.classList.toggle(styles.borderActive);
      element.children[1].classList.toggle(styles.showDesplegable);
      divGrisParam.classList.toggle(styles.showOutSide);
    }
  };
  const toggle = (element) => {
    dropdowns.current.map((element) => {
      element.classList.remove(styles.borderActive);
      element.children[1].classList.remove(styles.showDesplegable);
    });
    divGris.current.map((element) => {
      element.classList.remove(styles.showOutSide);
    });
  };
  return (
    <Container fluid className="m-0 p-0">
      <Row className="row-cols-1 w-100 m-0 justify-content-center bg-white">
        <Col className="position-relative p-0 d-flex col-12">
          <nav className={styles.nav}>
            <ul>
              <li
                ref={(li) => {
                  addDesplegable(li);
                }}
                onClick={(e) =>
                  desplegable(dropdowns.current[0], divGris.current[0])
                }
                className={`${styles.liNav} dropdown-toggle`}
              >
                <a>Fotos</a>
                <ol className={styles.desplegable}>
                  <div className={`${styles.containerDesplegable} container`}>
                    <h5>Categorias</h5>
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link href="#" passHref>
                          <a className={styles.link}>{category.name} </a>
                        </Link>
                      </li>
                    ))}
                  </div>
                </ol>
              </li>
              <div
                ref={(div) => {
                  addDivGris(div);
                }}
                onClick={(e) => toggle(divGris.current[0])}
                className={styles.outSide}
              ></div>
              <li
                ref={(li) => {
                  addDesplegable(li);
                }}
                onClick={(e) =>
                  desplegable(dropdowns.current[1], divGris.current[1])
                }
                className={`${styles.liNav} dropdown-toggle`}
              >
                <a>{t("professionals")}</a>
                <ol className={styles.desplegable}>
                  <div className={`${styles.containerDesplegable} container`}>
                    <h5>Categorias</h5>
                    <li>
                      <Link href="/professional" passHref>
                        <a className={styles.link}>{t("professionals")}</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/companies" passHref>
                        <a className={styles.link}>{t("companies")}</a>
                      </Link>
                    </li>
                  </div>
                </ol>
              </li>
              <div
                ref={(div) => {
                  addDivGris(div);
                }}
                onClick={(e) => toggle(divGris.current[1])}
                className={styles.outSide}
              ></div>
              <li
                ref={(li) => {
                  addDesplegable(li);
                }}
                onClick={(e) =>
                  desplegable(dropdowns.current[2], divGris.current[2])
                }
                className={`${styles.liNav} dropdown-toggle`}
              >
                <a>{t("products")}</a>
                <ol className={styles.desplegable}>
                  <div className={`${styles.containerDesplegable} container`}>
                    <h5>Categorias</h5>
                    <li>
                      <Link href="/product">
                        <a className={styles.link}>{t("products")}</a>
                      </Link>
                      {productCategories.map((category, index) => (
                        <Link href="/product">
                          <a className={styles.link}>{category.name}</a>
                        </Link>
                      ))}
                    </li>
                  </div>
                </ol>
              </li>
              <div
                ref={(div) => {
                  addDivGris(div);
                }}
                onClick={(e) => toggle(divGris.current[2])}
                className={styles.outSide}
              ></div>
              <li
                ref={(li) => {
                  addDesplegable(li);
                }}
                onClick={(e) =>
                  desplegable(dropdowns.current[3], divGris.current[3])
                }
                className={`${styles.liNav} dropdown-toggle`}
              >
                <a>{t("projects")}</a>
                <ol className={styles.desplegable}>
                  <div className={`${styles.containerDesplegable} container`}>
                    <h5>Categorias</h5>
                    <li>
                      <Link href="/project" passHref>
                        <a className={styles.link}>{t("projects")}</a>
                      </Link>
                    </li>
                  </div>
                </ol>
              </li>
              <div
                ref={(div) => {
                  addDivGris(div);
                }}
                onClick={(e) => toggle(divGris.current[3])}
                className={styles.outSide}
              ></div>
              <li className={styles.liNav}>
                <Link href="/magazine" passHref>
                  <a className="text-decoration-none">{t("magazine")}</a>
                </Link>
              </li>
              <li className={styles.liNav}>
                <Link href="/about" passHref>
                  <a className="text-decoration-none">{t("about-us")}</a>
                </Link>
              </li>
              <li className={styles.liNav}>
                <Link href="/contact" passHref>
                  <a className="text-decoration-none">{t("contact")}</a>
                </Link>
              </li>
              {isRole("ROLE_ADMINISTRATOR") && (
                <>
                  <li
                    ref={(li) => {
                      addDesplegable(li);
                    }}
                    onClick={(e) =>
                      desplegable(dropdowns.current[4], divGris.current[4])
                    }
                    className={`${styles.liNav} dropdown-toggle`}
                  >
                    <a>{t("administrator")}</a>
                    <ol className={styles.desplegable}>
                      <div className={`${styles.containerDesplegable} container`}>
                        <h5>{t("administrator")}</h5>
                        <li>
                          <Link href="/admin/company" passHref>
                            <a className={styles.link}>
                              {t("company")}
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin/professional" passHref>
                            <a className={styles.link}>
                              {t("professional")}
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin/product" passHref>
                            <a className={styles.link}>
                              {t("products")}
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin/building" passHref>
                            <a className={styles.link}>
                              {t("buildings")}
                            </a>
                          </Link>
                        </li>
                      </div>
                    </ol>
                  </li>
                  <div
                    ref={(div) => {
                      addDivGris(div);
                    }}
                    onClick={(e) => toggle(divGris.current[3])}
                    className={styles.outSide}
                  ></div>
                </>
              )}
            </ul>
          </nav>
        </Col>
      </Row>
    </Container>
  );
}
