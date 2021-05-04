import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

const Magazine = () => {
  const { t, lang } = useTranslation("common");

  return (
    <div>
      <Header lang={lang} />
      <h1>Magazine</h1>
    </div>
  );
};

export default Magazine;
