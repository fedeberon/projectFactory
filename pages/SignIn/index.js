import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { login } from "../../services/userService";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SignInForm from "../../components/SignInForm";

const initialUsers = [];

const SignIn= () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(async()=>{
    const users = await login("lucho","1234");
    setUsers(users);
  }, []);

  const { t, lang } = useTranslation("common");
  return (
    <Layout title={t("Sign in")}
    header={false}
    >
      <ul>
        {users.map((user, index) => {
          return <li key={index}>{user}</li>;
        })}
      </ul>
      <SignInForm/>
    </Layout>
  );
};
export const getStaticProps = async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  });

export default SignIn;