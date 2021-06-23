import React from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import SignInForm from "../../components/SignInForm";

const SignIn= () => {

  const { t } = useTranslation("common");
  return (
    <Layout title={t("sign-in")}
    header={false}
    >
      <SignInForm/>
    </Layout>
  );
};

export default SignIn;