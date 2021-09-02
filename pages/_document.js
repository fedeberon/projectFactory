import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="La Fabrica de Proyectos donde encontras lo que buscas" />
          <script src="https://sdk.mercadopago.com/js/v2"></script>
          <script src="https://www.mercadopago.com/v2/security.js" view="item"></script>
          {/* Nprogress css */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css"
          />

          {/* Favicons */}
          <link rel="shortcut icon" type="image/x-icon" href="/favicon/favicon.ico"/>
          <link rel="icon" type="image/png" href="/favicon/32.png" sizes="32x32"/>
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon/60.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon/76.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon/120.png"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon/152.png"/>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="apple-touch-fullscreen" content="yes"/>
          <meta name="apple-mobile-web-app-status-bar-style" content="default"/>

          {/* pedido por fede */}
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Overpass:wght@200;300;400;600;700;800;900&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
