import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

const Professional = () => {
  const { t, lang } = useTranslation("common");

  return (
    <div>
      <Header lang={lang} />
      <h1>Professional</h1>
    </div>
  );
};

export default Professional;
