import React from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";

const Magazine = () => {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <h1>{t("Magazine")}</h1>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Magazine;
