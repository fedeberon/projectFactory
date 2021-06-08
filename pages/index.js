import styles from "../styles/Home.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/Layout";

const Code = (p) => <code className={styles.inlineCode} {...p} />;

const Home = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <Layout
      title={`${t("WelcomeTo")} ${process.env.NEXT_PUBLIC_PROJECT_NAME}`}
    ></Layout>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Home;
