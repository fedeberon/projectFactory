import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";

const About = () => {
  const { t } = useTranslation("common");

  return <Layout title={`${t("about-us")}`}></Layout>;
};

export default About;
