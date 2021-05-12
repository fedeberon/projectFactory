import React, { useEffect, useState } from "react";
import { login } from "../../services/userService";

const initialUsers = [];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(async()=>{
    const users = await login("lucho","1234");
    setUsers(users);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user, index) => {
          return <li key={index}>{user}</li>;
        })}
      </ul>
    </div>
  );
};

export default Users;
