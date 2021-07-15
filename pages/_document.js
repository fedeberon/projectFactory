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
          <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
          {/* Nprogress css */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css"
          />
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
