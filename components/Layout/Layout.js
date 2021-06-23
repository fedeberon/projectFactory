import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../Header/Header";
import NavSearch from "../NavSearch/NavSearch";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import nProgress from "nprogress";
import useTranslation from "next-translate/useTranslation";

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
      {header &&
      <div>
        <NavSearch />
        <Header />
      </div>}

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
