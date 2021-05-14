import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";

const Professional = () => {
  const { t, lang } = useTranslation("common");

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>Professional</h1>
    </Container>
  );
};

export default Professional;
