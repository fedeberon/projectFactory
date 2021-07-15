// Framewroks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import nProgress from "nprogress";
import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import { Instagram, Facebook } from "react-bootstrap-icons";
import Link from "next/link";

// Components
import NavSearch from "../NavSearch/NavSearch";

// Styles
import LayoutStyles from "./Layout.module.css";

const Layout = ({ children, title, footer = true, header = true }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleRouteChange = (url) => {
      NProgress.start();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    router.events.on("routeChangeComplete", () => NProgress.done());

    router.events.on("routeChangeError", () => nProgress.done());

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <>
      {header && (
        <div className="bg-light">
          <NavSearch />
        </div>
      )}

      <main className="container py-2">
        {/* Title */}
        {title && <h1 className="text-center">{title}</h1>}

        {/* Content */}
        {children}
      </main>

      {footer && (
        <footer className="bg-light text-dark">
          <Container>
            <Row className="row-cols-4 justify-content-center align-items-center w-100">
              <Col className="p-2">
                <Image
                  src={`/logo-02.svg`}
                  width={145.295}
                  height={41.358}
                  alt=""
                  className={`text-muted`}
                />
              </Col>
              <Col>
                <Link href="/about">
                  <a className="m-0 text-muted text-decoration-none list-group-item border-0 p-0 bg-transparent">
                    {t("who-we-are")}
                  </a>
                </Link>
                <Link href="/">
                  <a className="m-0 text-muted text-decoration-none list-group-item border-0 p-0 bg-transparent">
                    {t("frequently-asked-questions")}
                  </a>
                </Link>
                <Link href="/policies">
                  <a className="m-0 text-muted text-decoration-none list-group-item border-0 p-0 bg-transparent">
                    {t("site-policies")}
                  </a>
                </Link>
                <Link href="/contact">
                  <a className="m-0 text-muted text-decoration-none list-group-item border-0 p-0 bg-transparent">
                    {t("contact")}
                  </a>
                </Link>
              </Col>
              <Col>
                <p className="m-0 text-muted">
                  LaFabricaDeProyectosBolivar@gmail.com
                </p>
                <p className="m-0 text-muted">+54 9 11 4545 4545</p>
              </Col>
              <Col>
                <Row className="justify-content-center">
                  <Col className="col-auto">
                    <Instagram size={25} className="text-muted" />
                  </Col>
                  <Col className="col-auto">
                    <Facebook size={25} className="text-muted" />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="text-muted">
                  &copy; Fabrica de Proyectos 2021 - {new Date().getFullYear()}{" "}
                  {t("all-rights-reserved")}.
                </p>
              </Col>
            </Row>
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
