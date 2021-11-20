import React from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";

const MagazineDetail = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title={`${t("magazine-detail")}`}>
      <p>Post: {id}</p>
    </Layout>
  );
};

export default MagazineDetail;
