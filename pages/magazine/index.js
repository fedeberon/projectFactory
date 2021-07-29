import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";

const Magazine = () => {
  const { t } = useTranslation("common");

  return <Layout title={`${t("magazine")}`}></Layout>;
};

export default Magazine;
