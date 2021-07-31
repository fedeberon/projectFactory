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
import { CaretDownFill } from "react-bootstrap-icons";

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
  const olDropdowns = useRef([]);
  dropdowns.current = [];
  divGris.current = [];
  olDropdowns.current = [];

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

  const addOlElemnt = (ol) => {
    if (ol && !olDropdowns.current.includes(ol)) {
      olDropdowns.current.push(ol);
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
    { name: "Viviendas frente al mar" },
    { name: "Viviendas en el campo" },
    { name: "Viviendas en la montaña" },
    { name: "Viviendas en las ciudad" },
    { name: "Viviendas sustentables" },
    { name: "Refacciones y Reciclajes" },
    { name: "Comercial y Oficinas" },
  ];
  const desplegable = (element, divGrisParam) => {
    let bodyHeight = {
      ol: parseInt(
        window
          .getComputedStyle(element.childNodes[1], null)
          .getPropertyValue("height")
          .split("px")[0]
      ),
      li: parseInt(
        window
          .getComputedStyle(element, null)
          .getPropertyValue("height")
          .split("px")[0]
      ),
    };
    divGrisParam.style.top = bodyHeight.ol + bodyHeight.li + "px";
    element.childNodes[1].classList.toggle(styles.overImportant);
    document.querySelector("body").classList.toggle(styles.overFlowHidden);

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
        <Col className="position-relative p-0 d-flex col-12 ">
          <nav className={styles.nav}>
            <ul>
              <li
                ref={(li) => {
                  addDesplegable(li);
                }}
                onClick={(e) =>
                  desplegable(dropdowns.current[0], divGris.current[0])
                }
                className={`${styles.liNav}`}
              >
                <a>
                  Fotos{" "}
                  <CaretDownFill
                    size={12}
                    className={`${styles.move}`}
                  ></CaretDownFill>
                </a>
                <ol
                  className={styles.desplegable}
                  ref={(ol) => {
                    addOlElemnt(ol);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>Categorias</h5>
                        {categories.map((category, index) => (
                          <Link key={index} href="#" passHref>
                            <li>
                              <a className={styles.link}>{category.name} </a>
                            </li>
                          </Link>
                        ))}
                      </Col>
                    </Row>
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
                className={`${styles.liNav}`}
              >
                <a>
                  {`${t("professionals")} `}
                  <CaretDownFill
                    size={12}
                    className={`${styles.move}`}
                  ></CaretDownFill>
                </a>
                <ol
                  className={styles.desplegable}
                  ref={(ol) => {
                    addOlElemnt(ol);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>Categorias</h5>
                        <Link href="/professional" passHref>
                          <li>
                            <a className={styles.link}>{t("professionals")}</a>
                          </li>
                        </Link>
                        <Link href="/companies" passHref>
                          <li>
                            <a className={styles.link}>{t("companies")}</a>
                          </li>
                        </Link>
                      </Col>
                    </Row>
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
                className={`${styles.liNav}`}
              >
                <a>
                  {`${t("products")} `}
                  <CaretDownFill
                    size={12}
                    className={`${styles.move}`}
                  ></CaretDownFill>
                </a>
                <ol
                  className={styles.desplegable}
                  ref={(ol) => {
                    addOlElemnt(ol);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>Categorias</h5>
                        <Link href="/product">
                          <li>
                            <a className={styles.link}>{t("products")}</a>
                          </li>
                        </Link>
                        {productCategories.map((category, index) => (
                          <Link key={index} href="/product">
                            <li>
                              <a className={styles.link}>{category.name}</a>
                            </li>
                          </Link>
                        ))}
                      </Col>
                    </Row>
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
                className={`${styles.liNav}`}
              >
                <a>
                  {`${t("projects")} `}
                  <CaretDownFill
                    size={12}
                    className={`${styles.move}`}
                  ></CaretDownFill>
                </a>
                <ol
                  className={styles.desplegable}
                  ref={(ol) => {
                    addOlElemnt(ol);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>Categorias</h5>
                        <Link href="/project" passHref>
                          <li>
                            <a className={styles.link}>{t("projects")}</a>
                          </li>
                        </Link>
                      </Col>
                    </Row>
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
              <Link href="/magazine" passHref>
                <li className={styles.liNav}>
                  <a className="text-decoration-none">{t("magazine")}</a>
                </li>
              </Link>
              <Link href="/about" passHref>
                <li className={styles.liNav}>
                  <a className="text-decoration-none">{t("about-us")}</a>
                </li>
              </Link>
              <Link href="/contact" passHref>
                <li className={styles.liNav}>
                  <a className="text-decoration-none">{t("contact")}</a>
                </li>
              </Link>
              {isRole("ROLE_ADMINISTRATOR") && (
                <>
                  <li
                    ref={(li) => {
                      addDesplegable(li);
                    }}
                    onClick={(e) =>
                      desplegable(dropdowns.current[4], divGris.current[4])
                    }
                    className={`${styles.liNav}`}
                  >
                    <a>
                      {`${t("administrator")} `}
                      <CaretDownFill
                        size={12}
                        className={`${styles.move}`}
                      ></CaretDownFill>
                    </a>
                    <ol
                      className={styles.desplegable}
                      ref={(ol) => {
                        addOlElemnt(ol);
                      }}
                    >
                      <div
                        className={`${styles.containerDesplegable} container`}
                      >
                        <Row className="py-2">
                          <Col className="col-auto">
                            <h5>{t("administrator")}</h5>
                            <Link href="/admin/company" passHref>
                              <li>
                                <a className={styles.link}>{t("company")}</a>
                              </li>
                            </Link>
                            <Link href="/admin/professional" passHref>
                              <li>
                                <a className={styles.link}>
                                  {t("professional")}
                                </a>
                              </li>
                            </Link>
                            <Link href="/admin/product" passHref>
                              <li>
                                <a className={styles.link}>{t("products")}</a>
                              </li>
                            </Link>
                            <Link href="/admin/building" passHref>
                              <li>
                                <a className={styles.link}>{t("buildings")}</a>
                              </li>
                            </Link>
                          </Col>
                        </Row>
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
