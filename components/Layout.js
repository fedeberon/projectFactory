import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import nProgress from "nprogress";

const Layout = ({ children, title, footer = true }) => {
  const router = useRouter();

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
      <Header />
      <main className="container py-4">
        {/* Title */}
        {title && <h1 className="text-center">{title}</h1>}

        {/* Content */}
        {children}
      </main>

      {footer && (
        <footer className="bg-light text-dark text-center">
          <div className="container p-4">
            <h1>&copy; La Fabrica de Proyectos</h1>
            <p>2021 - {new Date().getFullYear()}</p>
            <p>All rights Reserved.</p>
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
