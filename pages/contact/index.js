import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

const ContactUs = () => {
  const { t, lang } = useTranslation("common");

  return (
    <div>
      <Header lang={lang} />
      <h1>Contact Us</h1>
    </div>
  );
};

export default ContactUs;
