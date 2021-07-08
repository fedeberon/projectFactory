import React from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import LogInForm from "../../components/LogInForm";

const LogIn= () => {

  const { t } = useTranslation("common");
  return (
    <Layout title={t("sign-in")}
    header={false}
    >
      <LogInForm/>
    </Layout>
  );
};

export default LogIn;