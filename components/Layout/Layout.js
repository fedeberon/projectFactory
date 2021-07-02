// Framewroks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import nProgress from "nprogress";
import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col,NavbarToggler,Collapse } from "reactstrap";
import Image from "next/image";
import { Instagram, Facebook } from "react-bootstrap-icons";

// Components
import Header from "../Header/Header";
import NavSearch from "../NavSearch/NavSearch";

// Styles
import LayoutStyles from "./Layout.module.css";

const Layout = ({ children, title, footer = true, header = true }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [dropdown, setDropdown] = useState(false);

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

  const toggle = () => setDropdown((dropdown) => !dropdown);
  return (
    <>
      {header && (
        <div className="bg-light">
            <NavSearch />
        {/* <div>
          <NavSearch />
          <Header /> */}
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
                  src={`/logo.svg`}
                  width={200}
                  height={"auto"}
                  alt=""
                  className={`${LayoutStyles.imgBlackAndWhite} text-muted`}
                />
              </Col>
              <Col>
                <p className="m-0 text-muted">{t("who-we-are")}</p>
                <p className="m-0 text-muted">{t("frequently-asked-questions")}</p>
                <p className="m-0 text-muted">{t("site-policies")}</p>
                <p className="m-0 text-muted">{t("contact")}</p>
              </Col>
              <Col>
                <p className="m-0 text-muted">LaFabricaDeProyectosBolivar@gmail.com</p>
                <p className="m-0 text-muted">+54 9 11 4545 4545</p>
              </Col>
              <Col>
                <Row className="justify-content-center">
                  <Col className="col-auto">
                    <Instagram size={25} className="text-muted"/>
                  </Col>
                  <Col className="col-auto">
                    <Facebook size={25} className="text-muted"/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="text-muted">
                  &copy; Fabrica de Proyectos 2021 -{" "}
                  {new Date().getFullYear()} {t("all-rights-reserved")}.
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
