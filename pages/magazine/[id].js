import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";

const MagazineDetail = () => {
  const { t, lang } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>MagazineDetail</h1>
      <p>Post: {id}</p>
    </Container>
  );
};

export default MagazineDetail;
