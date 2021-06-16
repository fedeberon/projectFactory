import React from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout/Layout";

const ContactUs = () => {
  const { t, lang } = useTranslation("common");

  return <Layout title={`${t("Contact")}`}></Layout>;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default ContactUs;
