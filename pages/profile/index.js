import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import ProfileData from "../../components/ProfileData";
import { Container } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Profile = () => {

  const { t, lang } = useTranslation("common");

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Profile")}</h1>
      <ProfileData/>
    </Container>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Profile;