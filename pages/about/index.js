import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const About = () => {
  const { t, lang } = useTranslation("common");

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("About Us")}</h1>
    </Container>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default About;
