import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CaretDownFill } from "react-bootstrap-icons";

import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import Link from "next/link";
import styles from "./NavSearch.module.css";
import { useDispatch, useSelector } from "react-redux";

// Services
import * as categoryService from "../../services/categoryService";

// terminar componente tiene una pequeña falla
// const CustomDropdown = ({ children, items }) => {

//   const dropdown = useRef();
//   const divGrey = useRef();

//   const desplegable = () => {
//     let bodyHeight = {
//       ol: parseInt(
//         window
//           .getComputedStyle(dropdown.current.childNodes[1], null)
//           .getPropertyValue("height")
//           .split("px")[0]
//       ),
//       li: parseInt(
//         window
//           .getComputedStyle(dropdown.current, null)
//           .getPropertyValue("height")
//           .split("px")[0]
//       ),
//     };

//     divGrey.current.style.top = bodyHeight.ol + bodyHeight.li + "px";
//     dropdown.current.childNodes[1].classList.toggle(styles.overImportant);
//     document.querySelector("body").classList.toggle(styles.overFlowHidden);

//     if (dropdown.current != null) {
//       if (
//         !dropdown.current.children[1].classList.contains(styles.showDesplegable)
//       ) {
//         dropdown.current.classList.remove(styles.borderActive);
//         dropdown.current.children[1].classList.remove(styles.showDesplegable);

//         divGrey.current.classList.remove(styles.showOutSide);
//       }
//       dropdown.current.classList.toggle(styles.borderActive);
//       dropdown.current.children[1].classList.toggle(styles.showDesplegable);
//       divGrey.current.classList.toggle(styles.showOutSide);
//     }
//   };
//   const toggle = () => {
//     dropdown.current.classList.remove(styles.borderActive);
//     dropdown.current.children[1].classList.remove(styles.showDesplegable);
//     divGrey.current.classList.remove(styles.showOutSide);
//     document.querySelector("body").classList.remove(styles.overFlowHidden);
//   };
//
//   return (
//     <>
//       <li ref={dropdown} onClick={desplegable} className={`${styles.liNav}`}>
//         <div className="d-flex justify-content-center align-items-center gap-1">
//           {children}
//           <CaretDownFill size={12} className={`${styles.move}`}></CaretDownFill>
//         </div>
//         <ol className={styles.desplegable}>
//           <div className={`${styles.containerDesplegable} container`}>
//             <Row className="py-2">
//               <Col className="col-auto">{items}</Col>
//             </Row>
//           </div>
//         </ol>
//       </li>
//       <div ref={divGrey} onClick={toggle} className={styles.outSide}></div>
//     </>
//   );
// };

