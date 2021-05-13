import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'next-auth/client';
import 'bootstrap/dist/css/bootstrap.css';

function MyApp({ Component, pageProps }) {
  return  (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default appWithTranslation(MyApp);
