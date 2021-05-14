import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";

const ContactUs = () => {
  const { t, lang } = useTranslation("common");

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>Contact Us</h1>
    </Container>
  );
};

export default ContactUs;
