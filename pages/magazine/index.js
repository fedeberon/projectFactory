import React, {useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import InputImages from "../../components/InputImages";

const Magazine = () => {
  const { t, lang } = useTranslation("common");
  const [files, setFiles] = useState([]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Magazine")}</h1>
      <InputImages setFile={setFiles} files={files} accept={"image/*"} multiple={true} name={"previewImage"}/>
    </Container>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Magazine;
