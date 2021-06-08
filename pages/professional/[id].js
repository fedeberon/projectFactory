import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";

const ProfessionalDetail = () => {
  const { t, lang } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title={`${t("ProfessionalDetail")}`}>
      <p>Post: {id}</p>
    </Layout>
  );
};

export default ProfessionalDetail;
