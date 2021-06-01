import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { Provider } from "next-auth/client";
import { Provider as ReduxProvider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import store from "../store";

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ReduxProvider>
  );
}

export default appWithTranslation(MyApp);
