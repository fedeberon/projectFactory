import React, { useEffect, useState } from "react";
import { loginUser } from "../../services/userController";

const initialUsers = [];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(async()=>{
    const users = await loginUser("lucho","1234");
    setUsers(users);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user, index) => {
          return <li key={index}>{user}</li>;
        })}
        {/* <li>{users}</li> */}
      </ul>
    </div>
  );
};

export default Users;
