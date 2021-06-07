import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { login } from "../../services/userService";

const initialUsers = [];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(async()=>{
    const users = await login("lucho","1234");
    setUsers(users);
  }, []);

  return (
    <Layout>
      <h1>Users</h1>
      <ul>
        {users.map((user, index) => {
          return <li key={index}>{user}</li>;
        })}
      </ul>
    </Layout>
  );
};

export default Users;
