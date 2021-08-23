import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { login } from "../../services/userService";
import useTranslation from "next-translate/useTranslation";
const initialUsers = [];

const Users = () => {
  const { t } = useTranslation("common");
  const [users, setUsers] = useState(initialUsers);

  useEffect(async()=>{
    const users = await login("lucho","1234");
    setUsers(users);
  }, []);

  return (
    <Layout title={t("user")}>
      <ul>
        {users.map((user, index) => {
          return <li key={index}>{user}</li>;
        })}
      </ul>
    </Layout>
  );
};

export default Users;
