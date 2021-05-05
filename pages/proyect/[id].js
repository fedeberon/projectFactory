import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

const ProyectDetail = () => {
  const { t, lang } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <Header lang={lang} />
      <h1>Proyect Detail</h1>
      <p>Post: {id}</p>
    </div>
  );
};

export default ProyectDetail;
