import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";

const ContactUs = () => {
  const { t } = useTranslation("common");

  return <Layout title={`${t("contact")}`}></Layout>;
};

export default ContactUs;
