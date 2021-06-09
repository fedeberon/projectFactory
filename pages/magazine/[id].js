import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";

const MagazineDetail = () => {
  const { t, lang } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title={`${t("MagazineDetail")}`}>
      <p>Post: {id}</p>
    </Layout>
  );
};

export default MagazineDetail;
