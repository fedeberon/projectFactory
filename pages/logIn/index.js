import React from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import LogInForm from "../../components/LogInForm";
import { getSession } from "next-auth/client";

const LogIn = () => {
  const { t } = useTranslation("common");
  return (
    <Layout title={t("log-in")} header={false} footer={false}>
      <section className="container py-2">
        <LogInForm />
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, query, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default LogIn;
