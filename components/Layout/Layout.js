// Framewroks
import { useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

// Components
import Header from "../Header/Header";

// Styles
import styles from "./Layout.module.css";

const Layout = ({ children, title, footer = true, header = true }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
      document
        .querySelector("body")
        .classList.remove("NavSearch_overFlowHidden__1Mups");
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <>
      {header && (
        <div className="bg-light">
          <Header navSearch={true} finder={true} authentication={true} />
        </div>
      )}

      <main>
        {/* Title */}
        {title && <h1 className="text-center">{title}</h1>}

        {/* Content */}
        {children}
      </main>

      {footer && (
        <footer className={`text-dark ${styles.footer}`}>
          <Container>
            <Row className="row-cols-1 row-cols-md-4 justify-content-between align-items-start w-100 gap-4 m-0 py-4">
              <Col className="col-12 col-md-3">
                <Image
                  src={`/logo-02.svg`}
                  width={145.295}
                  height={41.358}
                  alt=""
                  className={`text-muted`}
                />
              </Col>
              <Col
                className={`col-12 col-md-3 d-flex flex-column gap-2 ${styles.menuFooter}`}
              >
                <Link href="/about">
                  <a
                    className={`${styles.ancor} m-0 list-group-item border-0 p-0 bg-transparent`}
                  >
                    {t("who-we-are")}
                  </a>
                </Link>
                <Link href="/">
                  <a
                    className={`${styles.ancor} m-0 list-group-item border-0 p-0 bg-transparent`}
                  >
                    {t("frequently-asked-questions")}
                  </a>
                </Link>
                <Link href="/policies">
                  <a
                    className={`${styles.ancor} m-0 list-group-item border-0 p-0 bg-transparent`}
                  >
                    {t("site-policies")}
                  </a>
                </Link>
                <Link href="/contact">
                  <a
                    className={`${styles.ancor} m-0 list-group-item border-0 p-0 bg-transparent`}
                  >
                    {t("contact")}
                  </a>
                </Link>
              </Col>
              <Col className="col-12 col-md-3">
                <ul
                  className={`${styles.datos} ${styles.datosfooter} ${styles.ul} `}
                >
                  <li>
                    <Image
                      src={`/whatsapp.svg`}
                      width={15}
                      height={15}
                      alt=""
                      className={`text-muted`}
                    />{" "}
                    +54 9 2314 616681
                  </li>
                  <li className={`text-break`}>
                    <Image
                      src={`/email.svg`}
                      width={15}
                      height={15}
                      alt=""
                      className={`text-muted`}
                    />{" "}
                    hola@lafabricadeproyectos.com.ar
                  </li>
                </ul>
              </Col>
              <Col className="col-auto">
                <Row className="justify-content-center">
                  <Col className="col-auto">
                    <Link href="/">
                      <a>
                        <Image
                          src={`/facebook.svg`}
                          width={15.75}
                          height={18}
                          alt=""
                          className={`text-muted`}
                        />{" "}
                      </a>
                    </Link>
                  </Col>
                  <Col className="col-auto">
                    <Link href="/">
                      <a>
                        <Image
                          src={`/instagram.svg`}
                          width={15.75}
                          height={18}
                          alt=""
                          className={`text-muted`}
                        />
                      </a>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* <Row className="mt-2 mt-md-0">
              <Col>
                <p className="text-muted">
                  &copy; Fabrica de Proyectos 2021 - {new Date().getFullYear()}{" "}
                  {t("all-rights-reserved")}.
                </p>
              </Col>
            </Row> */}
            <div className={`${styles.footerLegal}`}>
              <div className={`container`}>
                <div className={`row`}>
                  <div className={`col-md ${styles.copyfooter}`}>
                    Todos los derechos reservados.
                  </div>
                  <div
                    className={`col-md text-md-right ${styles.contLogoZurbrand}`}
                  >
                    <a
                      href="https://www.zurbrand.com/?utm_source=fabricadeproyectos&amp;utm_medium=firma_shop"
                      className={`${styles.linkZurbrand}`}
                      target="_blank"
                    >
                      <img
                        src="https://www.zurbrand.com/firma/logo-zurbrand-v1-01.png"
                        className={`${styles.logoZurbrand}`}
                        alt="Zurbrand | Diseño y Marketing Digital"
                        title="Zurbrand | Diseño y Marketing Digital"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </footer>
      )}
    </>
  );
};

Layout.proptypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  footer: PropTypes.bool,
};

export default Layout;
