import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../components/Header";
import { Container } from "reactstrap";
import CarouselBanner from "../components/CustomCarousel/CarouselBanner";

const Code = (p) => <code className={styles.inlineCode} {...p} />;

const items = [
  {
    path: 'https://i.pinimg.com/originals/82/22/cf/8222cfbd3f5c5b8cc8d6de8a83c275e1.jpg',
    name: 'Slide 1',
  },
  {
    path: 'https://images.adsttc.com/media/images/5128/abe0/b3fc/4b11/a700/4c79/newsletter/1285434474-house-in-menorca-dom-arquitectura----dom-arquitectura.jpg?1414370585',
    name: 'Slide 2',
  },
];


const Home = () => {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid>
        <Header lang={lang} />
        <CarouselBanner images={items}/>
        <main className={styles.main}>
          <h1 className={styles.title}>
            {t("Welcome")} to {process.env.NEXT_PUBLIC_PROJECT_NAME}
          </h1>

          <p className={styles.description}>
            Get started by editing{" "}
            <code className={styles.code}>pages/index.js</code>
          </p>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
        </footer>
      </Container>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Home;
