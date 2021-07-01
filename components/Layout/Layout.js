import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavSearch from "../NavSearch/NavSearch";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import nProgress from "nprogress";
import useTranslation from "next-translate/useTranslation";
import { NavbarToggler, Collapse } from "reactstrap";

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
        </div>
      )}

      <main className="container py-4">
        {/* Title */}
        {title && <h1 className="text-center">{title}</h1>}

        {/* Content */}
        {children}
      </main>

      {footer && (
        <footer className="bg-light text-dark text-center">
          <div className="container">
            <h1>&copy; La Fabrica de Proyectos</h1>
            <p>2021 - {new Date().getFullYear()}</p>
            <p>{t("all-rights-reserved")}.</p>
          </div>
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
