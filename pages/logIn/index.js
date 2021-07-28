import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import LogInForm from "../../components/LogInForm";
import { getSession, signOut } from "next-auth/client";
import * as userService from '../../services/userService';

const LogIn = (props) => {
  const { expiredToken } = props;
  const { t } = useTranslation("common");

  useEffect(() => {
    if (expiredToken) {
      userService.clearData();
      signOut();
    }
  }, [])

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
  const expiredToken = query.expired == '' && session;

  if (session && !expiredToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {expiredToken},
  };
}

export default LogIn;
