import React from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import SignInForm from "../../components/SignInForm";
import { getSession } from "next-auth/client";

const SignIn = () => {
  const { t } = useTranslation("common");
  return (
    <Layout header={false} footer={false}>
      <section className="container">
        <SignInForm />
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

export default SignIn;