export default function NavSearch({ filters }) {
  const [session, loading] = useSession();
  const [maxRows, setMaxRows] = useState(6);
  const { t } = useTranslation("common");

  const dispatch = useDispatch();
  const categoriesInitializated = useSelector(
    (state) => state.categories.initializated
  );
  const productCategories = useSelector((state) => state.categories.products);

  const buildingWorkCategories = useSelector(
    (state) => state.categories.buildingWorks
  );

  const productProfessionals = useSelector(
    (state) => state.categories.professionals
  );

  const dropdowns = useRef([]);
  const divGris = useRef([]);
  const divDropdowns = useRef([]);
  dropdowns.current = [];
  divGris.current = [];
  divDropdowns.current = [];

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

  const addOlElemnt = (div) => {
    if (div && !divDropdowns.current.includes(div)) {
      divDropdowns.current.push(div);
    }
  };

  useEffect(async () => {
    if (!categoriesInitializated) {
      categoryService.dispatchCategories(dispatch);
    }
  }, []);

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  const desplegable = (divDesplegable, divGrey) => {
    let bodyHeight = {
      ol: parseInt(
        window
          .getComputedStyle(divDesplegable.childNodes[0], null)
          .getPropertyValue("height")
          .split("px")[0]
      ),
      li: parseInt(
        window
          .getComputedStyle(divDesplegable, null)
          .getPropertyValue("height")
          .split("px")[0]
      ),
    };

    divGrey.style.top = bodyHeight.ol + 56 + "px";
    // element.childNodes[1].classList.toggle(styles.overImportant);
    document.querySelector("body").classList.add(styles.overFlowHidden);

    if (divDesplegable != null) {
      if (!divDesplegable.classList.contains(styles.showDesplegable)) {
        divDropdowns.current.map((dropdown) => {
          dropdown.classList.remove(styles.borderActive);
          dropdown.classList.remove(styles.showDesplegable);
          dropdown.previousElementSibling.classList.remove(styles.borderActive);
        });
        divGris.current.map((element) => {
          element.classList.remove(styles.showOutSide);
        });
      } else {
        document.querySelector("body").classList.remove(styles.overFlowHidden);
      }
      divDesplegable.previousElementSibling.classList.toggle(
        styles.borderActive
      );
      divDesplegable.classList.toggle(styles.showDesplegable);
      divGrey.classList.toggle(styles.showOutSide);
    }
  };

  const toggle = () => {
    dropdowns.current.map((element) => {
      element.classList.remove(styles.borderActive);
      element.nextSibling.classList.remove(styles.showDesplegable);
    });
    divGris.current.map((element) => {
      element.classList.remove(styles.showOutSide);
    });
    document.querySelector("body").classList.remove(styles.overFlowHidden);
  };

  const chunk = (arr, size) =>
    arr.reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );

  return (
    <Container fluid className="m-0 p-0">
      <Row className="row-cols-1 w-100 m-0 justify-content-center bg-white">
        <Col className="position-relative p-0 d-flex col-12 ">
          <nav className={styles.nav}>
            <ul>
              <>
                <li
                  ref={(li) => {
                    addDesplegable(li);
                  }}
                  onClick={(e) =>
                    desplegable(divDropdowns.current[0], divGris.current[0])
                  }
                  className={`${styles.liNav}`}
                >
                  <a>
                    {t("photos")}{" "}
                    <CaretDownFill
                      size={12}
                      className={`${styles.move}`}
                    ></CaretDownFill>
                  </a>
                </li>
                <div
                  className={styles.desplegable}
                  ref={(div) => {
                    addOlElemnt(div);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>{t("categories")}</h5>
                        <Row className={`row-cols-4`}>
                          <Col className="col-auto">
                            <Link href={`/ideas`} passHref>
                              <li>
                                <a className={styles.link}>{t("all")} </a>
                              </li>
                            </Link>
                          </Col>
                          {chunk(buildingWorkCategories, maxRows).map(
                            (col, index) => (
                              <Col key={index} className="col-auto">
                                {col.map((category, index) => (
                                  <Link
                                    key={index}
                                    href={`/ideas?categories=${category.name.replace(
                                      /\s+/g,
                                      "-"
                                    )}`}
                                    passHref
                                  >
                                    <li>
                                      <a className={styles.link}>
                                        {category.name}
                                      </a>
                                    </li>
                                  </Link>
                                ))}
                              </Col>
                            )
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div
                  ref={(div) => {
                    addDivGris(div);
                  }}
                  onClick={(e) => toggle(0)}
                  className={styles.outSide}
                ></div>

                {/* <Link onClick={()=>myFunction()} href="/professional" passHref>
                  <li className={styles.liNav}>
                    <a className="text-decoration-none">{t("professionals")}</a>
                  </li>
                </Link> */}

                <li
                  ref={(li) => {
                    addDesplegable(li);
                  }}
                  onClick={(e) =>
                    desplegable(divDropdowns.current[1], divGris.current[1])
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
                </li>
                <div
                  className={styles.desplegable}
                  ref={(div) => {
                    addOlElemnt(div);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>{t("categories")}</h5>
                        <Row className={`row-cols-4`}>
                          <Col className="col-auto">
                            <Link href="/professional" passHref>
                              <li>
                                <a className={styles.link}>{t("all")}</a>
                              </li>
                            </Link>
                          </Col>
                          {/* <Link onClick={()=>myFunction()} href="/companies" passHref>
                            <li>
                              <a className={styles.link}>{t("companies")}</a>
                            </li>
                          </Link> */}
                          {chunk(productProfessionals, maxRows).map(
                            (col, index) => (
                              <Col key={index} className="col-auto">
                                {col.map((category, index) => (
                                  <Link
                                    key={index}
                                    href={`/professional?categories=${category.name.replace(
                                      /\s+/g,
                                      "-"
                                    )}`}
                                    passHref
                                  >
                                    <li>
                                      <a className={styles.link}>
                                        {category.name}
                                      </a>
                                    </li>
                                  </Link>
                                ))}
                              </Col>
                            )
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div
                  ref={(div) => {
                    addDivGris(div);
                  }}
                  onClick={(e) => toggle()}
                  className={styles.outSide}
                ></div>

                <li
                  ref={(li) => {
                    addDesplegable(li);
                  }}
                  onClick={(e) =>
                    desplegable(divDropdowns.current[2], divGris.current[2])
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
                </li>
                <div
                  className={styles.desplegable}
                  ref={(div) => {
                    addOlElemnt(div);
                  }}
                >
                  <div className={`${styles.containerDesplegable} container`}>
                    <Row className="py-2">
                      <Col className="col-auto">
                        <h5>{t("categories")}</h5>
                        <Row className={`row-cols-4`}>
                          <Col className="col-auto">
                            <Link href="/product">
                              <li>
                                <a className={styles.link}>{t("all")}</a>
                              </li>
                            </Link>
                          </Col>
                          {/* {productCategories.map((category, index) => (
                            <Link
                              key={index}
                              href={`/product?category=${category.name}`}
                            >
                              <li>
                                <a className={styles.link}>{category.name}</a>
                              </li>
                            </Link>
                          ))} */}
                          {chunk(productCategories, maxRows).map(
                            (col, index) => (
                              <Col key={index} className="col-auto">
                                {col.map((category, index) => (
                                  <Link
                                    key={index}
                                    href={`/product?category=${category.name.replace(
                                      /\s+/g,
                                      "-"
                                    )}`}
                                    passHref
                                  >
                                    <li>
                                      <a className={styles.link}>
                                        {category.name}
                                      </a>
                                    </li>
                                  </Link>
                                ))}
                              </Col>
                            )
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div
                  ref={(div) => {
                    addDivGris(div);
                  }}
                  onClick={(e) => toggle()}
                  className={styles.outSide}
                ></div>

                <>
                  {/* <li
                  ref={(li) => {
                    addDesplegable(li);
                  }}
                  onClick={(e) =>
                    desplegable(dropdowns.current[2], divGris.current[2])
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
                          <h5>{t("categories")}</h5>
                          <Link onClick={()=>myFunction()} href="/project" passHref>
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
                  onClick={(e) => toggle(divGris.current[2])}
                  className={styles.outSide}
                ></div> */}
                </>
              </>

              <Link href="/companies" passHref>
                <li className={styles.liNav}>
                  <a className="text-decoration-none">{t("companies")}</a>
                </li>
              </Link>

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
                      desplegable(divDropdowns.current[3], divGris.current[3])
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
                  </li>
                  <div
                    className={styles.desplegable}
                    ref={(div) => {
                      addOlElemnt(div);
                    }}
                  >
                    <div className={`${styles.containerDesplegable} container`}>
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
                              <a className={styles.link}>{t("professional")}</a>
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
                          <Link href="/admin/categories" passHref>
                            <li>
                              <a className={styles.link}>{t("categories")}</a>
                            </li>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div
                    ref={(div) => {
                      addDivGris(div);
                    }}
                    onClick={(e) => toggle()}
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

  // terminar para el componente que queda un detalle
  // const itemsPhotos = (
  //   <>
  //     <h5>{t("categories")}</h5>
  //     <Row className={`row-cols-4`}>
  //       {chunk(filters, 10).map((col, index) => (
  //         <Col key={index} className="col-auto">
  //           {col.map((category, index) => (
  //             <Link
  //               key={index}
  //               href={`/ideas?filtros=${category.tag}`}
  //               passHref
  //             >
  //               <li>
  //                 <a className={styles.link}>{category.tag} </a>
  //               </li>
  //             </Link>
  //           ))}
  //         </Col>
  //       ))}
  //     </Row>
  //   </>
  // );

  // const itemsProfessional = (
  //   <>
  //     <h5>{t("categories")}</h5>
  //     <Link onClick={()=>myFunction()} href="/professional" passHref>
  //       <li>
  //         <a className={styles.link}>{t("professionals")}</a>
  //       </li>
  //     </Link>
  //     <Link onClick={()=>myFunction()} href="/companies" passHref>
  //       <li>
  //         <a className={styles.link}>{t("companies")}</a>
  //       </li>
  //     </Link>
  //   </>
  // );

  // const itemsAdministrator = (
  //   <>
  //     <h5>{t("administrator")}</h5>
  //     <Link onClick={()=>myFunction()} href="/admin/company" passHref>
  //       <li>
  //         <a className={styles.link}>{t("company")}</a>
  //       </li>
  //     </Link>
  //     <Link onClick={()=>myFunction()} href="/admin/professional" passHref>
  //       <li>
  //         <a className={styles.link}>{t("professional")}</a>
  //       </li>
  //     </Link>
  //     <Link onClick={()=>myFunction()} href="/admin/product" passHref>
  //       <li>
  //         <a className={styles.link}>{t("products")}</a>
  //       </li>
  //     </Link>
  //     <Link onClick={()=>myFunction()} href="/admin/building" passHref>
  //       <li>
  //         <a className={styles.link}>{t("buildings")}</a>
  //       </li>
  //     </Link>
  //   </>
  // );

  // const itemsProduct = (
  //   <>
  //     <h5>{t("categories")}</h5>
  //     <Link onClick={()=>myFunction()} href="/product">
  //       <li>
  //         <a className={styles.link}>{t("products")}</a>
  //       </li>
  //     </Link>
  //     {productCategories.map((category, index) => (
  //       <Link key={index} href={`/product?category=${category.name}`}>
  //         <li>
  //           <a className={styles.link}>{category.name}</a>
  //         </li>
  //       </Link>
  //     ))}
  //   </>
  // );

  // queda para terminar de hacer componente
  //   return (
  //     <Container fluid className="m-0 p-0">
  //       <Row className="row-cols-1 w-100 m-0 justify-content-center bg-white">
  //         <Col className="position-relative p-0 d-flex col-12 ">
  //           <nav className={styles.nav}>
  //             <ul>
  //               <CustomDropdown items={itemsPhotos}>{t("photos")}</CustomDropdown>

  //               <CustomDropdown items={itemsProfessional}>
  //                 {t("professionals")}
  //               </CustomDropdown>

  //               <CustomDropdown items={itemsProduct}>
  //                 {t("products")}
  //               </CustomDropdown>

  //               <Link onClick={()=>myFunction()} href="/magazine" passHref>
  //                 <li className={styles.liNav}>
  //                   <a className="text-decoration-none">{t("magazine")}</a>
  //                 </li>
  //               </Link>

  //               <Link onClick={()=>myFunction()} href="/about" passHref>
  //                 <li className={styles.liNav}>
  //                   <a className="text-decoration-none">{t("about-us")}</a>
  //                 </li>
  //               </Link>

  //               <Link onClick={()=>myFunction()} href="/contact" passHref>
  //                 <li className={styles.liNav}>
  //                   <a className="text-decoration-none">{t("contact")}</a>
  //                 </li>
  //               </Link>
  //               {isRole("ROLE_ADMINISTRATOR") && (
  //                 <>
  //                   <CustomDropdown items={itemsAdministrator}>
  //                     {t("administrator")}
  //                   </CustomDropdown>
  //                 </>
  //               )}
  //             </ul>
  //           </nav>
  //         </Col>
  //       </Row>
  //     </Container>
  //   );
}
