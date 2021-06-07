import React from "react";
import { useTranslation } from "react-i18next";
import ProfileData from "../../components/ProfileData";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout";

const Profile = () => {

  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <h1>{t("Profile")}</h1>
      <ProfileData/>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Profile;